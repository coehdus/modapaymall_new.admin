<template>
	<div
		class="side"
	>
		<div
			class="bg-side"
			@click="toggleSide"
		></div>

		<div
			class="side-container flex-column"
		>
			<div
				class="pa-10 flex-row justify-space-between under-line"
			>
				<span>logo-position</span>
				<v-icon
					@click="toggleSide"
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
		,methods: {
			getData: async function(){
				try{
					const result = await this.Axios({
						method: 'post'
						,url: '/product/getCategory'
					})
					if(result.success){
						this.items = result.data.category
					}else{
						this.$emit('setNotify', { type: 'error', message: result.message})
					}
				}catch (e) {
					console.log(e)

				}
			}
			,toItem: function(category){
				this.$router.push({ name: 'ProductList', params: { category: category}})
				this.toggleSide()
			}
			,toggleSide: function(){
				this.$emit('toggleSide')
			}
		}
		,created: function(){
			this.getData()
		}
	}
</script>

<style>

	.side {
		width: 100%; height: 100%;
		position: fixed; left: 0; top: 0; z-index: 98;
	}
	.bg-side {
		width: 100%; height: 100%;
		position: fixed; left: 0; top: 0; z-index: 98;
		background-color: gray;
		opacity: 0.5;
	}
	.side-container{
		width: 80%; height: 100%;
		max-width: 300px;
		position: relative;  z-index: 99;
		background-color: white;
		overflow-y: auto;
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