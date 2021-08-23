<template>
	<div
		class=" full-height"
	>
		<div
			v-if="!item.uid"
			class="flex-column full-height bg-gray-light"
		>

			<div
				class="flex-column full-height overflow-y-auto"
			>
				<template
					v-if="search.total_count"
				>
					<div class="main-pdt pa-10 full-height  overflow-y-auto">
						<div
							v-for="item in lists"
							:key="item.uid"
							class="main-box-pdt box-shadow mb-30"
							@click="goDetail(item)"
						>
							<div class="pdt-img pa-10 under-line">
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
								<span
									v-if="item.is_sold == 1 || (item.is_sold == 2 && item.pdt_stock < 1)"
									class="pdt-title color-red"
								>품절</span>
								<span
									v-else
									class="pdt-title color-blue"
								>{{  item.pdt_price | makeComma }}</span>
							</div>
						</div>
					</div>
				</template>
				<div
					v-else
					class="flex-column full-height justify-center bg-white"
				>
					<div class="text-center">
						<v-icon class="size-px-48">mdi-cloud-off-outline</v-icon>
						<p class="mt-10 size-px-16">조회된 기록이 없습니다.</p>
					</div>
				</div>
			</div>
		</div>
		<ProductDetail
			v-if="item.uid"
			:item="item"
			:date="date"
			:callBack="callBack"
			:Axios="Axios"
			:cart_cnt="cart_cnt"

			@click="clear"
			@onLoad="setProgram"
			@setNotify="setNotify"
			@getCartList="$emit('getCartList')"
			@push="toCart"
		></ProductDetail>
	</div>
</template>

<script>

import ProductDetail from "@/view/Product/ProductDetail";

export default{
	props: ['Axios', 'user', 'codes', 'date', 'callBack', 'TOKEN', 'cart_cnt']
	,components: { ProductDetail }
	,data: function(){
		return {
			program: {
				name: "상품 목록 " +this.$route.params.category
				,code: 'product_list'
				,top: false
				,title: true
				,search: true
				,bottom: true
				,
			}
			,search: {
				TOKEN:  this.TOKEN
				,pdt_name: ''
				,pdt_category: this.$route.params.category
			}
			,summary: {
				total: 0
			}
			,items: [

			]
			,item: {

			}
		}
	}
	,computed:{
		lists: function(){

			return this.items.filter(function(item){

				return item
			})
		}
	}
	,methods: {
		getData: async function() {

			this.loading = true

			try {
				const result = await this.Axios({
					method: 'post'
					, url: 'product/getProductList'
					, data: this.search
				})

				if (result.success) {
					this.$set(this, 'items', result.data.content.result)

					if (this.items.length > 0) {
						this.$set(this.search, 'total_count', result.data.content.tCnt)
						this.$set(this.search, 'list_cnt', result.data.content.cnt)
					}else{
						this.$set(this.search, 'total_count', 0)
					}

				} else {
					this.$emit('setNotify', {type: 'error', message: result.message})
				}
			} catch (E) {
				console.log(E)
				this.$emit('setNotify', {type: 'error', message: E})
			} finally {
				this.loading = false
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
		,setNotify({ type, message}){
			this.$emit('setNotify', { type: type, message: message })
		}
		,setProgram(program){
			this.$emit('onLoad', program)
		}
		,toCart: function(){
			this.$emit('push', 'Cart')
		}
	}
	,created: function(){
		this.$emit('onLoad', this.program)
		this.getData()
	}
	,watch: {

	}
}
</script>

<style>
.box-payment-list.shadow {
	box-shadow: 0px 5px 10px rgb(0, 0, 0, 0.2)
}
</style>