<template>
	<input
		v-if="is_permission"
		type="file"
		class="hide"
		:accept="accept"
		:placeholder="placeholder"
		:capture="capture"
		:multiple="multiple"
		ref="file"
		@change="toChange"
	/>
	<input
		v-else
		type="file"
		class="hide"
		:accept="accept"
		:placeholder="placeholder"
		:capture="capture"
		:multiple="multiple"
		ref="file"
		@click="checkPermission"
	/>
</template>

<script>
export default {
	name: 'InputFile'
	, props: ['accept', 'placeholder', 'capture', 'multiple']
	, data: function(){
		return{
			is_permission: false
		}
	}
	, methods: {

		checkPermission: function(){
			console.log('checkPermission')
			if(this.is_permission){
				return false
			}
			try {
				window.android.postMessage('permission')
				let self = this
				window.click = function () {
					self.is_permission = true
				}
				window.deninePermission = function(){
					self.$bus.$emit('notify', { type: 'error', message: '파일 첨부에 필요한 권한이 거부되어 있습니다. 앱 설정에서 권한승인이 필요합니다.'})
				}
			}catch (e){
				console.log(e)
				this.doFile()
			}
		}

		, doFile: function(){
			this.is_permission = true
		}

		, toChange: function(){
			this.$emit('change', this.$refs.file.files)
		}
	}
	, created() {

		try {
			window.android.postMessage('checkPermission')

			window.setPermission = function (type) {
				console.log('setPermission', type)
				this.is_permission = type
			}
		}catch(e){
			this.is_permission = true
			console.log(e)
		}
	}
}
</script>