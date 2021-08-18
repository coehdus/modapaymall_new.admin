<template>
	<div
		class="pa-10 flex-column full-height bg-gray justify-center"
	>
		<div
			class="pa-20 bg-white text-center"
		>
			<p
				class="size-px-28 color-blue font-weight-bold"
			>회원가입 완료</p>
			<p class=" mt-30">현재 회원가입 심사중입니다.</p>
			<p class="">등록하신 대리점에서 확인후 이용가능합니다</p>

			<div
				class="bottom"
			>
				<button
					class="btn btn-identify mt-30"
					@click="toLogin"
				>확인</button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'JoinResult'
	,props: []
	,data: function(){
		return {
			program:{
				name: '회원가입'
				,top: false
				,title: false
				,bottom: false
			}
			,app_type: localStorage.getItem('app_type')
		}
	}
	,methods: {

		toLogin: function(){
			try {

				const NUA = navigator.userAgent.toLowerCase()

				if(NUA.indexOf('android') > -1){
					window.Android.finishJoin()
				}else if(NUA.indexOf('iphone') > -1 || NUA.indexOf('ipad') > -1 || NUA.indexOf('ipod') > -1){
					window.webkit.messageHandlers.callback.postMessage('finishJoin')
				}else{
					this.$router.push({ name: 'Login'})
				}
			}catch(e){
				this.$router.push({ name: 'Login'})
			}
		}
	}
	,created() {
		this.$emit('setProgram', this.program)
	}

}
</script>

<style>
.text-center { text-align: center !important;}
.txt-blue { color: #0f6ecd !important;}
</style>