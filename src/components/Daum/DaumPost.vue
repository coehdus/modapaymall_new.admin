<template>
	
	<v-card
		v-if="overlay"
		color="indigo"
		style="position: fixed; top: 10%; z-index: 9999; background-color: #00bfa5; color: white; "
		class="pa-0"
	>
		<v-card-title
		>
			주소 찾기 <v-btn @click="daumComplate" class="float-right" icon color="white" style="position: absolute; right: 10px; top: 15px; color: white;"><v-icon large>mdi-close-box-outline</v-icon></v-btn>
		</v-card-title>
		<v-divider></v-divider>
		<v-card-text
			class="pa-0 ma-0"
			style="padding: 0 !important; width: 550px; max-height: 550px; overflow: auto;"
		>
			<VueDaumPostcode
				@complete="daumComplate"
				style="padding: 0;"
			>
			</VueDaumPostcode>
		</v-card-text>
	</v-card>
	
</template>

<script>

	import { VueDaumPostcode } from "vue-daum-postcode"
	
	export default{
		name: 'DaumPost'
		,props: ['overlay', 'config']
		,components: {VueDaumPostcode}
		,data () {
			return {
			}
		}
		,methods: {
			
			daumComplate: function(call){
				console.log(call)
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