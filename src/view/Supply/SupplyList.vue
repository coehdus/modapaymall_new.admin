<template>
	<div
		class="full-height flex-column"
	>
		<Search
			:search="search"
			:option="search_option"

			@change="getData"
			@click="getData"
			@toExcel="toExcel"
			@toItem="toItem"
		></Search>

		<div
			class="mt-10 pa-10 bg-white full-height flex-column overflow-y-auto"
		>
			<div
				v-if="item_list.length > 0"
				class=""
			>
				<table class="table table-even">
					<colgroup>
						<col width="80px" />
						<col width="auto" />
						<col width="auto" />
						<col width="auto" />
						<col width="auto" />
						<col width="auto" />
						<col width="auto" />
						<col width="auto" />
						<col width="150px" />
					</colgroup>
					<thead>
						<tr>
							<th>
								<input
									type="checkbox"
								/>
							</th>
							<th>공급사명</th>
							<th>아이디</th>
							<th>이름</th>
							<th>연락처</th>
							<th>계정 사용여부</th>
							<th>상품 판매여부</th>
							<th>등록일시</th>
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
							<td>{{ item.supply_name }}</td>
							<td>{{ item.account_id }}</td>
							<td>{{ item.account_name }}</td>
							<td>{{ item.account_phone_number }}</td>
							<td
								class="full-height"
							>
								<div
									class=" flex-row justify-center"
								>
									<v-icon
										class="pa-5 "
										:class="item.account_status == 1 ? 'bg-green color-white' : 'btn-default' "
										@click="item.account_status = 1; update(item)"
									>mdi mdi-account-check</v-icon>
									<v-icon
										class="pa-5  "
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
										class="pa-5 "
										:class="item.shop_status == 1 ? 'bg-green color-white' : 'btn-default' "
										@click="item.shop_status = 1; update(item)"
									>mdi mdi-cart</v-icon>
									<v-icon
										class="pa-5  "
										:class="item.shop_status != 1 ? 'bg-red color-white' : 'btn-default' "
										@click="item.shop_status = 0; update(item)"
									>mdi mdi-cart-off</v-icon>
								</div>
							</td>
							<td>{{ item.wDate }}</td>
							<td>
								<v-icon
									@click="toDetail(item)"
									class="color-icon"
								>mdi mdi-arrow-right-bold-box-outline</v-icon>
							</td>
						</tr>
					</tbody>
				</table>
				<div
					class="mt-auto"
				>
					<Pagination
						:program="program"
						:align="'center'"
						:options="search"

					></Pagination>
				</div>
			</div>
			<Empty
				v-else
			/>
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
	name: 'SupplyList'
	, components: {Empty, Excel, Search, Pagination}
	, props: ['Axios', 'rules', 'TOKEN', 'date']
	, data: function (){
		return {
			program: {
				name: '공급사 목록'
				,top: true
				,title: true
			}
			,options: {

			}
			,search: this.$storage.init({
				ATOKEN: this.TOKEN
				,admin_level: ''
				,admin_status: ''
				,shop_status: ''
				,list_cnt: 10
				,search_type: ''
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
					{ name: '계정 사용 여부', column: 'admin_status', items: [
							{ name: '사용', column: '1'}
							,{ name: '미사용', column: '0'}
						]
					}
					,{ name: '상품 판매 여부', column: 'shop_status', items: [
							{ name: '판매 가능', column: '1'}
							,{ name: '판매 불가', column: '0'}
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
				name: '공급사 목록'
				,header: [
					{ key: 0, name: '공급사명', column: 'shop_name'}
					,{ key: 0, name: '아이디', column: 'admin_id'}
					,{ key: 0, name: '이름', column: 'admin_name'}
					,{ key: 0, name: '연락처', column: 'admin_phone'}
					,{ key: 0, name: '등록일', column: 'wDate'}
				]
				,content: null
			}
		}
	}
	,computed: {
		item_list: function (){
			return this.items.filter(function(item){

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
					,url: 'management/getSupplyList'
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
					await this.getData()
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
					,url: 'management/putSupplyUpdate'
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
				await this.getData()
				this.$emit('offLoading')
			}
		}
		,toDetail: function (item){
			this.$storage.push({ name: 'SupplyDetail', params: {idx: item.uid}, not_query: true})
		}
		,clear_item: function(){
			this.item_new = {
				ATOKEN: this.TOKEN
				,admin_level: 0
				,admin_type: 'supply'
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
					await this.getData()
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
			this.$storage.push({ name: 'SupplyItem', not_query: true})
		}
	}
	,created() {
		this.$emit('onLoad', this.program)
		this.clear_item()
		this.getData()
	}
	,watch: {
		'search.page': {
			handler: function(call){
				this.getData()
				this.$set(this.$route.params, 'page', call)
			}
		}
	}
}
</script>