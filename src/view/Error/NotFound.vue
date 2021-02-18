<template>
	<div
		fill-height
		class="bg-error"
		style="width: 100%"
	>
		
		<div 
			class="text-white text-center text-subtitle-1 mt-10" 
			style="margin-top: 15%; line-height: 60px; font-size: 2em;"
		>
			<div class="text-center">
				<v-icon 
					large 
					style="color: red;"
				>mdi-alert-outline</v-icon>
			</div>
			<p>존재하지 않는 페이지입니다</p>
			<p>확인 후 다시 이용해주세요.</p>
		</div>
	</div>
</template>

<script>
	export default{
		name: 'ErrorNetwork'
		,created: function(){
			this.$emit('setProgram', this.program)
		}
		,data: function(){
			return {
				program: {
					title: 'Not Found Page'
					,not_header: true
				}
			}
		}	
	}
</script>

<style>
	.bg-error {background-color: #15324E !important; color: white; text-align: center;}
	.fill-height {height: 100%; width: 100%;}
</style>