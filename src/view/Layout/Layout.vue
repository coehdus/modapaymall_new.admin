<template>
	<div class="full-height" style="overflow: hidden">
		<Side
			v-if="is_side"
			:Axios="Axios"

			@toggleSide="toggleSide"
		>
		</Side>
		<div
			class="full-height flex-column"
		>
			<Top
				v-if="program.top"
				:program="program"
				@toggleSide="toggleSide"
			></Top>
			<Title
				v-if="program.title"
				:program="program"
			></Title>
			<router-view
				:Axios="Axios"
				:Notify="Notify"
				:metaInfo="metaInfo"
				:rules="rules"
				:TOKEN="TOKEN"

				@setNotify="setNotify"
				@onLoad="setProgram"
				class=" overflow-y-auto"
			></router-view>
			<Bottom
				v-if="program.bottom"

				:cart_cnt="cart_cnt"
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
		,props: ['Axios', 'Notify', 'metaInfo', 'rules', 'TOKEN']
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
			}
		}
		,computed:{
			cart_cnt: function(){
				let cnt = 0

				let cart_items = localStorage.getItem('cart_items')

				if(cart_items && cart_items !== 'false'){
					console.log(cart_items)
					cart_items = JSON.parse(cart_items)
					for(let i = 0; i < cart_items.length; i++){
						cnt += cart_items[i].items.length
					}
				}

				return cnt
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
		}
		,mounted() {
			window.onstorage = () => {
				console.log(11)
			}
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