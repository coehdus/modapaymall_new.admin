<template>
	<div>

		준비중입니다
	</div>
</template>

<script>
export default {
	name: 'SettlementDelivery'
	,props: ['Axios']
	,data: function(){
		return {
			program: {
				name: '배송비 정산'
				,top: true
				,title: true
				,bottom: false
			}
		}
	}

	,created() {
		this.$emit('onLoad', this.program)
	}
}
</script>