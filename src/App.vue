<template>
	<Layout
		v-if="is_view"
		:Axios="Axios"
		:Notify="Notify"
		:filter="filter"
		:date="date"
		:rules="rules"
		:Base64="Base64"
		:metaInfo="metaInfo"
		:TOKEN="TOKEN"
		:user="user"
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
		,user: {
		}
		,is_view: false
	})
	,methods: {
		isAuth: async function(){
			console.log('isAuth start !!')
			let TOKEN = sessionStorage.getItem(Base64.encode(process.env.VUE_APP_NAME) + 'AT')
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
				await this.setView(true)
				console.log('isAuth skip ! do next !!')
			}else {
				if (!TOKEN || TOKEN === 'false') {
					await this.setView(true)
					console.log('not auth ! to login !!')
					this.toLogin()
				}else{
					this.TOKEN = encodeURI(TOKEN)
					await this.getBaseInfo()
					await this.getBaseCode()
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
						UTOKEN: this.TOKEN
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
					,auth: true
				})

				if(result.success){
					if(result.data.account_info.account_status != '1'){
						document.location.href = process.env.VUE_APP_PUBLIC_PATH + 'Auth/Notice'
					}else {
						await this.setUser(result.data.account_info)
					}
				}else{
					this.toLogin()
					console.log(result.message)
				}
			}catch (e) {
				console.log(e)
			}
		}
		,setUser: async function(account){
			this.user = account
			await this.setView(true)
		}
		,setView: async function(type){
			this.is_view = type
		}
		,setCode: function(code_list){
			let list = this.codes
			code_list.forEach(function(code){
				let main = list[code.main_code]
				if(!main){
					code.items = []
					list[code.main_code] = code
				}else {
					list[code.main_code].items.push(code)
				}
			})
		}
	}
	,created() {
		this.isAuth()
	}
};
</script>

<style>

</style>