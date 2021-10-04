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

				<select
					v-model="search.admin_type"
					class="pa-5 box mr-10"
					@change="getData"
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
						<td>{{ item.agency_id}}</td>
						<td>{{ item.supply_id }}</td>
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
							<button
								v-if="item.is_settlement == '0'"
								class="btn-success pa-5-10"
								@click="doSettlementConfirm(item)"
							>정산 완료</button>
							<button
								v-if="item.is_settlement == '1' && item.is_deposit == '0'"
								class="btn-success pa-5-10"
								@click="doDepositConfirm(item)"
							>입금 완료</button>
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
	</div>
</template>

<script>
export default {
	name: 'SettlementDelivery'
	,props: ['Axios', 'TOKEN', 'codes']
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
				,year: new Date().getFullYear()
				,month:  new Date().getMonth() + 1
				,admin_type: ''
				,is_settlement: ''
				,is_deposit: ''
				,search_type: ''
				,search_value: ''
			}
			,items: []
		}
	}
	,computed: {
		item_list: function (){
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
	}
	,created() {
		this.getData()
		this.$emit('onLoad', this.program)
	}
}
</script>