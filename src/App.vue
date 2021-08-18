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
				}
			}

			console.log('isAuth finished !!')
		}
		,toLogin: function(){
			this.$router.push({ name: 'Login' })
		}
	}
	,created() {
		this.isAuth()
	}
};
</script>
