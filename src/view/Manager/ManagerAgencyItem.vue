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
					placeholder="대리점 아이디"
					class="input-box"
					maxlength="25"
					:rules="[rules.id(item_new, 'admin_id', { min: 5, max: 20})]"
				/>
			</div>
			<div class="mt-10">
				<input
					v-model="item_new.shop_name"
					placeholder="대리점 명"
					class="input-box"
					maxlength="25"
				/>
			</div>
			<div class="mt-10">
				<input
					v-model="item_new.admin_name"
					placeholder="대리점 이름"
					class="input-box"
					maxlength="25"
				/>
			</div>
			<div class="mt-10">
				<input
					v-model="item_new.admin_phone"
					type="number"
					placeholder="대리점 연락처"
					class="input-box"
					:rules="[rules.max(item_new, 'admin_phone', 15)]"
				/>
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
				/>
				<input
					v-model="item_new.admin_password_confirm"
					type="password"
					placeholder="비밀번호 확인"
					class="input-box mt-10"
					maxlength="25"
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
	name: 'ManagerAgencyItem'
	,props: ['item_new', 'rules']
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