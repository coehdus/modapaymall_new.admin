<template>
	<div>
		<div
			class="logo-position justify-center text-center pa-20 bg-base "
			@click="toMain"
		>
			<span class="text-center color-white">Logo Position</span>
		</div>
	</div>
</template>

<script>
	export default{
		name: 'Top'
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