<template>
	<div
		class="full-height"
	>
		<div class="full-height">
			<ul>
				<template
					v-if="cart_items.length > 0"
				>
				<li
					v-for="item in cart_items"
					:key="item.pdt_company"
				>
					<div
						class="pa-10 under-line"
					><v-icon>mdi mdi-home-modern</v-icon>{{ item.pdt_company }}</div>
					<ul>
						<li
							v-for="product in item.items"
							:key="'product_' + product.pdt_uid"
							class="pa-10 under-line justify-space-between"
						>
							<div class="flex-1"><img src="" /></div>
							<div class="flex-3">
								<div class=" ptb-10 under-line">{{ product.pdt_name }}</div>
								<div
									v-for="(option, index) in product.pdt_option"
									:key="'odt_' + index"
									class=" ptb-10 under-line-dashed"
								>
									<div class="justify-space-between">
										<span>{{ option.odt }}</span>
										<v-icon small class="color-red ">mdi mdi-close</v-icon>
									</div>
									<div>{{ option.odt_price }}</div>
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
				</template>
			</ul>
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
				this.$set(this, 'cart_items', JSON.parse(cart_items))
			}
		}
		,created: function(){
			this.$emit('onLoad', this.program)
			this.getData()
		}
	}
</script>