<template>
	<div
		class="full-height"
	>
		<div class="full-height">
			<template
				v-if="cart_items.length > 0"
			>
			<ul>
				<li
					v-for="(item, item_index) in cart_items"
					:key="item.pdt_company"
				>
					<div
						class="pa-10 under-line"
					><v-icon>mdi mdi-home-modern</v-icon>{{ item.pdt_company }}</div>
					<ul>
						<li
							v-for="(product, product_index) in item.items"
							:key="'product_' + product_index"
							class="pa-10 under-line justify-space-between"
						>
							<div class="flex-1 pdt-img justify-center flex-column"><img :src="'http://delimall.co.kr/API/data/product/' + product.pdt_img" alt="main1"></div>
							<div class="flex-3">
								<div class=" ptb-10 under-line">{{ product.pdt_name }}</div>
								<div
									v-for="(option, index) in product.pdt_option"
									:key="'odt_' + index"
									class=" ptb-10 under-line-dashed"
								>
									<div class="justify-space-between">
										<span>{{ option.odt }}</span>
										<v-icon
											small class="color-red "
											@click="removeCart(item, item_index, product, product_index, product.pdt_option, index)"
											style="border: 1px solid #ddd; padding: 0px 5px"
										>mdi mdi-close</v-icon>
									</div>
									<div
										class="mt-10 justify-space-between"
									>
										<span
											class="flex-1"
										>{{ option.odt_price }}</span>
										<span
											class="flex-1 flex-row justify-space-between box-pdt-cnt"
										>
											<button
												@click="setCnt(option, 'down')"
												class="flex-1 mdi mdi-minus"
											></button>
											<input
												v-model="option.odt_cnt"
												type="number"
												name="pdt_cnt"
												class="flex-1 bg-gray-light"
												readonly
											/>
											<button
												@click="setCnt(option, 'up')"
												class="flex-1 mdi mdi-plus"
											></button>
										</span>
									</div>
								</div>

							</div>
						</li>
					</ul>
					<div
						class="pa-10 justify-space-between"
					>
						<span>합계</span>
						<span>{{ item.company.total_price | makeComma }}</span>
					</div>
					<div
						class="pa-10 justify-space-between"
					>
						<span>배송비 {{ item.company.free_price | makeComma }}이상 {{ item.company.delivery_type }}</span>
						<span>{{ item.company.delivery_price }}</span>
					</div>
				</li>
			</ul>
			</template>
			<div
				v-else
				class="full-height flex-column justify-center"
			>
				<div class="text-center">No Data</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		name: 'Cart'
		,props: ['Axios']
		,data: function(){
			return {
				program: {
					name: '장바구니'
					,top: false
					,title: true
					,bottom: true
				}
				,cart_items: [

				]
			}
		}
		,methods: {
			getData: function(){
				let cart_items = localStorage.getItem('cart_items')
				if(cart_items && cart_items !== 'false') {
					this.$set(this, 'cart_items', JSON.parse(cart_items))
				}
			}
			,removeCart: function(item, item_index, product, product_index, option, index){
				if(confirm('해당 상품을 삭제하시겠습니까?')){

					this.$delete(option, index)

					if(product.pdt_option.length <= 0){
						this.$delete(item.items, product_index)
					}
					if(item.items.length <= 0){
						this.$delete(this.cart_items, item_index)
					}

					localStorage.setItem('cart_items', JSON.stringify(this.cart_items))

				}
			}

			,setCnt: function(odt, type){
				let cnt = odt.odt_cnt
				if(cnt == ''){
					cnt = 1
				}
				if(type == 'up'){
					if(cnt >= 99){
						cnt = 99
					}else{
						cnt = Number(cnt) + 1
					}
				}else{
					if(cnt <= 1){
						cnt = 1
					}else{
						cnt = Number(cnt) - 1
					}
				}
				odt.odt_cnt = cnt
			}
		}
		,created: function(){
			this.$emit('onLoad', this.program)
			this.getData()
		}
	}
</script>

<style>

.pdt-cnt {
	padding: 10px;
	border: 1px solid #ddd;
}
.box-pdt-cnt {
}

.box-pdt-cnt > button {
	border: 1px solid #ddd;
	width: 100%;
	font-size: 20px;
}
.box-pdt-cnt > input {
	border: none;
	border-top: 1px solid #ddd;
	border-bottom: 1px solid #ddd;
	padding: 0px 5px;
	width: 100%;
	text-align: center;
}

.pdt-img {
	margin-right: 10px
}
.pdt-img img {width: 100%}
</style>