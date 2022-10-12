<template>
	<div
		class="full-height full-width flex-column overflow-y-auto"
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

		<div>
			<table class="table table-even mt-10 mb-10 full-width">
				<colgroup>
				</colgroup>
				<thead>
				<tr>
					<th>매출일</th>
					<th>판매금액</th>
					<th>판매원가</th>
					<th>매출금액</th>
					<th>결제 수수료</th>

					<th>영업 수익</th>
					<th>PG 수수료</th>
					<th>정산금액</th>
				</tr>
				</thead>
				<tbody>
				<template
					v-if="items.length > 0"
				>
					<tr
						v-for="(art, index) in item_list"
						:key="'settlement_' + index"
					>
						<td>{{ art.date }}</td>
						<td>{{ art.sale_amount | makeComma }} 원</td>
						<td>{{ art.total_amount | makeComma }} 원</td>
						<td>{{ item.is_supply ? art.income_amount + '원' : '-' | makeComma }}</td>

						<td>{{ art.total_fee | makeComma }} 원 ({{ art.total_fee_rate }}%)</td>
						<td>{{ item.is_supply ? '-' : art.income_amount + '원' | makeComma }} ({{ art.admin_per }}%)</td>
						<td>{{ item.is_admin ? (art.fee) + '원' : '-' | makeComma}}  ({{ art.pg_fee_rate }}%)</td>
						<td>{{ art.amount | makeComma }} 원</td>
					</tr>
				</template>
				<tr
					v-else
				>
					<td colspan="10" class="pa-50">정산 내역이 없습니다</td>
				</tr>
				</tbody>
				<tfoot>
					<tr>
						<th>합계</th>
						<th>{{ item.sale_amount | makeComma}} 원</th>
						<th>{{ item.total_amount | makeComma }} 원</th>
						<th>{{ item.is_supply ? item.income_amount + '원' : '-' | makeComma }}</th>
						<th>{{ item.total_fee * -1 | makeComma }} 원</th>
						<th>{{ !item.is_supply ? item.income_amount + '원' : '-' | makeComma }}</th>
						<th>{{ item.is_admin ? item.fee + '원' : '-' | makeComma }} </th>
						<th>{{ item.amount | makeComma}} 원</th>
					</tr>
				</tfoot>
			</table>

			<textarea
				v-if="user.role == codes.type_code_admin"
				v-model="reason"
				placeholder="보류시 사유를 입력해주세요"
				class="mt-auto"
			></textarea>
		</div>

		<div
			v-if="user.role == codes.type_code_admin"
			class="bg-base full-width pa-10 justify-center"
		>
			<button
				v-if="item.is_settlement != '1'"
				class="bg-green pa-5-10 mr-10 color-eee"
				@click="doUpdate('settlement', 'confirm')"
			>정산 확인</button>

			<button
				v-if="item.is_settlement == '1' && item.is_deposit != '1'"
				class="bg-green pa-5-10 mr-10 color-eee"
				@click="doUpdate('deposit', 'confirm')"
			>지급 확인</button>

			<button
				v-if="item.is_settlement == '0'"
				class="bg-orange pa-5-10 mr-10 color-eee"
				@click="doUpdate('settlement', 'hold')"
			>정산 보류</button>

			<button
				v-if="item.is_settlement == '1' && item.is_deposit == '0'"
				class="bg-orange pa-5-10 mr-10 color-eee"
				@click="doUpdate('deposit', 'hold')"
			>지급 보류</button>

			<button
				v-if="item.is_settlement == '1' && item.is_deposit == '0'"
				class="bg-red pa-5-10 mr-10 color-eee"
				@click="doUpdate('settlement', 'cancel')"
			>정산 취소</button>

			<button
				v-if="item.is_settlement == '1' && item.is_deposit == '1'"
				class="bg-red pa-5-10 mr-10 color-eee"
				@click="doUpdate('deposit', 'cancel')"
			>지급 취소</button>
		</div>

		<div
			v-else
			class="bg-base full-width pa-10 justify-center mt-auto "
		>
			<button
				class="bg-identify pa-5-10"
				@click="$emit('click')"
			>확인</button>
		</div>
	</div>
</template>

<script>
	export default{
		name: 'SettlementDetail'
		,props: ['Axios', 'user', 'codes', 'TOKEN', 'item', 'year', 'month', 'day']
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
					, seller_id: this.item.admin_id
					, year: this.year
					, month: this.month
					, day: this.item.day
					, payment_type: this.item.payment_type
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
			,doUpdate: async function(type, status) {
				let url = 'management/post' + type.replace(/^./, type[0].toUpperCase()) + status.replace(/^./, status[0].toUpperCase())

				try{
					const result = await this.Axios({
						method: 'post'
						,url: url
						,data: {
							ATOKEN: this.TOKEN
							,s_uid: this.item.uid
							,reason: this.reason
						}
					})

					if(result.success){
						this.$emit('success')
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