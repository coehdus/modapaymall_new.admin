<template>
	<div class="full-height">

	</div>
</template>

<script>
	export default{
		name: 'Shipping'
		,props:[]
		,data: function(){
			return {
				program: {
					name: '주소록'
					,top: false
					,title: true
					,bottom: true

				}
			}
		}
		,created() {
			this.$emit('onLoad', this.program)
		}
	}
</script>