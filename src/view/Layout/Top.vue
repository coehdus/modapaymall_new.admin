<template>
	<div>
		<div
			class="logo-position justify-center text-center pa-20 bg-base "
		>
			<a href="/" class="text-center color-white">Logo Position</a>
		</div>

		<div
			class="header-box-menu flex-row justify-space-between bg-white"
		>
			<v-icon
				class="pa-10"
				@click="onSide"
			>mdi mdi-menu</v-icon>

			<input
				type="hidden"
				name="search_type"
				value="pdt_name"
			/>
			<input
				class="flex-3 pa-10 border-lr"
				type="text"
				name="search_value"
				placeholder="검색어를 입력하세요"
			/>

			<v-icon
				class="pa-10"
			>mdi mdi-magnify</v-icon>
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
		}
	}
</script>