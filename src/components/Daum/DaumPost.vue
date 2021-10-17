<template>

	<div
		v-if="overlay"
		class="position-fixed full-width full-height overflow-y-auto"
		style="z-index: 9999; top: 0; left: 0;"
	>
		<div
			class="position-absolute full-width full-height bg-black opacity-05"
			style="top: 0; left: 0;"
		>
		</div>
		<div
			class="position-relative full-height overflow-y-auto flex-column justify-center"
			style="z-index: 1; margin: auto; "
			:style="config.width ? 'width: ' + config.width: ''"
		>
			<div
				class="bg-blue-light full-width justify-space-between pa-10"
			>
				<span class=" white size-px-24">주소 찾기</span>
				<button
					@click="daumComplate"
				><v-icon large class="color-icon"
				>mdi-close-box-outline</v-icon></button>
			</div>
			<VueDaumPostcode
				@complete="daumComplate"
				class="full-width overflow-y-auto"
			>
			</VueDaumPostcode>
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