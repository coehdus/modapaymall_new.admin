<template>
	<Layout 
		:Axios="Axios"
		:Notify="Notify"
	/>
</template>

<script>
	
	import { Axios } from '@/resources/axios/axios'
	import { Notify } from '@/components/AlertMsg'

	import Layout from '@/view/Layout/Layout.vue'

export default {

	name: 'App'
	,components: { Layout }
	,data: () => ({
		Axios: Axios
		,Notify: Notify
	}),
};
</script>
