<template>
	<div class="flex-column full-height bg-gray-light">
		<ul
			v-if="!item.uid"
			class="mt-20 main-pdt pa-10 full-height  overflow-y-auto"
		>
			<template
				v-if="items.length > 0"
			>
			<li
				v-for="item in items"
				:key="item.pdt_uid"
				class="main-box-pdt box-shadow mb-30 position-relative"

				@click="goDetail(item)"
			>
				<div class="pdt-img pa-5 under-line">
					<img
						v-if="item.pdt_img1"
						:src="'http://delimall.co.kr/API/data/product/' + item.pdt_img1"  width="100%"
					/>
					<v-icon
						v-else
						class="mdi mdi-image none-img"
					></v-icon>
				</div>
				<div class="pdt-info pa-10 flex-row justify-space-between">
					<span class="pdt-title">{{  item.pdt_name }}</span>
					<span class="price">{{ item.pdt_price | makeComma }}</span>
				</div>
				<span
					class="color-blue position-absolute justify-space-between"
					style="right: 10px; top: -10px;"
				>
					<template
						v-if="item.agency_pdt_type"
					>
					<span
						v-if="item.agency_pdt_type.indexOf('new') > -1"
						class="label label-new mr-5"
					>NEW</span>
					<span
						v-if="item.agency_pdt_type.indexOf('hot') > -1"
						class="label label-hot mr-5"
					>HOT</span>
					<span
						v-if="item.agency_pdt_type.indexOf('recomm') > -1"
						class="label label-recomm mr-5"
					>추천</span>
					<span
						v-if="item.agency_pdt_type.indexOf('season') > -1"
						class="label label-season"
					>계절</span>
					</template>

				</span>

			</li>
			</template>
		</ul>

		<ProductDetail
			v-if="item.uid"
			:item="item"
			:Axios="Axios"

			@click="clear"
			@onLoad="setProgram"
			@setNotify="setNotify"
			@getCart="$emit('getCart')"
		></ProductDetail>
	</div>
</template>

<script>
	

	import ProductDetail from "../Product/ProductDetail";
	export default{
		name: 'Main'
		,
		components: {ProductDetail},
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
						TOKEN: sessionStorage.getItem('delimallT')
					}
				})

				if(result.success){
					this.items = result.data.result.result
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message})
				}
			}
			,goDetail(item){
				item.TOKEN = sessionStorage.getItem('delimallT')
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
