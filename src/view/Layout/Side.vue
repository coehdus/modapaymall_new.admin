<template>
	<div
		v-if="is_side"
		class="side"
	>
		<div
			class="side-container flex-column"
		>
			<div
				class="flex-row justify-space-between under-line pa-20 bg-base color-white"
			>
				<span class="color-white">logo-position</span>
				<v-icon
					class="color-white"
				>mdi mdi-arrow-left-bold-box-outline</v-icon>
			</div>

			<ul
				class="side-content overflow-y-auto"
			>
				<li
					v-for="item in items"
					:key="item.category_code"
					class="li-side-content justify-space-between"
					:class="'li-side-depth-' + item.depth"

					@click="toItem(item.category_code)"
				>
					<span>{{ item.category_name }}</span>
					<v-icon
					>mdi mdi-chevron-right</v-icon>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	export default{
		name: 'Side'
		,props: ['Axios']
		,data: function(){
			return {
				items: [

				]
			}
		}
		,computed: {
			is_side: function(){
				let use = true
				let except = ['auth']
				let path = this.$route.path

				except.forEach(function (val) {
					if (path.toLowerCase().indexOf(val) > -1) {
						use = false
						return false
					}
				})
				return use
			}

		}
		,methods: {

		}
		,created: function(){

		}
	}
</script>

<style>

	.side {
		max-width: 300px;
		height: 100%;
	}
	.bg-side {
		width: 100%; height: 100%;
		position: fixed; left: 0; top: 0; z-index: 98;
		background-color: gray;
		opacity: 0.5;
	}
	.side-container{
		width: 80%; height: 100%;
		position: relative;  z-index: 99;
		background-color: white;
		overflow-y: auto;
		border-right: 1px solid #ddd
	}

	.side-container {

	}

	.li-side-content {
		padding: 20px 10px;
		border-bottom: 1px solid #ddd;
	}
	.li-side-depth-1 {
		text-indent: 0px;
	}
	.li-side-depth-2 {
		text-indent: 10px;
	}
	.li-side-depth-3 {
		text-indent: 20px;
	}
	.li-side-depth-4 {
		text-indent: 30px;
	}
</style>