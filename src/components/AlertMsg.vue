
<template>		
		
	<v-alert 
		v-show="notify"
		:type="type ? type : 'error'" 
		style="position: fixed; width: auto; bottom: 20%; right: 20px; z-index: 9999; padding-left: 10px;" 
		
		dense
	>
		{{ msg }}
	</v-alert>
	
</template>

<script>
	
	export default{
		name: 'AlertMsg'
		,props: ['msg', 'type', 'config']
		,data: () => ({
			notify: false
		})
		,watch: {
			msg: {
				handler: function(call){
					if(call){
						this.notifyMsg()
						this.notify = true
					}
				}
			}
		}
		,methods: {
			notifyMsg: function(){
  
				let timer = this.notifyMsg.timer
				if (timer) {
					clearTimeout(timer)
				}
				
				this.notifyMsg.timer = setTimeout(() => {
					this.notify = false
					this.$emit('clearMsg')
				}, 5000)

				this.elapse = 1 
				let t = this.notifyMsg.t
				if (t) {
					clearInterval(t)
				}

				this.notifyMsg.t = setInterval(() => {
					if (this.elapse === 3) {
						this.elapse = 0
						clearInterval(this.notifyMsg.t)
					}
					else {
						this.elapse++
					}
				})
			}
		}
	}
</script>

<style>
	.success { background: #00bfa5 !important;}
	.error { background: #f44336 !important}
</style>