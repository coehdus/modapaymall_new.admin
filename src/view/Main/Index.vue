<template>
	<div>
		Base
	</div>
</template>

<script>
	
	export default{
		name: 'Main'
		,props: ['Axios']
		,data: function(){
			return {
			
			}
		}
		,created: function(){
			this.$emit('setNotify', { type: 'success', message: 'base template'})
		}
	}
	
</script>