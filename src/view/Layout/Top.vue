<template>
	<div
		class="top bg-base"
	>
		<div
			class="logo bg-base pa-10 color-white text-center"
			@click="$emit('push', 'Index')"
		>Logo Position</div>
		<div class=" pa-10 ">
			<span
				v-show="member_info.admin_type == 'agency'"
				@click="copy"
				class="mr-10 bg-black pa-5-10 radius-10"
			>
				대리점 코드 발급
			</span>
			<span>
				{{ admin_div_name }}
				{{ member_info.admin_name }}
				({{ member_info.admin_id}}) 님 환영합니다
				<button
					class="btn-blue pa-5-10 size-px-12"
					@click="confirmLogout"
				>로그아웃</button>
			</span>

		</div>
	</div>
</template>

<script>

	export default{
		name: 'Top'
		,props: ['member_info', 'codes', 'Base64']
		,computed: {
			admin_div_name: function(){
				let name = ''
				switch(this.member_info.admin_type){
					case 'admin':
						name = '관리자'
						break;
					case 'agency':
						name = '대리점'
						break;
					case 'supply':
						name = '공급사'
						break;
				}

				return name
			}
		}
		,methods: {
			onSide: function(){
				this.$emit('toggleSide')
			}
			,toMain: function(){
				this.$emit('push', 'Login')
			}
			,confirmLogout: function() {
				if(confirm("로그아웃 하시겠습니까?")){
					sessionStorage.removeItem('delimallAT')
					document.location.href= '/ADMIN/Auth/Login'
				}
			}

			,clipBoard: function (val){
				const t = document.createElement("textarea");
				document.body.appendChild(t);
				t.value = val;
				t.select();
				document.execCommand('copy');
				document.body.removeChild(t);
			}

			,copy: function (){
				this.clipBoard(this.codes.dev_url + encodeURI(this.Base64.encode(this.member_info.admin_id)));
				alert('대리점 회원가입 바로가기 링크가 복사되었습니다.');
			}
		}
		,created() {
		}
	}
</script>

<style>
	.top {
		border-bottom: 1px solid #ddd;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.top .logo {
		width: 180px;
	}
</style>