<template>
	<div
		slot="item"
		class="flex-column overflow-y-auto"
	>
		<div class="pa-10">
			<div>
				<div
					v-if="item_new.uid"
					class="input-box bg-gray-light"
				>{{ item_new.admin_id }}</div>
				<input
					v-else
					v-model="item_new.admin_id"
					placeholder="관리자 아이디"
					class="input-box"
					maxlength="25"
					type=""
					:rules="[rules.id(item_new, 'admin_id', { min: 5, max: 20})]"
				/>
			</div>
			<div class="mt-10">
				<input
					v-model="item_new.admin_name"
					placeholder="관리자 이름"
					class="input-box"
					maxlength="25"
				/>
			</div>
			<div class="mt-10 position-relative">
				<select
					v-model="item_new.admin_level"
					class="input-box"
				>
					<option
						value="0"
					>등급을 선택하세요</option>
					<option
						v-for="level in levels"
						:key="level.code"
						:value="level.code"
					>{{ level.name }}</option>
				</select>
				<v-icon
					class="position-absolute"
					style="right: 10px; top: 10px"
				>mdi mdi-menu-down</v-icon>
			</div>
			<div
				class="mt-10"
			>
				<input
					v-model="item_new.admin_password"
					type="password"
					placeholder="비밀번호"
					class="input-box"
					maxlength="25"
					@keyup.enter="$emit('click')"
				/>
				<input
					v-model="item_new.admin_password_confirm"
					type="password"
					placeholder="비밀번호 확인"
					class="input-box mt-10"
					maxlength="25"
					@keyup.enter="$emit('click')"
				/>
			</div>
			<div class="mt-10">
				<input
					type="number"
					v-model="item_new.admin_phone"
					placeholder="연락처"
					class="input-box"
					:rules="[rules.max(item_new, 'admin_phone', 15)]"
					@keyup.enter="$emit('click')"
				/>
			</div>
			<div class="mt-10">
				<input
					v-model="item_new.admin_email"
					placeholder="이메일"
					class="input-box"
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
	</div>
</template>

<script>
export default {
	name: 'ManagerAdminItem'
	,props: ['item_new', 'rules', 'admin_list', 'is_agency', 'levels']
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