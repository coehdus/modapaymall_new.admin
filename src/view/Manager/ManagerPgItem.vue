<template>
	<div class="full-height">
		<table class="table th-left">
			<col width="130px" />
			<col width="auto" />
			<tbody>
				<tr>
					<th>PG사 </th>
					<td>
						<select
							v-model="item.pg_code"
							class="input-box width-100"
						>
							<option value="">PG사를 선택하세요</option>
							<option
								v-for="(code, index) in codes.P004.items"
								:key="code.total_code + '_' + index"
								:value="code.code_value"
							>{{ code.code_name }}</option>
						</select>
					</td>
				</tr>
				<tr>
					<th>PG 명</th>
					<td>
						<input v-model="item.pg_name" class="input-box " placeholder="PG명" maxlength="25" />
					</td>
				</tr>
				<tr>
					<th>PG 가맹점 ID</th>
					<td>
						<input v-model="item.pgMerchNo" class="input-box " placeholder="가맹점 ID" maxlength="50" />
					</td>
				</tr>
				<tr>
					<th>PG 결제 수수료</th>
					<td>
						<input v-model="item.pg_fee" class="input-box " placeholder="PG 결제 수수료" :rules="[$rules.demical(item, 'pg_fee', {min: 2, max:2})]"/>
					</td>
				</tr>
				<tr>
					<th>PG 가맹점 명</th>
					<td>
						<input v-model="item.pgMerchName" class="input-box " placeholder="가맹점 명" maxlength="25"/>
					</td>
				</tr>
				<tr>
					<th>PG API URL - 운영</th>
					<td>
						<input v-model="item.pgApiUrl" class="input-box " placeholder="PG API URL - 운영" maxlength="250"/>
					</td>
				</tr>
				<tr>
					<th>PG API URL - 개발</th>
					<td>
						<input v-model="item.pgApiUrlDev" class="input-box " placeholder="PG API URL - 개발" maxlength="250"/>
					</td>
				</tr>
				<tr>
					<th>콜백 URL</th>
					<td>
						<input v-model="item.returnUrl" class="input-box " placeholder="콜백 URL" maxlength="250"/>
					</td>
				</tr>
				<tr>
					<th>결제 성공 처리 URL</th>
					<td>
						<input v-model="item.successUrl" class="input-box " placeholder="결제 성공 처리 URL" maxlength="250"/>
					</td>
				</tr>
				<tr>
					<th>결제 실패 처리 URL</th>
					<td>
						<input v-model="item.failureUrl" class="input-box " placeholder="결제 실패 처리 URL" maxlength="250"/>
					</td>
				</tr>
			</tbody>
		</table>
		<div class="mt-10">
			<button
				class="bg-identify pa-5-10 mr-10"
				@click="save"
			>저장</button>
			<button
				class="bg-default pa-5-10 mr-10"
				@click="$emit('cancel')"
			>취소</button>
		</div>
	</div>
</template>

<script>
	export default{
		name: 'ManagerPgItem'
		, props: ['Axios', 'user', 'codes', 'rules', 'TOKEN', 'uid']
		, data: function(){
			return {
				program: {
					name: 'PG사 정보 관리'

				}
				, item: {
					pg_code: ''
					, pg_name: ''
					, pgMerchNo: ''
					, pgMerchName: ''
					, pgApiUrl: ''
					, pgApiUrlDev: ''
					, returnUrl: ''
					, failureUrl: ''
					, successUrl: ''
				}
			}
		}
		, computed: {

		}
		, methods: {
			save: async function(){
				try{
					this.$emit('onLoading')
					const result = await this.$request.init({
						method: 'post'
						,url: 'management/postPgItem'
						,data: this.item
					})

					if(result.success){
						this.$emit('success')
					}else{
						this.$bus.$emit('notify', { type: 'error', message: result.message })
					}
				}catch (e) {
					console.log(e)
				}finally {
					this.$emit('offLoading')
				}
			}
			,getData: async function(){
				try{
					this.$emit('onLoading')
					const result = await this.Axios({
						method: 'post'
						,url: 'management/getPgItem'
						,data: {
							ATOKEN: this.TOKEN
							, uid: this.uid
						}
					})

					if(result.success){
						this.item = result.data
					}else{
						this.$bus.$emit('notify', { type: 'error', message: result.message })
					}
				}catch (e) {
					console.log(e)
				}finally {
					this.$emit('offLoading')
				}
			}
		}
		, created() {
			if(this.uid){
				this.getData()
			}
		}
	}
</script>