<template>
	<div
		class="bg-login flex-column justify-center full-height"
	>
		<div
			class="bg-login-content pa-10"
		>
			<div
				class=" text-center"
			>
				<span
					v-if="$production"
					class="size-em-15 font-weight-bold vertical-middle"
				><img :src="$shop_logo" style="width: 50%"></span>
				<div
					v-else
					class="bg-333 pa-10 color-eee "
				>{{ $production_title }}</div>
			</div>
			<div class="pa-10">
				<input
					v-model="item.member_id"
					class="input-underline full-width"
					:class="{  input: isIdInput, 'error-underline': error.type == 'id' }"
					type="text" placeholder="아이디를 입력하세요."
					maxlength="15"
					@keyup.enter="login"
				/>
			</div>
			<div class="pa-10 toggle-password">
				<input
					v-model="item.member_pw"
					class="input-underline full-width"
					:class="{ input: isPwInput, 'error-underline': error.type == 'pw'  }"
					:type="toggleType"
					placeholder="비밀번호를 입력하세요."
					maxlength="50"
					@keyup.enter="login"
				/>
				<v-icon
					v-if="toggleType == 'text'"
					class="toggle"
					:class="{ on: toggleType == 'text' }"
					@click="toggles_on_pw"
				>mdi-eye</v-icon>
				<v-icon
					v-else
					class="toggle"
					:class="{ on: toggleType == 'text' }"
					@click="toggles_on_pw"
				>mdi-eye-off</v-icon>
			</div>
			<div
				v-show="error.type"
				class="pa-10 color-red"
			><v-icon small class="color-red">mdi-alert</v-icon> {{ error.msg }}</div>

			<div
				class="mt-10"
			>
				<button
					class="btn btn-identify"
					@click="login"
				>로그인</button>
			</div>

			<div
				class="pa-10 mt-10 text-center login-menu justify-space-around"
			>
				<router-link :to="{ name: 'FindId' }">아이디 찾기</router-link>
				<router-link :to="{ name: 'FindPw' }">비밀번호 찾기</router-link>
			</div>

		</div>
	</div>
</template>

<script>

import { Base64 } from 'js-base64'

export default{
	name: 'Login'
	,props: ['Axios', 'codes']
	,data: function() {
		return {
			program: {
				name: '로그인'
				, code: 'login'
				, top: false
				, bottom: false
				, title: false
				, bland: false
				, wrap: 'loginNew'
			}
			,item: {
				member_id: ''
				,member_pw: ''
			}
			,is_id_save: false
			,is_auto_login: false
			,error: {
				type: ''
				,msg: ''
			}
			,is_id_error: false
			,is_pw_error: false
			,is_on_pw: false
		}
	}
	,computed: {
		isIdInput: function(){
			if(this.item.member_id){
				return true
			}else{
				return false
			}
		}
		, isPwInput: function(){
			if(this.item.member_pw){
				return true
			}else{
				return false
			}
		}
		,toggleType: function(){
			if(this.is_on_pw){
				return 'text'
			}else{
				return 'password'
			}
		}
	}
	,methods: {
		login: async function(){
			let item = this.item
			try {
				let result = await this.$request.init({
					method: 'post'
					, url: 'management/postLogin'
					, data: item
				})

				if (result.success) {

					sessionStorage.setItem(Base64.encode(process.env.VUE_APP_NAME) + 'AT', result.data.TOKEN)

					this.error.type = ''

					this.toMain()
				} else {

					if(result.message.indexOf('아이디') > -1){
						this.error.type = 'id'
					}else{
						this.error.type = 'pw'
					}
					this.error.msg = result.message
				}
			} catch (E) {
				console.log(E)
				this.$bus.$emit('notify', {type: 'error', message: E})
			}
		}
		,toggles_on_pw: function(){
			if(this.is_on_pw){
				this.is_on_pw = false
			}else{
				this.is_on_pw = true
			}
		}
		,toMain: function(){
			document.location.href = process.env.VUE_APP_PUBLIC_PATH
		}
	}
	,created: function(){
		this.$emit('onLoad', this.program)
	}
	,watch: {

	}
}
</script>

<style>
.bg-login { background-color: #eee; padding: 10px;}
.bg-login-content { width: 320px; background-color: white; border-radius: 5px; margin: 0 auto}

.auto-login { vertical-align: middle; font-size: 14px; }

.login-menu { }
.login-menu a { font-size: 14px; font-weight: 400}

.toggle-password { position: relative; }
.toggle-password .toggle { position: absolute; right: 10px; top: 20px; color: #bbb}
.toggle-password .toggle.on { color: #0f6ecd}

.error-underline { background: none; border-bottom: 1px solid red !important;}

</style>