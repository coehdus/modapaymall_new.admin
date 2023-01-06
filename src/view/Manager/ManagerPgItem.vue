<template>
	<div class="full-height">
		<table class="table th-left">
			<col width="130px" />
			<col width="auto" />
			<tbody>
				<tr>
					<th>PG사 </th>
					<td class="text-left">{{ item.pg_code_name }}</td>
				</tr>
				<tr>
					<th>PG 명</th>
					<td class="text-left">{{ item.pg_name }}</td>
				</tr>
				<tr>
					<th>PG 가맹점 ID</th>
					<td class="text-left">{{ item.pgMerchNo }}</td>
				</tr>
				<tr>
					<th>PG 결제 수수료</th>
					<td class="text-left">{{ item.pg_fee }}%</td>
				</tr>
				<tr>
					<th>PG 가맹점 명</th>
					<td class="text-left">{{ item.pgMerchName }}</td>
				</tr>
			</tbody>
		</table>
		<div class="mt-10">
			<button
				class="bg-default pa-5-10 mr-10"
				@click="$emit('cancel')"
			>확인</button>
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
					this.$bus.$emit('on', true)
					const result = await this.$request.init({
						method: 'post'
						,url: 'management/postPgItem'
						,data: this.item
					})

					if(result.success){
						this.$emit('success')
						this.$bus.$emit('notify', { type: 'success', message: result.message })
					}else{
						this.$bus.$emit('notify', { type: 'error', message: result.message })
					}
				}catch (e) {
					console.log(e)
				}finally {
					this.$bus.$emit('on', false)
				}
			}
			,getData: async function(){
				try{
					this.$bus.$emit('on', true)
					const result = await this.$request.init({
						method: 'post'
						,url: 'management/getPgItem'
						,data: {
							uid: this.uid
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
					this.$bus.$emit('on', false)
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