
<template>		

	<div
		v-show="notify"
		class="position-fixed"
		style="bottom: 20%; right: 0; display: block; padding: 10px; width: 100%; z-index: 999 "
	>
		<div
			:class="type ? type : 'error'"
			style="padding: 10px; border-radius: 10px"
		>
			{{ msg }}
		</div >
	</div>
	
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
	.success { background: #00bfa5 !important; color: white}
	.error { background: #f44336 !important; color: white}
</style>