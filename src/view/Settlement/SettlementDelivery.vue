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
			,search: {
				ATOKEN: this.TOKEN
			}
			,items: []
		}
	}
	,computed: {
		item_list: function (){
			return this.items.filter(function(item){
				return item
			})
		}
	}
	,methods: {
		getData: async function(){
			try{
				const result = await this.Axios({
					method: 'get'
					,url: 'management/getSettlementDeliveryList'
					,data: this.search
				})

				if(result.success){
					this.items = result.data
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}
		}
	}
	,created() {
		this.getData()
		this.$emit('onLoad', this.program)
	}
}
</script>