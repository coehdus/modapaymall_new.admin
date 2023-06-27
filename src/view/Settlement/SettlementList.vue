<template>
	<div class="full-height">

		<div class="full-height flex-column">
			<div class="pa-10 box text-right">

				<date_picker
					:date="date"
					@click="setDate"
					class="mr-10"
				></date_picker>

				<select
					v-model="search.payment_type"
					class="pa-5 box mr-10"
					@change="getSearch(1)"
				>
					<option value="">결제 구분</option>
					<template
						v-for="code in codes.P003.items"
					>
						<option
							v-if="code.sub_code > 0"
							:key="'admin_type_' + code.total_code"
							:value="code.code_value"
						>{{ code.code_name }}</option>
					</template>
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
					v-if="user.role != codes.type_code_supply"
					v-model="search.admin_type"
					class="pa-5 box mr-10"
					@change="getSearch(1)"
				>
					<option value="">구분</option>
					<template
						v-for="code in codes.A001.items"
					>
						<option
							v-if="code.sub_code > 1 && code.sub_code < 4"
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
					@click="getSearch"
				>검색</button>

				<button
					v-if="user.role_group == codes.type_code_admin"
					class="pa-5-10 btn-green vertical-middle mr-10"
					@click="save"
				>정산 실행 </button>

				<button
					class="pa-5-10 btn-green vertical-middle"
					@click="getExcel"
					:disabled="items.length <= 0"
				>엑셀 다운로드</button>
			</div>

			<div class="mt-10 pa-10 bg-white full-height">
				<table
					v-if="items.length > 0"
					class="table table-even"
				>
					<colgroup>
						<col width="auto" />
						<col width="auto" />
						<col width="auto" />
						<col width="auto" />
						<col width="auto" />

						<col width="auto" />
						<col width="auto" />
						<col width="auto" />
						<col width="auto" />

						<col width="auto" />
						<col width="auto" />
						<col width="auto" />
						<col width="auto" />
						<col width="auto" />

						<col width="auto" />
						<col width="120px" />

					</colgroup>
					<thead>
					<tr>
						<th>정산일</th>
						<th>구분</th>
						<th>상점명</th>
						<th>아이디</th>
						<th>결제 구분</th>

						<th>판매건수</th>
						<th>판매금액</th>
						<th>판매원가</th>
						<th>판매 수수료</th>

						<th>영업 수수료</th>
						<th>PG 원가</th>
						<th>배송비</th>
						<th>정산금액</th>
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
							<td>{{ item.date }}</td>
							<td>{{ item.account_type_name }}</td>
							<td>{{ item.shop_name}}</td>
							<td>{{ item.admin_id }}</td>
							<td>{{ item.payment_type }}</td>

							<td>{{ item.total_count | makeComma }} 건</td>
							<td class="text-right">{{ item.sale_amount | makeComma }} 원</td>
							<td class="text-right">{{ item.total_amount | makeComma }} 원</td>
							<td class="text-right">{{ item.is_agency ? (item.total_fee) + '원' : '-' | makeComma }}</td>

							<td class="text-right">{{ item.is_agency ? (item.total_fee - item.fee) + '원' : (item.income_amount) + '원' | makeComma }}</td>
							<td class="text-right">{{ item.is_agency ? (item.fee) + '원' : '-' | makeComma }}</td>
							<td class="text-right">{{ item.is_agency ? (item.minus_amount) + '원'  : '-' | makeComma }}</td>
							<td class="text-right">{{ item.amount | makeComma }} 원</td>
							<td>{{ item.is_settlement_name }}</td>

							<td>{{ item.is_deposit_name }}</td>
							<td>
								<button
									class="btn-blue pa-5-10 mr-10"
									@click="toDetail(item)"
								>상세 정보</button>
								<button
									v-if="item_detail.is_settlement == '0'"
									v-show="false"
									class="btn-success pa-5-10"
									@click="doSettlementConfirm(item)"
								>정산 확인 <v-icon small class="color-eee">mdi mdi-chevron-right</v-icon></button>
								<button
									v-if="item_detail.is_settlement == '1' && item_detail.is_deposit == '0'"
									v-show="false"
									class="btn-success pa-5-10"
									@click="doDepositConfirm(item)"
								>지급 완료 <v-icon small class="color-eee">mdi mdi-chevron-right</v-icon></button>
							</td>
						</tr>
					</tbody>
				</table>
				<Empty
					v-else
				></Empty>

				<Pagination
					:options="search"

					@click="getSearch"
				></Pagination>
			</div>
		</div>

		<Modal
			:is_modal="is_modal"
			:option="modal_option"

			height="450px"

			@close="close"
		>
			<SettlementDetail
				slot="modal-content"
				v-if="item_detail.uid"
				:Axios="Axios"
				:user="user"
				:codes="codes"
				:TOKEN="TOKEN"
				:item="item_detail"
				:year="search.year"
				:month="search.month"
				:day="search.day"

				@click="close"
				@onLoading="$emit('onLoading')"
				@offLoading="$emit('offLoading')"
				@setNotify="setNotify"
				@success="success"

				class="full-width"
			></SettlementDetail>
		</Modal>

		<Excel
			v-if="is_excel"
			:excel_data="excel_data"

			@close="is_excel = false"
		></Excel>
	</div>
</template>

<script>
import SettlementDetail from "@/view/Settlement/SettlementDetail";
import Modal from "@/components/Modal";
import Empty from "@/view/Layout/Empty";
import date_picker from "@/components/DatePicker"
import Pagination from "@/components/Pagination";
import Excel from "../../components/Excel";

export default {
	name: 'SettlementList'
	,
	components: {Empty, Modal, SettlementDetail, date_picker, Pagination, Excel},
	props: ['Axios', 'TOKEN', 'codes', 'user']
	,data: function(){
		return {
			program: {
				name: '정산 내역'
				,top: true
				,title: true
				,bottom: false
			}
			,is_excel: false
			,excel_data: {
				name: '정산 내역'
				,header: [
					{ key: 0, name: '정산일', column: 'date'}
					,{ key: 0, name: '구분', column: 'account_type_name'}
					,{ key: 0, name: '상점명', column: 'shop_name'}
					,{ key: 0, name: '아이디', column: 'admin_id'}
					,{ key: 0, name: '결제 구분', column: 'payment_type'}
					,{ key: 0, name: '판매건수', column: 'total_count'}
					,{ key: 0, name: '판매금액', column: 'sale_amount'}
					,{ key: 0, name: '정산금액', column: 'amount'}
					,{ key: 0, name: '정산은행', column: 'bank_name'}
					,{ key: 0, name: '정산계좌', column: 'bank_account'}
					,{ key: 0, name: '예금주', column: 'bank_holder'}
					,{ key: 0, name: '정산여부', column: 'is_settlement'}
				]
				,content: null
			}
			,items: []
			,year_start: 2021
			,item_do: {
				ATOKEN: this.TOKEN
				,year: new Date().getFullYear()
				,month:  new Date().getMonth() + 1
			}
			,search: this.$storage.init({
				year: new Date().getFullYear()
				, month:  new Date().getMonth() + 1
				, day: new Date().getDate()
				, admin_type: ''
				, is_settlement: ''
				, is_deposit: ''
				, payment_type: ''
				, search_type: ''
				, search_value: ''
				, page: 1
			})
			,item_detail: {

			}
			,item_settlement: null
			,item_deposit: null
			,is_modal: false
			,modal_option: {
				title: '정산 상세 내역'
				,top: true
				,bottom: false
			}
			,reason: ''
		}
	}
	,computed: {
		item_list: function(){

			return this.items.filter((item) => {

				for(let i = 0; i < this.codes.S001.items.length; i ++){
					if(item.is_settlement == this.codes.S001.items[i].code_value){
						item.is_settlement_name = this.codes.S001.items[i].code_name
					}
				}
				for(let i = 0; i < this.codes.S002.items.length; i ++){
					if(item.is_deposit == this.codes.S002.items[i].code_value){
						item.is_deposit_name = this.codes.S002.items[i].code_value == '0' ? '-' : this.codes.S002.items[i].code_name
					}
				}

				switch(item.account_type_code){
					case this.codes.type_code_admin:
						item.admin_type_name = '운영관리'
						item.is_admin = true
						break;
					case this.codes.type_code_distributor:
						item.admin_type_name = '총판'
						item.is_distributor = true
						break;
					case this.codes.type_code_agency:
						item.admin_type_name = '대리점'
						item.is_agency = true
						break;

					case this.codes.type_code_supply:
						item.admin_type_name = '공급사'
						item.is_supply = true
						break;
					default:
						break;
				}

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
		, date: function(){
			let t = ''
			t = this.search.year + '-' + ('00' + this.search.month).slice(-2) + '-' + ('00' + this.search.day).slice(-2)
			return t
		}

	}
	,methods: {
		getData: async function(){
			try{
				this.$bus.$emit('on', true)

				const result = await this.$request.init({
					method: 'get'
					,url: 'management/getSettlementList'
					,data: this.search
				})

				if(result.success){
					this.items = result.data
					this.$storage.setQuery(this.search)
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message})
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$bus.$emit('on', false)
			}
		}
		,save: async function(){

			try{
				this.$bus.$emit('on', true)

				const result = await this.$request.init({
					method: 'post'
					,url: 'management/postSettlement'
					,data: this.search
				})

				if(result.success){
					await this.getData()
					this.$bus.$emit('notify', { type: 'success', message: result.message})
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message})
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$bus.$emit('on', false)
			}
		}
		,success: function(){
			this.close()
			this.getData()
		}
		,close: function(){
			this.item_detail = {}
			this.item_settlement = null
			this.item_deposit = null
			this.is_modal = false
		}
		,toDetail: function(item){
			this.is_modal = true
			this.item_detail = item
			this.modal_option.title = '정산 상세 내역 - ' + item.shop_name
		}
		,doSettlementConfirm: function(item){
			this.item_settlement = item
		}
		,doDepositConfirm: function(item){
			this.item_deposit = item
		}
		,setNotify: function({ type, message }){
			this.$bus.$emit('notify', { type: type, message: message })
		}
		,getSearch: function(page){
			if(page){
				this.search.page = page
			}

			this.getData()
		}
		, setDate: function(date){
			let t = date.split('-')
			console.log('setDate', date)
			this.search.year = t[0]
			this.search.month = t[1]
			this.search.day = t[2]

			this.getData()
		}
		,getExcel: async function(){
			try{
				this.$bus.$emit('on', true)

				const result = await this.$request.init({
					method: 'get'
					,url: 'management/getSettlementList'
					,data: {
						ATOKEN: this.search.ATOKEN
						, year: this.search.year
						, month:  this.search.month
						, day: this.search.day
						, admin_type: this.search.admin_type
						, is_settlement: this.search.is_settlement
						, is_deposit: this.search.is_deposit
						, payment_type: this.search.payment_type
						, search_type: this.search.search_type
						, search_value: this.search.search_value
						, page: 1
						, list_cnt: 2000
					}
				})

				if(result.success){
					this.excel_data.content = result.data
					this.is_excel = true
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message})
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$bus.$emit('on', false)
			}
		}
	}
	,created() {
		this.$emit('onLoad', this.program)
		this.getData()
	}
}
</script>
