<template>
	<div class="full-height">

		<div class="full-height">
			<div
				class="pa-10 box text-right"
			>
				<select
					v-model="search.year"
					class="pa-5 box mr-10"
					@change="getData"
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
					@change="getData"
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
					@change="getData"
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
					@change="getData"
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
					<th>구분</th>
					<th>상점명</th>
					<th>아이디</th>
					<th>판매금액</th>
					<th>매출금액</th>
					<th>결제 수수료</th>
					<th>차감금액</th>
					<th>정산금액</th>
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
						<td>{{ item.admin_type_name }}</td>
						<td>{{ item.shop_name}}</td>
						<td>{{ item.admin_id }}</td>
						<td>{{ item.sale_amount | makeComma }}</td>
						<td>{{ item.total_amount | makeComma }}</td>
						<td>{{ item.fee * -1 | makeComma }}</td>
						<td>{{ item.minus_amount * -1 | makeComma }}</td>
						<td>{{ item.amount | makeComma }}</td>
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

				class="full-width"
			></SettlementDetail>
		</Modal>
	</div>
</template>

<script>
import Modal from "@/components/Modal";
import SettlementDetail from "@/view/Settlement/SettlementDetail";
export default {
	name: 'SettlementList'
	,
	components: {SettlementDetail, Modal},
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
				,year: new Date().getFullYear()
				,month:  new Date().getMonth() + 1
				,admin_type: ''
				,is_settlement: ''
				,is_deposit: ''
				,search_type: ''
				,search_value: ''
			}
			,is_modal: false
			,modal_option: {
				title: '정산 상세 내역'
				,top: true
			}
			,item_detail: {

			}
		}
	}
	,computed: {
		item_list: function(){
			return this.items.filter(function(item){
				if(item.is_settlement == 0) {
					item.is_settlement_name = '정산대기'
					item.is_deposit_name = '-'
				}else{
					item.is_settlement_name = '정산완료'

					if(item.is_deposit == 0) {
						item.is_deposit_name = '지급대기'
					}else{
						item.is_deposit_name = '지급완료'
					}
				}

				switch(item.admin_type_code){
					default:
						item.admin_type_name = ''
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
					,data: this.item_do
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
		,setNotify: function({ type, message }){
			this.$emit('setNotify', { type: type, message: message })
		}
	}
	,created() {
		this.$emit('onLoad', this.program)
		this.getData()
	}
}
</script>