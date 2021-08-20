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
	/>
</template>

<script>
	
	import { Axios } from '@/resources/axios/axios'
	import { Notify } from '@/components/AlertMsg'
	import { filter } from '@/resources/filter/filter'
	import { date } from '@/resources/date/date'
	import { rules } from '@/resources/rules/rules'
	import { metaInfo } from '@/resources/config/metainfo'

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
		,TOKEN: ''
		,member_info: {

		}
	})
	,methods: {
		isAuth: function(){
			console.log('isAuth start !!')
			let TOKEN = sessionStorage.getItem('delimallT')
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
				}
			}

			console.log('isAuth finished !!')
		}
		,toLogin: function(){
			this.$router.push({ name: 'Login' })
		}
		,getBaseInfo: async function(){
			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'member/getBaseInfo'
					,data: {
						TOKEN: this.TOKEN
					}
				})

				if(result.success){
					this.member_info = result.data.member_info
					this.shop_info = result.data.shop_info
					this.seller_info = result.data.seller_info
				}else{
					console.log(result.message)
				}
			}catch (e) {
				console.log(e)
			}
		}
	}
	,created() {
		this.isAuth()
	}
};
</script>
