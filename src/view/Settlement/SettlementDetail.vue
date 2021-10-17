<template>
	<div
		class="full-height full-width overflow-y-auto"
	>
		<div
			v-if="step.reason"
			class="mt-10 justify-space-between"
		>
			<div class="font-weight-bold">
				정산 로그: {{ step.reason }}
			</div>

			<div class="mr-10">
				처리일시: {{ step.wDate}}
			</div>
		</div>

		<table class="mt-20 full-width">
			<colgroup>
			</colgroup>
			<thead>
			<tr>
				<th>매출일</th>
				<th>판매금액</th>
				<th>판매원가</th>
				<th>매출금액</th>
				<th>수수료</th>
				<th>정산금액</th>
			</tr>
			</thead>
			<tfoot>
			<tr>
				<th>합계</th>
				<th>{{ user.admin_type_code == 'supply' ? item.total_amount : item.sale_amount | makeComma}} 원</th>
				<th>{{ item.total_amount | makeComma }} 원</th>
				<th>{{ item.income_amount | makeComma }} 원</th>
				<th>{{ item.fee | makeComma }} 원</th>
				<th>{{ item.amount | makeComma}} 원</th>
			</tr>
			</tfoot>
			<tbody>
			<template
				v-if="items.length > 0"
			>
				<tr
					v-for="item in item_list"
					:key="'settlement_' + item.date"
				>
					<td>{{ item.date }}</td>
					<td>{{ user.admin_type_code == 'supply' ? item.total_amount : item.sale_amount | makeComma }} 원</td>
					<td>{{ item.total_amount | makeComma }} 원</td>
					<td>{{ item.income_amount | makeComma }} 원</td>
					<td>{{ item.fee | makeComma }} 원</td>
					<td>{{ item.amount | makeComma }} 원</td>
				</tr>
			</template>
			<tr
				v-else
			>
				<td colspan="10" class="pa-50">정산 내역이 없습니다</td>
			</tr>
			</tbody>
		</table>

		<textarea
			v-if="user.admin_type_code == codes.type_code_amdin"
			v-model="reason"
			placeholder="보류시 사유를 입력해주세요"
			class="mt-30"
		></textarea>

	</div>
</template>

<script>
	export default{
		name: 'SettlementDetail'
		,props: ['Axios', 'user', 'codes', 'TOKEN', 'item', 'year', 'month']
		,data: function(){
			return {
				program: {
					name: '정산상세내역'
					,top: false
					,title: false
					,bottom: false
				}
				,search: {
					ATOKEN: this.TOKEN
					,seller_id: this.item.admin_id
					,year: this.year
					,month: this.month
				}
				,items: []
				,reason: ''
				,step: {

				}
			}
		}
		,computed: {
			item_list: function (){
				return this.items.filter(function(item){
					return item
				})
			}
		}
		,methods: {
			getData: async function(){
				try{
					const result = await this.Axios({
						method: 'get'
						,url: 'management/getSettlementDetail'
						,data: this.search
					})

					if(result.success){
						this.items = result.data.list
						this.step = result.data.step
					}else{
						this.$emit('setNotify', { type: 'error', message: result.message })
					}
				}catch (e) {
					console.log(e)
				}
			}
		}
		,created() {
			this.getData()
		}
	}
</script>

<style>
.modal-wrap .modal-container .modal-content .modal-contents {
	margin: 10px;
}
</style>