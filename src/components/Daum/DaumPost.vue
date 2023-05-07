<template>

	<div
		v-if="overlay"
		class="position-fixed-full"
	>
		<div class="bg-layer"></div>
		<div
			class="position-relative full-height flex-column justify-center items-center"
		>
			<div
				class="ma-auto container-address"
			>
				<div
					class="bg-address color-white pa-10 flex-row justify-space-between"
				>
					<span class="color-white size-px-24">주소 찾기</span>
					<button
						@click="daumComplate"
					><v-icon large class="color-white">mdi-close-box-outline</v-icon></button>
				</div>
				<VueDaumPostcode
					@complete="daumComplate"
					class="body-address"
				>
				</VueDaumPostcode>
			</div>
		</div>
	</div>
</template>

<script>

import { VueDaumPostcode } from "vue-daum-postcode"

export default{
	name: 'DaumPost'
	,props: ['overlay', 'config']
	,components: { VueDaumPostcode }
	,data () {
		return {
		}
	}
	,methods: {
		daumComplate: function(call){
			this.$emit('callBack', call)
		}
	}
	,watch: {
		modal: {
			deep: true
			,handler: function(call){
				console.log('watch modal')
				if(call){
					this.callModal()
				}else{
					this.removeModal()
				}
			}
		}
	}
}
</script>

<style>

.position-fixed-full {
	position: fixed; left: 0; top: 0; width: 100%; height: 100%;
}
.z-index-layer {
	z-index: 9999;
}
.z-index-contents {
	z-index: 9998;
}
.z-index-bg {
	z-index: 9997;
}

.bg-layer {
	position: absolute; left: 0; top: 0; width: 100%; height: 100%; opacity: 0.5; background-color: black;
}

.bg-address {
	background-color: #0f6ecd
}

.container-address {
	width: 480px;
}

.body-address {
	max-height: 600px; overflow: auto;
}
</style>