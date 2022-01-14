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

		<table class="table table-even mt-20 full-width">
			<colgroup>
			</colgroup>
			<thead>
			<tr>
				<th>매출일</th>
				<th>대리점</th>
				<th>판매 배송비</th>
				<th>공급사</th>
				<th>공급사 배송비</th>
				<th>추가 배송비</th>
			</tr>
			</thead>
			<tfoot>
			<tr>
				<th>합계</th>
				<th></th>
				<th>{{ item.agency_amount | makeComma }} 원</th>
				<th></th>
				<th>{{ item.supply_amount | makeComma }} 원</th>
				<th>{{ item.island_amount | makeComma}} 원</th>
			</tr>
			</tfoot>
			<tbody>
			<template
				v-if="items.length > 0"
			>
				<tr
					v-for="(item, index) in item_list"
					:key="'settlement_' + index"
				>
					<td>{{ item.date }}</td>
					<td>{{ item.agency_name }}</td>
					<td>{{ item.delivery_price_agency | makeComma}} 원</td>
					<td>{{ item.supply_name }}</td>
					<td>{{ item.delivery_price | makeComma }} 원</td>
					<td>{{ item.island_delivery | makeComma }} 원</td>
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
			v-if="user.admin_type_code == codes.type_code_admin"
			v-model="item.reason"
			placeholder="보류시 사유를 입력해주세요"
			class="mt-30"
		></textarea>

		<div
			v-if="user.role == codes.type_code_admin"
			slot="modal-bottom"
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
			slot="modal-bottom"
			class="bg-base full-width pa-10 justify-center"
		>
			<button
				class="bg-identify pa-5-10"
				@click="close"
			>확인</button>
		</div>
	</div>
</template>

<script>
export default{
	name: 'SettlementDeliveryDetail'
	,props: ['Axios', 'user', 'codes', 'TOKEN', 'item', 'year', 'month']
	,data: function(){
		return {
			program: {
				name: '배송비 정산 내역'
				,top: false
				,title: false
				,bottom: false
			}
			,search: {
				ATOKEN: this.TOKEN
				,supply_id: this.item.supply_id
				,agency_id: this.item.agency_id
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
					,url: 'management/getSettlementDeliveryDetail'
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