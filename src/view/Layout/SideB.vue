<template>
	<div
		class="side-b ml-10 flex-column full-height"
	>
		<h6
			class="justify-space-between bg-gray pa-10 color-gray-light"
			:class="bgTitle"
		>
			{{ title }}

			<v-icon
				small
				class="box color-white"
				@click="$emit('click')"
			>mdi mdi-close</v-icon>
		</h6>
		<slot
			name="item"
			class="flex-column overflow-y-auto"
		>
		</slot>
	</div>
</template>

<script>

	export default {
		name: 'SideB'
		,props: ['Axios', 'title', 'bg-title']
	}
</script>

<style>
	.side-b {
		width: 480px;
		border: 1px solid #ddd;
	}
</style>