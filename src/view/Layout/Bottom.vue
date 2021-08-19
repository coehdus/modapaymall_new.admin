<template>
	<div
		class="bottom justify-space-between text-center box-shadow-top position-relative bg-white"
	>
		<span
			class="flex-1 ptb-10 flex-column"
			@click="toHome"
		>
			<v-icon
			>mdi mdi-store</v-icon>
			홈
		</span>
		<span
			class="flex-1 ptb-10 flex-column position-relative"
			@click="toCart"
		>
			<v-icon>mdi mdi-cart-outline</v-icon>
			장바구니
			<span
				v-if="cart_cnt"
				class="cart-count "
			>{{ cart_cnt }}</span>
		</span>
		<span
			class="flex-1 ptb-10 flex-column"
		>
			<v-icon>mdi mdi-truck-fast</v-icon>배송조회
		</span>
		<span
			class="flex-1 ptb-10 flex-column"
			@click="toMyPage"
		>
			<v-icon>mdi mdi-account-settings</v-icon>마이페이지
		</span>
	</div>
</template>

<script>
	export default{
		name: 'Bottom'
		,data: function(){
			return {

			}
		}
		,computed: {
			cart_cnt: function(){
				let cnt = 0

				let cart_items = localStorage.getItem('cart_items')

				if(cart_items && cart_items !== 'false'){
					console.log(cart_items)
					cart_items = JSON.parse(cart_items)
					for(let i = 0; i < cart_items.length; i++){
						cnt += cart_items[i].items.length
					}
				}else{
					console.log(111)
				}

				return cnt
			}
		}
		,methods: {
			toHome: function(){
				this.$router.push({ name: 'Index'})
			}
			,toMyPage: function(){
				this.$router.push({ name: 'MyPage'})
			}
			,toCart: function(){
				this.$router.push({ name: 'Cart'})
			}
		}
	}
</script>