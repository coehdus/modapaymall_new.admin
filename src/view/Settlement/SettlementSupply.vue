<template>
	<div>

		준비중입니다
	</div>
</template>

<script>
export default {
	name: 'SettlementSupply'
	,props: ['Axios']
	,data: function(){
		return {
			program: {
				name: '공급사 정산'
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