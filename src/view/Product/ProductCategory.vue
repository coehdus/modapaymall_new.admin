<template>
	<div
		class="full-height"
	>

	</div>
</template>

<script>
	export default {
		name: 'ProductCategory'
		,props: ['Axios', 'member_info']
		,data: function(){
			return {
				program: {
					name: '상품 카테고리'
					,top: true
					,title: true
					,search: false
					,bottom: false
				}
			}
		}
		,methods: {

		}
		,created() {
			this.$emit('onLoad', this.program)
		}
	}
</script>