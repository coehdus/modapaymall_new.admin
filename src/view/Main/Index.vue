<template>
	<div class="flex-column full-height bg-gray-light">
		<div class="main-pdt pa-10 full-height  overflow-y-auto">
			<div
				v-for="item in items"
				:key="item.pdt_uid"
				class="main-box-pdt box-shadow mb-30"
			>
				<div class="pdt-img pa-30 under-line"><img src="" width="100%"/><v-icon class="mdi mdi-image none-img"></v-icon></div>
				<div class="pdt-info pa-10 flex-row justify-space-between">
					<span class="pdt-title">pdt-title</span>
					<span class="price">pdt-price</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	

	export default{
		name: 'Main'
		,
		components: {},
		props: ['Axios']
		,data: function(){
			return {
				program: {
					name: '딜리몰'
					,top: true
					,title: false
					,bottom: true
				}
				,member_info: {

				}
				,cart_cnt: 0
				,items: [
					{}, {}, {}, {}
				]
			}
		}
		,methods: {
		}
		,created: function(){
			this.$emit('onLoad', this.program)
		}
	}
	
</script>

<style>

</style>
