<template>
	<div class="full-height">

		<div class="full-height flex-column">
			<div class="pa-10 box text-right">
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
					v-model="search.day"
					class="pa-5 box mr-10"
					@change="getSearch"
				>
					<option
						v-for="day in 31"
						:key="'day_' + day"
						:value="day"
					>{{ day }}일</option>
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
					@click="getSearch"
				>검색</button>

				<button
					class="pa-5-10 btn-green vertical-middle"
					@click="save"
				>정산 실행 </button>
			</div>

			<div class="mt-10 pa-10 bg-white full-height">
				<table
					v-if="items.lnegth > 0"
					class="table"
				>
					<colgroup>
					</colgroup>
					<thead>
					<tr>
						<th>정산일</th>
						<th>구분</th>
						<th>상점명</th>
						<th>아이디</th>
						<th>판매금액</th>
						<th>판매원가</th>
						<th>매출금액</th>
						<th>판매 수수료</th>
						<th>결제 수수료</th>
						<th>정산 수수료</th>
						<th>수수료율</th>
						<th>배송비 차감 금액</th>
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
							<td>{{ item.year }}.{{ item.month }}.{{ item.day }}</td>
							<td>{{ item.admin_type_name }}</td>
							<td>{{ item.shop_name}}</td>
							<td>{{ item.admin_id }}</td>
							<td>{{ item.sale_amount | makeComma }}</td>
							<td>{{ item.total_amount | makeComma }}</td>
							<td>{{ item.income_amount | makeComma }}</td>
							<td>{{ item.admin_type_code == 'supply' ? item.fee * -1 : '-' | makeComma }}</td>
							<td>{{ item.admin_type_code == 'agency' ? item.fee * -1 : '-' | makeComma }}</td>
							<td>{{ item.admin_type_code == 'distributor' ? item.fee * -1 : '-' | makeComma }}</td>
							<td>{{ item.admin_per }} %</td>
							<td>{{ item.minus_amount | makeComma }}</td>
							<td>{{ item.amount | makeComma }}</td>
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
			</div>
		</div>

		<Modal
			:is_modal="is_modal"
			:option="modal_option"

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

				@click="close"
				@onLoading="$emit('onLoading')"
				@offLoading="$emit('offLoading')"
				@setNotify="setNotify"
				@success="success"

				class="full-width"
			></SettlementDetail>

			<div
				v-if="user.admin_type_code == codes.type_code_amdin"
				slot="modal-bottom"
				class="bg-base pa-10 justify-center"
			>
				<button
					v-if="item_detail.is_settlement != '1'"
					class="bg-green pa-5-10 mr-10 color-eee"
					@click="doUpdate('settlement', 'confirm')"
				>정산 확인</button>

				<button
					v-if="item_detail.is_settlement == '1' && item_detail.is_deposit != '1'"
					class="bg-green pa-5-10 mr-10 color-eee"
					@click="doUpdate('deposit', 'confirm')"
				>지급 확인</button>

				<button
					v-if="item_detail.is_settlement == '0'"
					class="bg-orange pa-5-10 mr-10 color-eee"
					@click="doUpdate('settlement', 'hold')"
				>정산 보류</button>

				<button
					v-if="item_detail.is_settlement == '1' && item_detail.is_deposit == '0'"
					class="bg-orange pa-5-10 mr-10 color-eee"
					@click="doUpdate('deposit', 'hold')"
				>지급 보류</button>

				<button
					v-if="item_detail.is_settlement == '1' && item_detail.is_deposit == '0'"
					class="bg-red pa-5-10 mr-10 color-eee"
					@click="doUpdate('settlement', 'cancel')"
				>정산 취소</button>

				<button
					v-if="item_detail.is_settlement == '1' && item_detail.is_deposit == '1'"
					class="bg-red pa-5-10 mr-10 color-eee"
					@click="doUpdate('deposit', 'cancel')"
				>지급 취소</button>
			</div>
			<div
				v-else
				class="mt-20 justify-center"
				slot="modal-bottom"
			>
				<button
					class="pa-10 bg-green"
					@click="close"
				>확인</button>
			</div>
		</Modal>
	</div>
</template>

<script>
import SettlementDetail from "@/view/Settlement/SettlementDetail";
import Modal from "@/components/Modal";
import Empty from "@/view/Layout/Empty";
export default {
	name: 'SettlementList'
	,
	components: {Empty, Modal, SettlementDetail},
	props: ['Axios', 'TOKEN', 'codes', 'user']
	,data: function(){
		return {
			program: {
				name: '정산 내역'
				,top: true
				,title: true
				,bottom: false
			}
			,items: []
			,year_start: 2021
			,item_do: {
				ATOKEN: this.TOKEN
				,year: new Date().getFullYear()
				,month:  new Date().getMonth() + 1
			}
			,search: {
				ATOKEN: this.TOKEN
				,year: this.$route.query.year ? this.$route.query.year : new Date().getFullYear()
				,month:  this.$route.query.month ? this.$route.query.month : new Date().getMonth() + 1
				,day: this.$route.query.day ? this.$route.query.day : new Date().getDate()
				,admin_type: this.$route.query.admin_type ? this.$route.query.admin_type : ''
				,is_settlement: this.$route.query.is_settlement ? this.$route.query.is_settlement : ''
				,is_deposit: this.$route.query.is_deposit ? this.$route.query.is_deposit : ''
				,search_type: this.$route.query.search_type ? this.$route.query.search_type : ''
				,search_value: this.$route.query.search_value ? this.$route.query.search_value : ''
			}
			,item_detail: {

			}
			,item_settlement: null
			,item_deposit: null
			,is_modal: false
			,modal_option: {
				title: '정산 상세 내역'
				,top: true
				,bottom: true
			}
		}
	}
	,computed: {
		item_list: function(){

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

				switch(item.admin_type_code){
					default:
						item.admin_type_name = '운영관리'
						break;
					case "distributor":
						item.admin_type_name = '총판'
						break;

					case "agency":
						item.admin_type_name = '대리점'
						break;

					case "supply":
						item.admin_type_name = '공급사'
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

	}
	,methods: {
		getData: async function(){
			try{
				this.$emit('onLoading')

				const result = await this.Axios({
					method: 'get'
					,url: 'management/getSettlementList'
					,data: this.search
				})

				if(result.success){
					this.items = result.data
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message})
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$emit('offLoading')
			}
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
			this.$emit('setNotify', { type: type, message: message })
		}
		,getSearch: function(){
			this.$emit('push', { name: this.$route.name, params: this.$route.params, query: this.search})
			this.getData()
		}
		,doUpdate: async function(type, status) {
			let url = 'management/post' + type.replace(/^./, type[0].toUpperCase()) + status.replace(/^./, status[0].toUpperCase())

			try{
				const result = await this.Axios({
					method: 'post'
					,url: url
					,data: {
						ATOKEN: this.TOKEN
						,s_uid: this.item_detail.uid
						,reason: this.reason
					}
				})

				if(result.success){
					this.close()
					this.getData()
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}
		}
	}
	,created() {
		this.$emit('onLoad', this.program)
		this.getData()
	}
}
</script>