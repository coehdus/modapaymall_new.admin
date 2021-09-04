<template>
	<div>

		준비중입니다
	</div>
</template>

<script>
export default {
	name: 'SettlementMinus'
	,props: ['Axios']
	,data: function(){
		return {
			program: {
				name: '정산 차감'
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