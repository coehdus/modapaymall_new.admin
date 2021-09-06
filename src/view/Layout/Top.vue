<template>
	<div
		class="top bg-base"
	>
		<div
			class="logo bg-base pa-10 color-white text-center"
			@click="$emit('push', 'Index')"
		>Logo Position</div>
		<div class="pa-10">
			{{ admin_div_name }}
			{{ member_info.admin_name }}
			({{ member_info.admin_id}}) 님 환영합니다
			<button
				class="btn-blue pa-5-10 size-px-12"
				@click="confirmLogout"
			>로그아웃</button>
		</div>
	</div>
</template>

<script>
	export default{
		name: 'Top'
		,props: ['member_info']
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