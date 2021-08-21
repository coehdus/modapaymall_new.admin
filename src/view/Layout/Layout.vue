<template>
	<div class="full-height" style="overflow: hidden">
		<Side
			v-if="is_side"
			:Axios="Axios"

			@toggleSide="toggleSide"
			@push="toLocation"
		>
		</Side>
		<div
			class="full-height flex-column"
		>
			<Top
				v-if="program.top"
				:program="program"
				@toggleSide="toggleSide"
				@push="toLocation"
			></Top>
			<Title
				v-if="program.title"
				:program="program"
				:cart_cnt="cart_cnt"

				@push="toLocation"
			></Title>

			<router-view
				:Axios="Axios"
				:Notify="Notify"
				:metaInfo="metaInfo"
				:rules="rules"
				:TOKEN="TOKEN"
				:cart_items="cart_items"
				:member_info="member_info"
				:filter="filter"
				:key="$route.fullPath"
				:date="date"
				:cart_cnt="cart_cnt"

				@setNotify="setNotify"
				@onLoad="setProgram"
				@getCartList="getCartList"

				class=" overflow-y-auto"
				@push="toLocation"
			></router-view>

			<Bottom
				v-if="program.bottom"

				:cart_cnt="cart_cnt"
				@push="toLocation"
			></Bottom>
		</div>

		<Notify
			:msg="notifyCondition.message"
			:type="notifyCondition.type"

			@clearMsg="clearMsg"
		/>
	</div>
</template>

<script>

	import Notify from '@/components/AlertMsg'
	import Side from "@/view/Layout/Side";
	import Top from "@/view/Layout/Top";
	import Bottom from "@/view/Layout/Bottom";
	import Title from "@/view/Layout/Title";
	
	export default{
		name: 'Layout'
		,props: ['Axios', 'Notify', 'metaInfo', 'rules', 'TOKEN', 'member_info', 'filter', 'date']
		,components: {Title, Bottom, Side, Top, Notify }
		,data: function(){
			return {
				program: {
				}
				,notifyCondition: {
					message: '메시지 입니다'
					,type: ''
				}
				,is_side: false
				,cart_items: [

				]
			}
		}
		,computed:{
			cart_cnt: function(){
				return this.cart_items.length
			}
		}
		,methods: {
			setNotify: function({type, message}){
				this.notifyCondition = {
					message: message
					,type: type
				}
			}
			,clearMsg: function(){
				this.notifyCondition.message = ''
			}
			,toggleSide: function(){
				this.is_side = !this.is_side
			}
			,setProgram: function(program){
				this.program = program
			}
			,getCartList: async function(){
				try{
					const result = await this.Axios({
						method: 'post'
						,url: 'order/getCartList'
						,data: {
							TOKEN: sessionStorage.getItem('delimallT')
						}
					})

					if(result.success){
						this.cart_items = result.data.content.result
					}else{
						this.$emit('setNotify', { type: 'error', message: result.message})
					}
				}catch (e) {
					console.log(e)
				}
			}
			,toLocation: function(path, params){
				this.$router.push({ name: path, params: params}).catch(function(e){
					console.log(e)
				});
			}
		}
		,created: function(){
			this.getCartList()
		}
	}
	
</script>

<style lang="css" src="@/assets/css/reset.css"></style>
<style lang="css" src="@/assets/css/base.css"></style>

<style lang="css" src="@/assets/css/dream/reset.css"></style>

<style>

.cart-count {
	position: absolute;
	right: 10px;
	top: 5px;
	background-color: #0093e2;
	border: 1px solid #ddd;
	border-radius: 5px;
	color: white;
	font-size: 12px;
	padding: 3px 5px;
	line-height: 100%;
}


.company-list {
	font-family: "\B9D1\C740 \ACE0\B515",Malgun Gothic,Apple-Gothic,Helvetica,Dotum,\\B3CB\C6C0,Gulim
}

.cart-none-list {
	display: none;
}

.main-box-pdt { background-color: white; border-radius: 10px 0px 0px 0px;}
.main-box-pdt img { border-radius: 10px 0px 0px 0px;}

.box-shadow-top { box-shadow: 0px 3px 6px black}
.box-shadow-inset { box-shadow: 0px 0px 2px 1px #bbb inset}
.box-shadow { box-shadow: 1px 1px 3px 1px #bbb}

.border-tb { border-top: 1px solid #ddd; border-bottom: 1px solid #ddd;}
.border-lr { border-left: 1px solid #ddd; border-right: 1px solid #ddd;}

.bg-base { background-color: #0165fa}

	.logo-position {

	}
	.header-box-menu {
		border-bottom: 1px solid #ddd;
	}

	.icon-box {
		padding: 5px;
		border: 1px solid #ddd;
	}

	.bg-title {
		padding: 10px;
		box-shadow: 0 0 3px 1px gray;
	}
</style>