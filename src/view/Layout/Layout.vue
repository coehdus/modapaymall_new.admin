<template>
	<div
		class="full-height flex-column bg-base theme-dark"
	>
		<Loading
			v-if="is_loading"
		></Loading>
		<Top
			v-if="program.top"
			:program="program"
			:user="user"
			:codes="codes"
			:Base64="Base64"
			:rules="rules"
			:TOKEN="TOKEN"
			:Axios="Axios"

			@push="toLocation"
			@setNotify="setNotify"
		></Top>
		<div
			class="full-height justify-space-between overflow-y-auto"
		>
			<Side
				v-if="is_side"
				:Axios="Axios"
				:user="user"

				@toggleSide="toggleSide"
				@push="toLocation"
			>
			</Side>

			<div class="flex-1 full-height flex-column overflow-y-auto">
				<Title
					v-if="program.title"
					:program="program"
					:cart_cnt="cart_cnt"

					@push="toLocation"
				></Title>
				<Search
					v-if="program.search"
					:program="program"
					@toggleSide="toggleSide"
				></Search>

				<router-view
					:Axios="Axios"
					:Notify="Notify"
					:metaInfo="metaInfo"
					:rules="rules"
					:TOKEN="TOKEN"
					:cart_items="cart_items"
					:user="user"
					:filter="filter"
					:key="$route.fullPath"
					:date="date"
					:codes="codes"
					:category_list="category_list"
					:supply_list="supply_list"

					@setNotify="setNotify"
					@onLoad="setProgram"
					@push="toLocation"
					@goBack="goBack"

					@onLoading="onLoading"
					@offLoading="offLoading"
					class="pa-10 full-height flex-column overflow-y-auto"
				></router-view>
			</div>
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
	import Title from "@/view/Layout/Title";
	import Search from "@/view/Layout/Search";
	import Loading from "@/view/Layout/Loading";
	
	export default{
		name: 'Layout'
		,props: ['Axios', 'Notify', 'metaInfo', 'rules', 'TOKEN', 'user', 'filter', 'date', 'codes', 'Base64']
		,components: {Loading, Search, Title, Side, Top, Notify }
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
				,category_list: null
				,supply_list: null
				,is_loading: false
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
			,toLocation: function({ name, params, query}){
				this.$router.push({ name: name, params: params, query: query}).catch(function(e){
					console.log(e)
				});
			}
			,goBack: function(){
				this.$router.back()
			}
			,getSupplyList: async function(){
				try{
					const result = await this.Axios({
						method: 'post'
						,url: 'management/getSupplyList'
						,data: {
							ATOKEN: this.TOKEN
						}
					})

					if(result.success){
						this.supply_list = result.data.result
					}else{
						this.$emit('setNotify', { type: 'error', message: result.message })
					}
				}catch (e) {
					console.log(e)
				}
			}
			,getCategoryList: async function(){
				try{
					const result = await this.Axios({
						method: 'post'
						,url: 'management/getCategoryList'
						,data: {
							ATOKEN: this.TOKEN
						}
					})

					if(result.success){
						this.category_list = result.data.result
					}else{
						this.$emit('setNotify', { type: 'error', message: result.message })
					}
				}catch (e) {
					console.log(e)
				}
			}
			,onLoading: function(){
				this.is_loading = true
			}
			,offLoading: function(){
				setTimeout(() => {
					this.is_loading = false
				}, 300)
			}
		}
		,created: function(){
			this.getCategoryList()
			this.getSupplyList()

			console.log(this.codes)
		}
		,watch: {
			TOKEN: {
				immediate: true
				,handler: function(call){
					if(call){
						this.is_side = true
					}else{
						this.is_side = false
					}
				}
			}
		}
	}
	
</script>

<style lang="css" src="@/assets/css/reset.css"></style>
<style lang="css" src="@/assets/css/base.css"></style>
<style lang="css" src="@/assets/css/theme/dark.css"></style>

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

</style>