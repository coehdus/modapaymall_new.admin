<template>
	<div class="pa-10">
		<div class="mt-10 position-relative">
			<select
				v-model="item_new.admin_code"
				class="input-box"
				:disabled="is_agency"
			>
				<option
					:value="''"
				>소속 대리점</option>
				<option
					v-for="admin in admin_list"
					:key="admin.admin_id"
					:value="admin.admin_id"
				>{{ admin.admin_name }}</option>
			</select>
			<v-icon
				class="position-absolute color-icon"
				style="right: 10px; top: 5px;"
			>mdi mdi-menu-down</v-icon>
		</div>
		<div class="mt-10">
			<div
				v-if="item_new.uid"
				class="input-box bg-222"
			>{{ item_new.member_id }}</div>
			<input
				v-else
				v-model="item_new.member_id"
				placeholder="아이디"
				class="input-box"
				maxlength="25"
			/>
		</div>
		<div class="mt-10">
			<input
				v-model="item_new.member_name"
				placeholder="이름"
				class="input-box"
				maxlength="25"
			/>
		</div>
		<div class="mt-10">
			<input
				v-model="item_new.member_phone"
				type="number"
				placeholder="연락처"
				class="input-box"
				:rules="[rules.max(item_new, 'admin_phone', 15)]"
			/>
		</div>
		<div class="mt-10">
			<input
				v-model="item_new.member_email"
				type="email"
				placeholder="이메일"
				class="input-box"
			/>
		</div>
		<div class="mt-10 justify-space-between">
			<input
				v-model="item_new.member_post"
				placeholder="우편번호"
				class="input-box mr-10"
				readonly
			/>
			<button
				class="btn btn-identify"
			>주소찾기</button>
		</div>
		<div class="mt-10">
			<input
				v-model="item_new.member_addr1"
				placeholder="주소"
				class="input-box"
				readonly
			/>
		</div>
		<div class="mt-10">
			<input
				v-model="item_new.member_addr2"
				placeholder="상세주소"
				class="input-box"
			/>
		</div>
		<div
			v-if="false"
			class="mt-10"
		>
			<button
				class="btn btn-identify"
			>비밀번호 변경</button>
		</div>
		<div
			v-else
			class="mt-10"
		>
			<input
				v-model="item_new.member_password"
				type="password"
				placeholder="비밀번호"
				class="input-box"
				maxlength="25"
				@keyup.enter="$emit('click')"
			/>
			<input
				v-model="item_new.member_password_confirm"
				type="password"
				placeholder="비밀번호 확인"
				class="input-box mt-10"
				maxlength="25"
				@keyup.enter="$emit('click')"
			/>
		</div>
		<div class="mt-10">
			<button
				class="btn btn-identify"
				@click="$emit('click')"
			>{{ btn_name }}</button>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'MemberItem'
		,props: ['item_new', 'rules', 'admin_list', 'is_agency']
		,data: function(){
			return {

			}
		}
		,computed: {
			btn_name: function (){
				if(this.item_new.uid){
					return '저장'
				}else{
					return '신규 등록'
				}
			}
		}
	}
</script>