<template>
	<div class="flex-column full-height bg-gray-light">

	</div>
</template>

<script>

	export default{
		name: 'Main'
		,props: ['Axios']
		,components: {}
		,data: function(){
			return {
				program: {
					name: '대시보드'
					,top: true
					,title: true
					,search: false
					,bottom: false
				}
				,member_info: {

				}
				,items: [
					{}, {}, {}, {}
				]
				,item: {

				}
			}
		}
		,methods: {
			getData: async function(){
				const result = await this.Axios({
					method: 'post'
					,url: 'product/getMainProduct'
					,data: {
						TOKEN: sessionStorage.getItem('delimallAT')
					}
				})

				if(result.success){
					this.items = result.data.result.result
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message})
				}
			}
			,goDetail(item){
				item.TOKEN = sessionStorage.getItem('delimallAT')
				this.$set(this, 'item', item)
			}
			,clear(){
				this.$set(this, 'item', {})
				this.setProgram(this.program)
			}
			,setProgram(program){
				this.$emit('onLoad', program)
			}
			,setNotify({ type, message}){
				this.$emit('setNotify', { type: type, message: message })
			}
		}
		,created: function(){
			this.$emit('onLoad', this.program)
			this.getData()
		}
	}
	
</script>

<style>

	.label { color: white; border-radius: 5px; padding: 3px 7px 3px; line-height: 12px !important; font-size: 10px;}
	.label-new { background-color: #0D47A1;}
	.label-hot { background-color: #e64a19;}
	.label-recomm { background-color: #0f9d58;}
	.label-season { background-color: #00b0ff;}
</style>
