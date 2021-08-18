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
			<router-view
				:Axios="Axios"
				:Notify="Notify"
				:metaInfo="metaInfo"
				:rules="rules"

				@setNotify="setNotify"
				@onLoad="setProgram"
				class=" overflow-y-auto"
			></router-view>
			<Bottom
				v-if="program.bottom"
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
	
	export default{
		name: 'Layout'
		,props: ['Axios', 'Notify', 'metaInfo', 'rules']
		,components: {Bottom, Side, Top, Notify }
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
	}
	
</script>

<style lang="css" src="@/assets/css/reset.css"></style>
<style lang="css" src="@/assets/css/base.css"></style>

<style lang="css" src="@/assets/css/dream/reset.css"></style>

<style>
	.bg-title {
		padding: 10px;
		box-shadow: 0 0 3px 1px gray;
	}
</style>