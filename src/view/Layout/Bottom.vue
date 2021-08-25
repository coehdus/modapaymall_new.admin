<template>
	<div
		class=""
	>

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
			is_home: function(){
				if(this.$route.path == '/Index'){
					return true
				}else{
					return false
				}
			}
			,is_cart: function(){
				if(this.$route.path == '/Cart'){
					return true
				}else{
					return false
				}
			}
			,is_delivery: function(){
				if(this.$route.path == '/Order/List'){
					return true
				}else{
					return false
				}
			}
			,is_mypage: function(){
				if(this.$route.path.indexOf('/Account') > -1){
					return true
				}else{
					return false
				}
			}
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

<style>
	.on { background-color: #0D47A1; color: white;}
	.on i { color: white !important;}
</style>