<template>
	<div
		class="bottom justify-space-between text-center box-shadow-top position-relative bg-white position-relative"
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
			@click="toOrderList"
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
		,props: ['cart_cnt']
		,data: function(){
			return {

			}
		}
		,computed: {
		}
		,methods: {
			toHome: function(){
				this.$emit('push', 'Index')
			}
			,toMyPage: function(){
				this.$emit('push', 'MyPage')
			}
			,toCart: function(){
				this.$emit('push', 'Cart')
			}
			,toOrderList: function (){
				this.$emit('push', 'OrderList')
			}
		}
	}
</script>