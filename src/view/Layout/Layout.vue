<template>
	<div class="full-height">
		<div
			class="full-height"
		>
			<router-view
				:Axios="Axios"
				:Notify="Notify"
				:metaInfo="metaInfo"

				@setNotify="setNotify"
				class="overflow-y-auto"
			></router-view>

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
	
	export default{
		name: 'Layout'
		,props: ['Axios', 'Notify', 'metaInfo']
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

<style lang="css" src="@/assets/css/reset.css"></style>
<style lang="css" src="@/assets/css/base.css"></style>

<style lang="css" src="@/assets/css/dream/reset.css"></style>
