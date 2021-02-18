<template>
	<div>
		<router-view
			:Axios="Axios"
			:Notify="Notify"
			
			@setNotify="setNotify"
		></router-view>
		
		<Notify 
			:msg="notifyCondition.message" 
			:type="notifyCondition.type"
			
			@clearMsg="clearMsg"
		/>
	</div>
</template>

<script>

	import Notify from '@/components/AlertMsg'
	
	export default{
		name: 'Layout'
		,props: ['Axios', 'Notify']
		,components: { Notify }
		,data: function(){
			return {
				program: {
				}
				,notifyCondition: {
					message: '메시지 입니다'
					,type: ''
				}
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
		}
	}
	
</script>

