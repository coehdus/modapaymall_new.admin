<template>
	<div class="full-height">
		<div
			class="full-height"
		>
			
			<div
				class="justify-space-between "
			>
				<div class="flex-1 bg-white pa-10 mr-10">
					<h6 class="under-line-identify">계정정보</h6>
					<table class="table th-left td-left">
						<col width="120px">
						<col width="auto">
						<col width="120px">
						<col width="auto">
						<tbody>
							<tr>
								<th>등급</th>
								<td class="position-relative">
									<select
										v-model="item.account_level"
										class="input-box position-relative cursor-pointer"
										style="z-index: 1"
									>
										<option value="">선택하세요</option>
										<option
											v-for="(code, index) in codes.A002.items"
											:key="code.total_code + index"
											:value="code.code_value"
										>{{ code.code_name }}</option>
									</select>
									<v-icon
										class="position-absolute color-icon"
										style="right: 15px; top: 11px; z-index: 0"
									>mdi mdi-menu-down</v-icon>
								</td>
								<th></th>
								<td></td>
							</tr>
							<tr>
								<th>아이디 <span class="color-red">*</span></th>
								<td>
									<input
										v-model="item.account_id"
										class="input-box full-width pa-5-10 mr-10"
										placeholder="아이디를 입력하세요"
										:rules="[rules.id(item, 'account_id', {min: 4, max: 25 })]"

										@keyup.enter="save"
									/>
								</td>

								<th>등록일</th>
								<td class="position-relative">
									<input
										v-model="item.join_date"
										class="input-box full-width"
										placeholder="등록일을 선택하세요"
										readonly
										@click="is_data_pick = !is_data_pick"
									/>
									<v-date-picker
										v-if="is_data_pick"
										v-model="item.join_date"
										no-title
										scrollable
										class="position-absolute box"
										style="top: 45px; left: -5px"
										@change="is_data_pick = false"
									></v-date-picker>
								</td>
							</tr>
							<tr>
								<th>비밀번호 <span class="color-red">*</span></th>
								<td class="">
									<input
										v-model="item.account_password"
										type="password"
										class="input-box full-width"
										placeholder="비밀번호"
										max="50"

										@keyup.enter="save"
									/>
								</td>

								<th>비밀번호 확인 <span class="color-red">*</span></th>
								<td class="">
									<input
										v-model="item.account_password_confirm"
										type="password"
										class="input-box full-width"
										placeholder="비밀번호를 한번 더 입력하세요"
										max="50"

										@keyup.enter="save"
									/>
								</td>
							</tr>
							<tr>
								<th>이름 <span class="color-red">*</span></th>
								<td>
									<input
										type="text"
										v-model="item.account_name"
										class="input-box full-width"
										placeholder="이름을 입력하세요"
										maxlength="20"

										@keyup.enter="save"
									/>
								</td>
								<th>휴대폰 번호</th>
								<td>
									<input
										type="number"
										v-model="item.account_phone"
										:ruels="[rules.max(item, 'account_phone', 12)]"
										class="input-box full-width"
										placeholder="휴대폰번호를 입력하세요"

										@keyup.enter="save"
									/>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="flex-1"></div>
			</div>
		</div>

		<div
			class="justify-center"
		>
			<button
				class="bg-identify pa-10-20 mr-10"
				@click="save"
			>저장</button>
			<button
				class="box pa-10-20"
				@click="toList"
			>목록</button>
		</div>
	</div>
</template>

<script>

export default {
	name: 'ManagerItem'
	, components: {}
	, props: ['Axios', 'user', 'codes', 'rules', 'date']
	, data: function(){
		return {
			program: {
				name: '관리자 등록'
				, top: true
				, title: true
				, bottom: false
			}
			,item: {
				account_type: 'A001001'
				, account_level: ''
				, join_date: this.date.getToday('-')
			}
			, is_data_pick: false
			,sample: {

			}
		}
	}
	, computed: {

	}
	, methods: {
		save: async function(){
			try{
				this.$emit('onLoading')
				const result = await this.Axios({
					method: 'post'
					,url: 'management/postAdmin'
					,data: this.item
				})
				if(result.success){
					this.$emit('setNotify', { type: 'success', message: result.message})
					this.toList()
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message})
				}
			}catch(e){
				console.log(e)
			}finally {
				this.$emit('offLoading')
			}
		}
		,toList: function(){
			this.$storage.push({ name: 'ManagerList'})
		}
	}
	, created() {
		this.$emit('onLoad', this.program)


	}
}
</script>

<style>
.width-fee { width: 60px !important; text-align: right;}
</style>