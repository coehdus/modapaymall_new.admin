<template>
	<div
		class="bg-title position-relative justify-space-between "
	>
		<h5>{{ program.name }}</h5>

		<span
			v-if="is_cart_view"
			class=" ptb-5 flex-column "
		>
			<v-icon class="mr-10">mdi mdi-cart-outline</v-icon>
			<span
				v-if="cart_cnt"
				class="cart-count "
			>{{ cart_cnt }}</span>
		</span>
	</div>
</template>

<script>
	export default{
		name: 'Title'
		,props: ['program', 'cart_cnt', 'is_cart_view']
		,methods: {
			toBack: function(){
				this.$router.back()
			}
		}
	}
</script>