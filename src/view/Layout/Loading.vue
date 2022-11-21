<template>
	<div
		v-if="is_loading"
		style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 999"
	>
		<div
			style="position: absolute; width: 100%; height: 100%; background-color: black; opacity: 0.5"
		></div>
		<div
			style="position: relative; height: 100%; background: none; display: flex; flex-direction: column; justify-content: center; z-index: 9999"
		>
			<v-icon class="spin" style="color: white; font-size: 84px">mdi-rotate-left</v-icon>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Loading'
		,props: []
		,data: function(){
			return {
				is_loading: false
			}
		}
		, methods: {
			on: function(){
				this.is_loading = true
			}
			, off: function(){
				setTimeout(() => {
					console.log('off')
					this.is_loading = false
				}, 300)
			}
		}
		,created() {
			console.log('Loading created !!')
			let self = this
			this.$bus.$on('on', function (type){

				if(type){
					self.on()
				}else{
					self.off()
				}
			})
		}
	}
</script>

<style>

@keyframes spinner {
	to {transform: rotate(-360deg);}
}

.spin {
	animation: spinner 2s linear infinite;
}
</style>