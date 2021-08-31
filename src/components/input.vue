<template>
	<div>
		<template
			v-if="type == 'text'"
		>
			<input
				/>
			<v-icon
			>mdi mdi-keyboard</v-icon>
		</template>
	</div>
</template>

<script>
	export default {
		name: 'Input'
		,props: ['type']
		,data: function(){
			return {

			}
		}
	}
</script>

<style>

</style>