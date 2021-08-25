<template>
	<div>
		{{ member_info.admin_name }}
	</div>
</template>

<script>
	export default{
		name: 'Top'
		,props: ['member_info']
		,methods: {
			onSide: function(){
				this.$emit('toggleSide')
			}
			,toMain: function(){
				this.$emit('push', 'Index')
			}
		}
	}
</script>