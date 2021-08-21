<template>
	<div
		class="bg-title position-relative justify-space-between "
	>
		<button
			:title="program.name"
			@click="toBack()"
		><v-icon large class="">mdi-chevron-left</v-icon><span class=" font-weight-bold size-em-15 vertical-middle">{{ program.name }}</span></button>

		<span
			class=" ptb-5 flex-column "
			@click="toCart"
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
		,props: ['program', 'cart_cnt']
		,methods: {
			toBack: function(){
				this.$router.back()
			}
			,toCart: function(){
				this.$emit('push', 'Cart')
			}
		}
	}
</script>