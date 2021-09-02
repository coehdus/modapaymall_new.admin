<template>
	<Layout 
		:Axios="Axios"
		:Notify="Notify"
		:filter="filter"
		:date="date"
		:rules="rules"
		:Base64="Base64"
		:metaInfo="metaInfo"
		:TOKEN="TOKEN"
		:member_info="member_info"
		:codes="codes"
	/>
</template>

<script>
	
	import { Axios } from '@/resources/axios/axios'
	import { Notify } from '@/components/AlertMsg'
	import { filter } from '@/resources/filter/filter'
	import { date } from '@/resources/date/date'
	import { rules } from '@/resources/rules/rules'
	import { metaInfo } from '@/resources/config/metainfo'
	import { codes } from '@/resources/config/codes'

	import { Base64 } from 'js-base64'

	import Layout from '@/view/Layout/Layout.vue'

export default {

	name: 'App'
	,metaInfo: metaInfo
	,components: { Layout }
	,data: () => ({
		Axios: Axios
		,Notify: Notify
		,date: date
		,filter: filter
		,rules: rules
		,Base64: Base64
		,metaInfo: metaInfo
		,codes: codes
		,TOKEN: ''
		,member_info: {

		}
	})
	,methods: {
		isAuth: function(){
			console.log('isAuth start !!')
			let TOKEN = sessionStorage.getItem('delimallAT')
			let skip = false
			let except = ['auth']
			let path = document.location.href
			except.forEach(function (val) {
				if (path.toLowerCase().indexOf(val) > -1) {
					skip = true
					return false
				}
			})
			if(skip){
				console.log('isAuth skip ! do next !!')
			}else {
				if (!TOKEN || TOKEN === 'false') {
					console.log('not auth ! to login !!')
					this.toLogin()
				}else{
					this.TOKEN = encodeURI(TOKEN)
					this.getBaseInfo()
					this.getBaseCode()
				}
			}

			console.log('isAuth finished !!')
		}
		,toLogin: function(){
			this.$router.push({ name: 'Login' })
		}
		,getBaseCode: async function(){
			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/getCodeList'
					,data: {
						ATOKEN: this.TOKEN
					}
				})

				if(result.success){
					this.setCode(result.data.result)
				}else{
					this.toLogin()
					console.log(result.message)
				}
			}catch (e) {
				console.log(e)
			}
		}
		,getBaseInfo: async function(){
			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/getBaseInfo'
					,data: {
						ATOKEN: this.TOKEN
					}
				})

				if(result.success){
					this.member_info = result.data.admin_info
				}else{
					this.toLogin()
					console.log(result.message)
				}
			}catch (e) {
				console.log(e)
			}
		}
		,setCode: function(code_list){
			let list = this.codes
			code_list.forEach(function(code){
				let main = list[code.main_code]
				if(!main){
					code.items = []
					list[code.main_code] = code
				}
				list[code.main_code].items.push(code)
			})

			console.log(list)
		}
	}
	,created() {
		this.isAuth()
	}
};
</script>

<style>
	table { width: 100% }
	table thead {

	}

	th {
		background-color: #ddd;
	}


	.pdt-img img { width: 100% }

	td, th {
		padding: 10px;
		border: none;
		border-bottom: 1px solid #ddd;
		text-align: center;
	}

	td:first-child {
		text-align: center;
	}
</style>