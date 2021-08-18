<template>
	<div
		class="flex-column full-height"
	>
		<Title
			:program="program"
		></Title>

		<div
			class="pa-10 flex-column full-height overflow-y-auto"
		>
			<div>
				<h6 class="pa-10">내 정보</h6>
				<ul
					class="box-mypage-list shadow ul-under-line size-px-14"
				>
					<li
						class="pa-10 justify-space-between"
					>
						<span>{{ item.member_id }}</span>
						<span></span>
					</li>
					<li
						class="pa-10 justify-space-between"
						@click="toPassword"
					>
						<span>비밀번호 변경</span>
						<span><v-icon>mdi-chevron-right</v-icon></span>
					</li>
					<li
						class="pa-10 justify-space-between"
					>
						<span>{{ item.member_phone }}</span>
						<span></span>
					</li>
					<li
						class="pa-10 justify-space-between"
					>
						<span>{{ item.member_email }}</span>
						<span></span>
					</li>
					<li
						class="pa-10 justify-space-between"
					>
						<div>{{ item.member_post }} {{ item.member_addr1 }} {{ item.member_addr2 }}</div>
					</li>
					<li
						class="pa-10 justify-space-between"
						@click="toPassword"
					>
						<span>주소록</span>
						<span><v-icon>mdi-chevron-right</v-icon></span>
					</li>
				</ul>

				<h6 class="pa-10 mt-10">결제 정보</h6>
				<ul
					class="box-mypage-list shadow ul-under-line size-px-14"
				>
					<li
						class="pa-10 justify-space-between"
						@click="toPaymentList"
					>
						<span>결제 내역</span>
						<span><v-icon>mdi-chevron-right</v-icon></span>
					</li>
					<li
						class="pa-10 justify-space-between"
						@click="toQnA"
					>
						<span>1:1 문의 내역</span>
						<span><v-icon>mdi-chevron-right</v-icon></span>
					</li>
					<li
						class="pa-10 justify-space-between"
						@click="toQnA"
					>
						<span>문의 내역</span>
						<span><v-icon>mdi-chevron-right</v-icon></span>
					</li>
				</ul>
			</div>

		</div>

		<div
			class="bottom"
		>
			<button
				v-if="!view.password"

				class="btn btn-identify"

				@click="logout"
			>로그아웃</button>
		</div>
	</div>
</template>

<script>

import Title from "@/view/Layout/Title";

export default{
	name: 'Mypage'
	,props: ['Axios', 'user', 'rules', 'codes']
	,components: { Title }
	,data: function(){
		return {
			program: {
				name: '마이페이지'
				,code: 'mypage'
				,wrap: 'mypage'
				,top: false
				,title: false
				,bottom: false
				,class: 'blue'
			}
			,item: {
				member_id: '아이디'
				,member_phone: '연락처'
				,member_email: '이메일'
				,member_post: '우편번호'
				,member_addr1: '주소'
				,member_addr2: '상세 주소'
			}
			,view: {
				password: false
			}
		}
	}
	,methods: {
		logout: function(){
			if(confirm('로그아웃 하시겠습니까?')){
				sessionStorage.removeItem('delimallT')
				sessionStorage.removeItem('delimallT2')
				this.$router.push({ name: 'Login'})
			}
		}
		,toPaymentList: function(){
			this.$router.push({ name: 'PaymentList'})
		}
		,toPassword: function(){
			this.$router.push('Password')
			this.view.password = true
		}
		,setNotify: function({ type, message }){
			this.$emit('setNotify', { type: type, message: message })
		}
		,toQnA: function(){

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
.box-mypage-list {}
.box-mypage-list.shadow { box-shadow: 0px 3px 5px rgb(0, 0, 0, .3) }
.btn-mypage-add {
	border: 1px solid #ddd;
	padding: 2px 2px 2px 7px;
	font-size: 11px
}
</style>