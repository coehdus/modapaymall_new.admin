<template>
	<div class="full-height">

		<div class="full-height">
			<div
				class="pa-10 box text-right"
			>
				<select
					v-model="search.year"
					class="pa-5 box mr-10"
					@change="getSearch"
				>
					<option
						v-for="year in year_list"
						:key="'year_' + year"
						:value="year"
					>{{ year }}년</option>
				</select>

				<select
					v-model="search.month"
					class="pa-5 box mr-10"
					@change="getSearch"
				>
					<option
						v-for="month in 12"
						:key="'month_' + month"
						:value="month"
					>{{ month }}월</option>
				</select>

				<select
					v-model="search.is_settlement"
					class="pa-5 box mr-10"
					@change="getSearch"
				>
					<option value="">정산여부</option>
					<template
						v-for="code in codes.S001.items"
					>
						<option
							v-if="code.sub_code > 0"
							:key="'admin_type_' + code.total_code"
							:value="code.code_value"
						>{{ code.code_name }}</option>
					</template>
				</select>

				<select
					v-model="search.is_deposit"
					class="pa-5 box mr-10"
					@change="getSearch"
				>
					<option value="">지급여부</option>
					<template
						v-for="code in codes.S002.items"
					>
						<option
							v-if="code.sub_code > 0"
							:key="'admin_type_' + code.total_code"
							:value="code.code_value"
						>{{ code.code_name }}</option>
					</template>
				</select>

				<select
					v-model="search.admin_type"
					class="pa-5 box mr-10"
					@change="getSearch"
				>
					<option value="">구분</option>
					<template
						v-for="code in codes.A001.items"
					>
						<option
							v-if="code.sub_code > 1"
							:key="'admin_type_' + code.total_code"
							:value="code.total_code"
						>{{ code.code_name }}</option>
					</template>
				</select>

				<select
					v-model="search.search_type"
					class="pa-5 box mr-10"
				>
					<option value="">검색 구분</option>

					<option
						value="shop_name"
					>상점명</option>
					<option
						value="admin.admin_id"
					>아이디</option>

				</select>

				<input
					v-model="search.search_value"
					class="pa-5-10 box vertical-middle mr-10 "
					placeholder="검색어를 입력하세요"
				/>

				<button
					class="pa-5-10 btn-blue mr-10 vertical-middle"
					@click="getData"
				>검색</button>
			</div>

			<table class="mt-10">
				<colgroup>
				</colgroup>
				<thead>
				<tr>
					<th>정산일</th>
					<th>총판</th>
					<th>대리점</th>
					<th>공급사</th>
					<th>판매 배송비</th>
					<th>결제 수수료</th>
					<th>대리점 지급 금액</th>
					<th>공급 배송비</th>
					<th>정산 금액</th>
					<th>정산여부</th>
					<th>지급여부</th>
					<th>관리</th>
				</tr>
				</thead>
				<tbody>
				<template
					v-if="items.length > 0"
				>
					<tr
						v-for="item in item_list"
						:key="'settlement_' + item.uid"
					>
						<td>{{ item.year }}.{{ item.month }}</td>
						<td>{{ item.admin_id }}</td>
						<td>{{ item.agency_name}}</td>
						<td>{{ item.supply_name }}</td>
						<td>{{ item.agency_total | makeComma }}</td>
						<td>{{ item.fee * -1 | makeComma }}</td>
						<td>{{ item.agency_total - item.fee | makeComma }}</td>
						<td>{{ item.supply_total | makeComma }}</td>
						<td>{{ item.agency_total - item.fee - item.supply_total | makeComma }}</td>
						<td>{{ item.is_settlement_name }}</td>
						<td>{{ item.is_deposit_name }}</td>
						<td>
							<button
								class="btn-blue pa-5-10 mr-10"
								@click="toDetail(item)"
							>상세 정보</button>
						</td>
					</tr>
				</template>
				<tr
					v-else
				>
					<td colspan="10" class="pa-50">정산 내역이 없습니다</td>
				</tr>
				</tbody>
			</table>

		</div>

		<Modal
			:is_modal="is_modal"
			:option="modal_option"

			@close="close"
		>
			<SettlementDeliveryDetail
				slot="modal-content"
				v-if="item_detail.uid"
				:Axios="Axios"
				:user="user"
				:codes="codes"
				:TOKEN="TOKEN"
				:item="item_detail"
				:year="search.year"
				:month="search.month"

				@click="close"
				@onLoading="$emit('onLoading')"
				@offLoading="$emit('offLoading')"

				class="full-width"
			></SettlementDeliveryDetail>

			<div
				slot="modal-bottom"
				class="pa-10 justify-center bg-base"
			>
				<button
					v-if="item_detail.is_settlement != '1'"
					class="bg-green pa-5-10 mr-10 color-eee"
					@click="doUpdate('settlementDelivery', 'confirm')"
				>정산 확인</button>

				<button
					v-if="item_detail.is_settlement == '1' && item_detail.is_deposit != '1'"
					class="bg-green pa-5-10 mr-10 color-eee"
					@click="doUpdate('depositDelivery', 'confirm')"
				>지급 확인</button>

				<button
					v-if="item_detail.is_settlement == '0'"
					class="bg-orange pa-5-10 mr-10 color-eee"
					@click="doUpdate('settlementDelivery', 'hold')"
				>정산 보류</button>

				<button
					v-if="item_detail.is_settlement == '1' && item_detail.is_deposit == '0'"
					class="bg-orange pa-5-10 mr-10 color-eee"
					@click="doUpdate('depositDelivery', 'hold')"
				>지급 보류</button>

				<button
					v-if="item_detail.is_settlement == '1' && item_detail.is_deposit == '0'"
					class="bg-red pa-5-10 mr-10 color-eee"
					@click="doUpdate('settlementDelivery', 'cancel')"
				>정산 취소</button>

				<button
					v-if="item_detail.is_settlement == '1' && item_detail.is_deposit == '1'"
					class="bg-red pa-5-10 mr-10 color-eee"
					@click="doUpdate('depositDelivery', 'cancel')"
				>지급 취소</button>
			</div>
		</Modal>
	</div>
</template>

<script>
import Modal from "@/components/Modal";
import SettlementDeliveryDetail from "@/view/Settlement/SettlementDeliveryDetail";
export default {
	name: 'SettlementDelivery'
	,
	components: {SettlementDeliveryDetail, Modal},
	props: ['Axios', 'TOKEN', 'user', 'codes']
	,data: function(){
		return {
			program: {
				name: '배송비 내역'
				,top: true
				,title: true
				,bottom: false
			}
			,search: {
				ATOKEN: this.TOKEN
				,year: this.$route.query.year ? this.$route.query.year : new Date().getFullYear()
				,month:  this.$route.query.month ? this.$route.query.month : new Date().getMonth() + 1
				,admin_type: this.$route.query.admin_type ? this.$route.query.admin_type : ''
				,is_settlement: this.$route.query.is_settlement ? this.$route.query.is_settlement : ''
				,is_deposit: this.$route.query.is_deposit ? this.$route.query.is_deposit : ''
				,search_type: this.$route.query.search_type ? this.$route.query.search_type : ''
				,search_value: this.$route.query.search_value ? this.$route.query.search_value : ''
			}
			,items: []
			,item: {

			}
			,item_detail: {

			}
			,is_modal: false
			,modal_option: {
				title: '배송비 정산 내역'
				,top: true
				,bottom: true
			}
		}
	}
	,computed: {
		item_list: function (){
			let self = this
			return this.items.filter(function(item){

				for(let i = 0; i < self.codes.S001.items.length; i ++){
					if(item.is_settlement == self.codes.S001.items[i].code_value){
						item.is_settlement_name = self.codes.S001.items[i].code_name
					}
				}
				for(let i = 0; i < self.codes.S002.items.length; i ++){
					if(item.is_deposit == self.codes.S002.items[i].code_value){
						item.is_deposit_name = self.codes.S002.items[i].code_value == '0' ? '-' : self.codes.S002.items[i].code_name
					}
				}

				item.agency_total = Number(item.agency_amount) + Number(item.island_amount)
				item.supply_total = Number(item.supply_amount) + Number(item.island_amount)

				return item
			})
		}
		,year_list: function(){
			let start = 2021
			let date = new Date()
			let year = date.getFullYear()
			let years = []
			for(let i = start; i <= year; i++){
				years.push(i)
			}

			return years
		}
	}
	,methods: {
		getData: async function(){
			try{
				const result = await this.Axios({
					method: 'get'
					,url: 'management/getSettlementDeliveryList'
					,data: this.search
				})

				if(result.success){
					this.items = result.data.result
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}
		}
		,doUpdate: async function(type, status){
			let url = 'management/post' + type.replace(/^./, type[0].toUpperCase()) + status.replace(/^./, status[0].toUpperCase())

			try{
				const result = await this.Axios({
					method: 'post'
					,url: url
					,data: {
						ATOKEN: this.TOKEN
						,s_uid: this.item_detail.uid
						,reason: this.item_detail.reason === undefined ? '' : this.item_detail.reason
					}
				})

				if(result.success){
					this.close()
					this.getSearch()
					this.$emit('setNotify', { type: 'success', message: result.message })
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}
		}
		,toDetail: function(item){
			this.item_detail = item
			this.is_modal = true
		}
		,close: function() {
			this.is_modal = false
		}
		,getSearch: function(){
			this.$emit('push', { name: this.$route.name, params: this.$route.params, query: {
					page: this.search.page
					,search_type: this.search.search_type
					,search_value: this.search.search_value
					,list_cnt: this.search.list_cnt
					,year: this.search.year
					,month: this.search.month
					,is_settlement: this.search.is_settlement
					,is_deposit: this.search.is_deposit
				}})
			this.getData()
		}
	}
	,created() {
		this.getData()
		this.$emit('onLoad', this.program)
	}
}
</script>