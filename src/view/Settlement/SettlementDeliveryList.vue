<template>
	<div class="full-height">

		<div class="full-height flex-column">
			<div class="pa-10 box text-right" >
				<select
					v-model="search.year"
					class="pa-5 box mr-10"
					@change="getSearch(1)"
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
					@change="getSearch(1)"
				>
					<option
						v-for="month in 12"
						:key="'month_' + month"
						:value="month"
					>{{ month }}월</option>
				</select>

				<select
					v-if="user.role == codes.type_code_admin"
					v-model="search.day"
					class="pa-5 box mr-10"
					@change="getSearch(1)"
				>
					<option value="">전체</option>
					<option
						v-for="day in 31"
						:key="'day_' + day"
						:value="day"
					>{{ day }}일</option>
				</select>

				<select
					v-model="search.is_settlement"
					class="pa-5 box mr-10"
					@change="getSearch(1)"
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
					@change="getSearch(1)"
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

				<button
					v-if="user.role_group == codes.type_code_admin"
					class="pa-5-10 btn-green vertical-middle"
					@click="save"
				>정산 실행 </button>
			</div>

			<div class="mt-10 pa-10 bg-white full-height">
				<table
					v-if="items.length > 0"
					class="table"
				>
					<colgroup>
					</colgroup>
					<thead>
					<tr>
						<th>정산일</th>
						<th>총판</th>
						<th>대리점</th>
						<th>공급사</th>
						<th>판매 건수</th>
						<th>배송비</th>
						<th>결제 수수료</th>
						<th>정산 금액</th>
						<th>정산여부</th>
						<th>지급여부</th>
						<th>관리</th>
					</tr>
					</thead>
					<tbody>
						<tr
							v-for="item in item_list"
							:key="'settlement_' + item.uid"
						>
							<td>{{ item.year }}.{{ item.month }}.{{ item.day }}</td>
							<td>{{ item.distributor_name }}</td>
							<td>{{ item.agency_name}}</td>
							<td>{{ item.supply_name }}</td>
							<td>{{ item.total_count | makeComma }}</td>
							<td>{{ item.supply_total | makeComma }}</td>
							<td>{{ item.fee * -1 | makeComma }}</td>
							<td>{{ item.supply_total | makeComma }}</td>
							<td>{{ item.is_settlement_name }}</td>
							<td>{{ item.is_deposit_name }}</td>
							<td>
								<button
									class="btn-blue pa-5-10 mr-10"
									@click="toDetail(item)"
								>상세 정보</button>
							</td>
						</tr>
					</tbody>
				</table>
				<Empty
					v-else
				></Empty>
			</div>
		</div>

		<Modal
			:is_modal="is_modal"
			:option="modal_option"

			height="450px"

			@close="close"
			@cancel="close"
			@click="close"
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
		</Modal>
	</div>
</template>

<script>
import Modal from "@/components/Modal";
import SettlementDeliveryDetail from "@/view/Settlement/SettlementDeliveryDetail";
import Empty from "@/view/Layout/Empty";
export default {
	name: 'SettlementDelivery'
	,
	components: {Empty, SettlementDeliveryDetail, Modal},
	props: ['Axios', 'TOKEN', 'user', 'codes']
	,data: function(){
		return {
			program: {
				name: '배송비 내역'
				,top: true
				,title: true
				,bottom: false
			}
			,search: this.$storage.init({
				ATOKEN: this.TOKEN
				, page: 1
				, search_type:  ''
				, search_value: ''
				, year: new Date().getFullYear()
				, month: new Date().getMonth() + 1
				, day: this.user.role == this.codes.type_code_admin ? new Date().getDate() : ''
				, admin_type: ''
				, is_settlement: ''
				, is_deposit: ''
			})
			,items: []
			,item: {

			}
			,item_detail: {

			}
			,is_modal: false
			,modal_option: {
				title: '배송비 정산 내역'
				,top: true
				,bottom: false
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

				item.agency_total = Number(item.agency_amount)
				item.supply_total = Number(item.supply_amount)

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
				this.$emit('onLoading')
				const result = await this.Axios({
					method: 'get'
					,url: 'management/getSettlementDeliveryList'
					,data: this.search
				})

				if(result.success){
					this.items = result.data.result
					this.$storage.setQuery(this.search)
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$emit('offLoading')
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
		,getSearch: function(page){
			if(page){
				this.search.page = page
			}

			this.getData()
		}
		,save: async function(){

			try{
				this.$emit('onLoading')

				const result = await this.Axios({
					method: 'post'
					,url: 'management/postSettlement'
					,data: this.search
				})

				if(result.success){
					await this.getData()
					this.$emit('setNotify', { type: 'success', message: result.message})
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message})
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$emit('offLoading')
			}
		}
	}
	,created() {
		this.getData()
		this.$emit('onLoad', this.program)
	}
}
</script>