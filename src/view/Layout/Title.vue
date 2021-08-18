<template>
	<div
		class="bg-title"
	>
	<button
		:title="program.name"
		@click="toBack()"
	><v-icon large class="">mdi-chevron-left</v-icon><span class=" font-weight-bold size-em-15 vertical-middle">{{ program.name }}</span></button>
	</div>
</template>

<script>
	export default{
		name: 'Title'
		,props: ['program']
		,methods: {
			toBack: function(){
				this.$router.back()
			}
		}
	}
</script>