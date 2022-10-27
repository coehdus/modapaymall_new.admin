<template>
	<div
		class="full-height flex-column"
	>
		<Search
			:search="search"
			:option="search_option"

			@change="getSearch"
			@click="getSearch"
			@toExcel="toExcel"
			@toItem="toItem"
		>
			<select
				v-if="user.role == codes.type_code_admin"
				slot="add"
				v-model="search.agency_type"
				class="pa-5-10 mr-10"

				@change="search.agency_upper = ''; getSearch(1)"
			>
				<option value="">영업단 구분</option>
				<template
					v-for="(code, index) in codes.A001.items"
				>
				<option
					v-if="code.code_index > 1 && code.code_index <4"
					:key="code.total_code + '_' + index"
					:value="code.total_code"
				>{{ code.code_name }}</option>
				</template>
			</select>
			<select

				v-if="search.agency_type == ''"
				slot="add"
				v-model="search.agency_upper"
				class="pa-5-10 mr-10"

				@change="getSearch(1)"
			>
				<option value="">총판 구분</option>
				<template
					v-for="(upper, index) in items_upper"
				>
					<option
						v-if="upper.agency_type == 'A001002'"
						:key="upper.uid + '_' + index"
						:value="upper.uid"
					>{{ upper.agency_name }}</option>
				</template>
			</select>
		</Search>

		<div
			class="mt-10 bg-white pa-10 full-height overflow-y-auto"
		>
			<div v-if="items.length > 0">
				<table class="table table-even">
					<colgroup>
						<col width="80px" />
						<col width="auto" />
						<col width="auto" />
						<col width="auto" />
						<col width="auto" />

						<col width="auto" />
						<col width="auto" />
						<col width="150px" />
						<col width="120px" />
						<col width="100px" />
					</colgroup>
					<thead>
					<tr>
						<th>
							<input
								type="checkbox"
							/>
						</th>
						<th>구분</th>
						<th>소속</th>
						<th>아이디</th>
						<th>이름</th>
						<th>연락처</th>
						<th>가입일</th>
						<th>계정 사용 여부</th>
						<th>상품 판매 여부</th>
						<th>상세정보</th>
					</tr>
					</thead>
					<tbody>
					<tr
						v-for="item in item_list"
						:key="item.uid"
						:class="{ 'bg-select': item.uid == item_new.uid }"
					>
						<td>
							<input
								type="checkbox"
							/>
						</td>
						<td>{{ item.agency_type_name }}</td>
						<td>{{ item.agency_upper_name }}</td>
						<td>{{ item.account_id }}</td>
						<td>{{ item.account_name }}</td>
						<td>{{ item.account_phone_number }}</td>
						<td>{{ item.wDate }}</td>
						<td
							class="full-height"
						>
							<div
								class=" flex-row justify-center"
							>
								<v-icon

									class="pa-5"
									:class="item.account_status == 1 ? 'bg-green color-white' : 'btn-default' "
									@click="item.account_status = 1; update(item)"
								>mdi mdi-account-check</v-icon>
								<v-icon

									class="pa-5 "
									:class="item.account_status != 1 ? 'bg-red color-white' : 'btn-default' "
									@click="item.account_status = 0; update(item)"
								>mdi mdi-account-off</v-icon>

								<v-icon

									class="pa-5 bg-red color-white ml-10"
									@click="confirmDelete(item)"
								>mdi mdi-delete-forever</v-icon>
							</div>
						</td>
						<td
							class="full-height"
						>
							<div
								class=" flex-row justify-center"
							>
								<v-icon

									class="pa-5"
									:class="item.sales_status == 1 ? 'bg-green color-white' : 'btn-default' "
									@click="item.sales_status = 1; update(item)"
								>mdi mdi-cart</v-icon>
								<v-icon

									class="pa-5 "
									:class="item.sales_status != 1 ? 'bg-red color-white' : 'btn-default' "
									@click="item.sales_status = 0; update(item)"
								>mdi mdi-cart-off</v-icon>
							</div>
						</td>
						<td>
							<v-icon
								v-if="item.uid == item_new.uid"
								class="color-red"
								@click="toDetail(item)"
							>mdi mdi-close-box-outline</v-icon>
							<v-icon
								v-else
								@click="toDetail(item)"
								class="color-icon"
							>mdi mdi-arrow-right-bold-box-outline</v-icon>
						</td>
					</tr>
					</tbody>
				</table>

				<Pagination
					:program="program"
					:align="'center'"
					:options="search"

					class="mt-auto"
					@click="getSearch"
				></Pagination>
			</div>

			<Empty
				v-else
			></Empty>
		</div>

		<Excel
			v-if="is_excel"
			:excel_data="excel_data"
			:date="date"
		></Excel>
	</div>
</template>

<script>

import Pagination from "../../components/Pagination";
import Search from "../Layout/Search";
import Excel from "../../components/Excel";
import Empty from "@/view/Layout/Empty";

export default {
	name: 'AgencyList'
	, components: {Empty, Excel, Search, Pagination}
	, props: ['Axios', 'rules', 'TOKEN', 'date', 'codes', 'user']
	, data: function (){
		return {
			program: {
				name: '영업점 목록'
				,top: true
				,title: true
			}
			,options: {

			}
			,search: this.$storage.init({
				ATOKEN: this.TOKEN
				, page: 1
				, search_type: ''
				, search_value: ''
				, list_cnt: 10
				, account_status: ''
				, agency_type: ''
				, agency_upper: ''
			})
			,search_option:{

				is_item: true
				,is_excel: true
				,is_cnt: true
				,cnt: 0
				,tCnt: 0
				,search_type: [
					{ name: '아이디', column: 'admin_id'}
					,{ name: '이름', column: 'admin_name'}
				]
				,select: [
					{ name: '사용 여부', column: 'account_status', items: [
							{ name: '사용', column: '1'}
							,{ name: '미사용', column: '0'}
						]
					}
				]
			}
			,items: [

			]
			,item_new: {

			}
			,is_item: false
			,is_excel: false
			,excel_data: {
				name: '영업점 목록'
				,header: [
					{ key: 0, name: '구분', column: 'type_name'}
					,{ key: 0, name: '영업점명', column: 'shop_name'}
					,{ key: 0, name: '아이디', column: 'admin_id'}
					,{ key: 0, name: '이름', column: 'admin_name'}
					,{ key: 0, name: '연락처', column: 'admin_tell'}
					,{ key: 0, name: '가입일', column: 'wDate'}
				]
				,content: null
			}
			, items_upper: []
		}
	}
	,computed: {
		item_list: function (){

			return this.items.filter((item) => {

				return item
			})
		}
		,btn_name: function (){
			if(this.item_new.uid){
				return '저장'
			}else{
				return '신규 등록'
			}
		}
	}
	,methods: {
		getData: async function(){
			this.$emit('onLoading')
			try{
				const result = await this.Axios({
					method: 'get'
					,url: 'management/getAgencyList'
					,data: this.search
				})

				if(result.success){
					this.items = result.data.result
					this.$set(this.search, 'total_count', result.data.tCnt)
					this.search_option.tCnt = result.data.tCnt
					this.search_option.cnt = result.data.cnt
					this.$storage.setQuery(this.search)
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$emit('offLoading')
			}
		}
		,save: async function(){
			this.$emit('onLoading')
			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/postSeller'
					,data: this.item_new
				})

				if(result.success){
					await this.getSearch()
					this.clear_item()
					this.$bus.$emit('notify', { type: 'success', message: result.message })
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
				this.$bus.$emit('notify', { type: 'error', message: '통신 오류' })
			}finally {
				this.$emit('offLoading')
			}
		}
		,update: async function(item){
			this.$emit('onLoading')
			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/putAgencyUpdate'
					,data: item
				})

				if(result.success){
					this.clear_item()
					this.$bus.$emit('notify', { type: 'success', message: result.message })
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
				this.$bus.$emit('notify', { type: 'error', message: '통신 오류' })
			}finally {
				await this.getSearch()
				this.$emit('offLoading')
			}
		}
		,toDetail: function (item){
			this.$emit('push', { name: 'AgencyDetail', params: { type: item.admin_type, idx: item.uid }})
		}
		,clear_item: function(){
			this.item_new = {
				ATOKEN: this.TOKEN
				,admin_level: 0
				,admin_type: 'agency'
			}
			this.is_item = false
		}
		,confirmDelete: function(item){
			if(confirm("삭제하시겠습니까?")){
				this.deleteItem(item)
			}
		}
		,deleteItem: async  function(item){
			this.$emit('onLoading')
			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/postAdminDelete'
					,data: item
				})

				if(result.success){
					await this.getSearch()
					this.clear_item()
					this.$bus.$emit('notify', { type: 'success', message: result.message })
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
				this.$bus.$emit('notify', { type: 'error', message: '통신 오류' })
			}finally {
				this.$emit('offLoading')
			}
		}
		,toExcel: function(){
			this.excel_data.content = this.items
			this.is_excel = true
		}
		,toItem: function (){
			this.$emit('push', { name: 'AgencyItem', params: { type: this.$route.params.type}})
		}
		,getSearch: function(page){
			if(page){
				this.search.page = page
			}

			this.getData()
		}
		, getDistributorList: async function(){
			try{
				this.$emit('onLoading')
				const result = await this.Axios({
					method: 'get'
					,url: 'management/getAgencyUpper'
					,data: {
						agency_type: 'A001003'
					}
				})
				if(result.success){
					this.items_upper = result.data
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message})
				}
			}catch(e){
				console.log(e)
			}finally {
				this.$emit('offLoading')
			}
		}
	}
	,created() {
		this.$emit('onLoad', this.program)
		this.clear_item()
		this.getData()
		this.getDistributorList()
	}
	,watch: {
		'search.page': {
			handler: function(){
				this.getSearch()
			}
		}
	}
}
</script>