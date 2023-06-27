<template>
	<div
		class=" full-height flex-column position-relative"
	>
		<Search
			:search="search"
			:option="search_option"

			@change="getSearch"
			@click="getSearch"
			@toExcel="toExcel"
			@toItem="toItem"
		>
			<template
				slot="add"
			>
				<select
					v-model="search.pdt_company"
					class="pa-5-10 mr-10"
					@change="getCategoryList(); getData();"
					:disabled="is_agency"
				>
					<option value="">대리점</option>
					<option
						v-for="agency in agency_list"
						:key="'agency_' + agency.uid"
						:value="agency.account_id"
					>{{ agency.account_name }}</option>
				</select>
				<select
					v-model="search.pdt_category"
					class="pa-5-10 mr-10"
					@change="getData"
				>
					<option value="">카테고리</option>
					<option
						v-for="category in category_list"
						:key="'category_' + category.uid"
						:value="category.category_code"
					>{{ category.category_name }}</option>
				</select>
			</template>

			<button
				slot="last"
				class="btn-green pa-5-10 vertical-middle mr-10"
				@click="getSort"
			>상품 정렬</button>
		</Search>

		<div
			class="mt-10 pa-10 bg-white full-height overflow-y-auto position-relative"
		>
			<div
				v-if="items.length > 0"

				class="full-height flex-column"
			>
				<table class="table table-even">
					<colgroup>
						<col width="130px" />
						<col width="auto" />
						<col width="120px" />
						<col width="120px" />
						<col width="120px" />

						<col width="120px" />
						<col width="150px" />
						<col width="120px" />
						<col width="80px" />
					</colgroup>
					<thead>
					<tr>
						<th
							colspan="2"
						>상품명</th>
						<th>공급가</th>
						<th>판매가</th>
						<th>재고</th>

						<th>메인 진열여부</th>
						<th>사용여부</th>
						<th>등록일</th>
						<th>상세정보</th>
					</tr>
					</thead>
					<tbody>
					<tr
						v-for="item in item_list"
						:key="item.uid"
					>
						<td class="text-center">
							<div
								class="pdt-thumb flex-column justify-center text-center"
							>
								<img
									v-if="item.img"
									:src="item.img"
								/>
								<v-icon
									v-else
									class="color-icon"
								>mdi mdi-image</v-icon>
							</div>
						</td>
						<td
							class="text-left"
						>
							[{{ item.shop_name}}] [{{ item.category_name}}] <br/>
							{{ item.pdt_name }}
						</td>
						<td>{{ item.pdt_purchase | makeComma }}</td>
						<td>{{ item.pdt_price | makeComma }}</td>
						<td
							class="full-height"
						>{{ item.is_sold_name }}</td>

						<td>
							<div
								v-if="is_admin"
								class=" flex-row justify-center"
							>
								<v-icon class="pa-5 mdi mdi-bookmark-outline cursor-pointer" :class="item.pdt_type ? 'bg-green color-white' : 'btn-default'" @click="item.pdt_type = 'main'; update(item)" ></v-icon>
								<v-icon class="pa-5 mdi mdi-bookmark-remove cursor-pointer" :class="!item.pdt_type ? 'bg-red color-white' : 'btn-default'" @click="item.pdt_type = '';  update(item)" ></v-icon>
							</div>
							<div
								v-else
							>
								<v-icon
									v-if="item.pdt_type == 'main'"
									class="pa-5 bg-green color-white mdi mdi-bookmark-outline cursor-pointer"></v-icon>
								<v-icon
									v-else
									class="pa-5 bg-red color-white mdi mdi-bookmark-remove cursor-pointer" ></v-icon>
							</div>
						</td>
						<td
							class="full-height"
						>
							<div
								v-if="is_admin"
								class=" flex-row justify-center"
							>
								<v-icon
									class="pa-5 "
									:class="item.is_use == 1 ? 'bg-green color-white' : 'btn-default' "
									@click="item.is_use = 1; update(item)"
								>mdi mdi-power-plug</v-icon>
								<v-icon
									class="pa-5  "
									:class="item.is_use != 1 ? 'bg-red color-white' : 'btn-default' "
									@click="item.is_use = 0; update(item)"
								>mdi mdi-power-plug-off</v-icon>

								<v-icon
									class="pa-5 bg-red color-white ml-10"
									@click="deleteItem(item)"
								>mdi mdi-delete</v-icon>
							</div>
							<div
								v-else
								class=" flex-row justify-center"
							>
								<v-icon
									v-if="item.is_use == 1"
									class="pa-5 bg-green color-white"
								>mdi mdi-power-plug</v-icon>
								<v-icon
									v-else
									class="pa-5 bg-red color-white "
								>mdi mdi-power-plug-off</v-icon>
							</div>
						</td>
						<td>{{ item.wDate.substring(0, 10) }}</td>
						<td
						>
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

					class="mt-auto pa-10"

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

			@close="is_excel = false"
		></Excel>

		<Modal
			:is_modal="is_sort"
			:option="modal_option_sort"
			width="420px"
			height="480px"

			@close="is_sort = false"
			@cancel="is_sort = false"
			@click="postSortUpdate"
		>
			<template
				v-slot:modal-content
			>
				<ul
					class="bg-white"
				>
					<draggable v-model="items_sort" group="people" @start="drag=true" @end="drag=false" handle=".handle">
						<li
							v-for="(item, s_index) in items_sort"
							:key="'item_' + s_index"
							class="pa-10 under-line"
						>
							<div
								class="flex-row  "
							>
								<div
									class=" mr-10"
								>
									<img
										v-if="item.pdt_img1"
										:src="item.pdt_img1"
										style="width: 80px"
									/>
									<v-icon
										v-else
										class="color-icon"
										style="width: 80px"
									>mdi mdi-image</v-icon>
								</div>
								<div
									class="flex-1 flex-column justify-center text-left"
								>
									{{ item.pdt_name }}
								</div>
								<div
									class=" flex-column justify-center align-center handle cursor-pointer"
								>
									<v-icon>mdi mdi-menu</v-icon>
								</div>
							</div>
						</li>
					</draggable>
				</ul>
			</template>
		</Modal>

	</div>
</template>

<script>

import Pagination from "@/components/Pagination";
import Search from "../Layout/Search";
import Excel from "../../components/Excel";
import Empty from "@/view/Layout/Empty";
import Modal from "../../components/Modal";
import draggable from "vuedraggable";
export default {
	name: 'ProductSales'
	, components: {Empty, Excel, Search, Pagination, Modal, draggable}
	, props: ['Axios', 'TOKEN', 'user', 'codes', 'date', 'rules']
	,data: function (){
		return {
			program: {
				name: '매입 상품 목록'
				,top: true
				,title: true
			}
			,search: this.$storage.init({
				page: 1
				, list_cnt: 10
				, search_type: 'pdt_name'
				, search_value: ''
				, pdt_company: this.user.role == 'agency' ? this.user.account_id : ''
				, is_use: ''
				, is_supply_delete: ''
				, pdt_category: ''
			})
			,search_option:{
				is_excel: true
				, is_item: this.user.role == 'distributor' ? false : true
				, is_cnt: true
				, cnt: 0
				, tCnt: 0
				, search_type: [
					{name: '상품명', column: 'pdt_name'}
				]
				, select: [
					{
						name: '사용 여부', column: 'is_use', items: [
							{name: '사용', column: '1'}
							, {name: '미사용', column: '0'}
						]
					}
					,{
						name: '판매 여부', column: 'is_supply_delete', items: [
							{name: '판매', column: '1'}
							, {name: '미판매', column: '0'}
						]
					}
				]
			}
			,items: [

			]
			,agency_list: []
			,category_list: []
			,item: null
			,item_new: {

			}
			,options: {

			}
			,is_excel: false
			,excel_data: {
				name: '상품 목록'
				,header: [
					{ key: 0, name: '카테고리', column: 'pdt_category_name'}
					,{ key: 0, name: '대리점', column: 'shop_name'}
					,{ key: 0, name: '상품명', column: 'pdt_name'}
					,{ key: 0, name: '공급가', column: 'pdt_purchase'}
					,{ key: 0, name: '재고', column: 'is_sold_name'}
					,{ key: 0, name: '판매여부', column: 'is_supply_sale_name'}
					,{ key: 0, name: '사용여부', column: 'is_use_name'}
					,{ key: 0, name: '등록일', column: 'wDate'}
				]
				,content: null
			}
			,is_item : true
			,is_item_view: false
			,is_detail_view: false
			, items_sort: []
			, is_sort: false
			, modal_option_sort: {
				top: true
				, bottom: true
				, title: '상품 정렬'
			}
		}
	}
	,computed: {
		item_list: function (){

			let index = 0
			return this.items.filter((item) => {
				item.ATOKEN = this.TOKEN
				if(item.pdt_img2){
					item.img = item.pdt_img2
				}else{
					item.img = ''
				}

				if(item.is_use == '1'){
					item.is_use_name = '사용'
				}else{
					item.is_use_name = '미사용'
				}

				if(item.is_supply_sale == '1'){
					item.is_supply_sale_name = '판매'
				}else{
					item.is_supply_sale_name = '판매 불가'
				}

				item.is_sold_name = this.codes.is_sold[item.is_sold]

				if(item.is_sold == 2){
					item.is_sold_name = item.pdt_stock
				}

				item.index = index
				index++
				return item
			})
		}
		,is_supply: function(){
			if(this.user.role_group == 'supply'){
				return true
			}else{
				return false
			}
		}
		,is_admin: function(){
			if(this.user.role_group == 'admin' || this.user.role == 'agency'){
				return true
			}else{
				return false
			}
		}
		,is_agency: function(){
			if(this.user.role == 'agency'){
				return true
			}else{
				return false
			}
		}

		,agency_list_as: function(){

			let list = []
			this.agency_list.filter(function(item){

				list.push({
					name: item.shop_name, column: item.seller_id
				})
			})

			return list
		}
		, items_sort_do: function(){
			let t = []
			this.items_sort.filter((item)=>{
				t.push(item.uid)
			})
			return t
		}
	}
	,methods: {
		getData: async function(){
			this.$bus.$emit('on', true)
			try{
				const result = await this.$request.init({
					method: 'get'
					,url: 'management/getSalesProductList'
					,data: this.search
					,auth: true
				})

				if(result.success){
					this.items = result.data.result
					this.$set(this.search, 'total_count', result.data.tCnt)
					this.$set(this.search_option, 'tCnt', result.data.tCnt)
					this.$set(this.search_option, 'cnt', result.data.cnt)
					this.$storage.setQuery(this.search)
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$bus.$emit('on', false)
			}
		}
		,getSearch: function(page){
			if(page){
				this.search.page = page
			}

			this.getData()
		}
		,update: async function(item){
			this.$bus.$emit('on', true)
			try{
				const result = await this.$request.init({
					method: 'post'
					,url: 'management/postProductUpdate'
					,data: item
				})

				if(result.success){
					this.$bus.$emit('notify', { type: 'success', message: result.message })
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
				this.$bus.$emit('notify', { type: 'error', message: '통신 오류' })
			}finally {
				this.$bus.$emit('on', false)
			}
		}
		,toDetail: function (item){
			let name = 'ProductDetail'
			switch(this.user.role){
				case 'admin':
					break;
				case 'supply':
					break;
				case 'distributor':
					name += 'Agency'
					break;
			}
			this.$storage.push({ name: name, params: { pdt_code: item.pdt_code }, not_query: true})
		}
		,clear_item: function(){
			this.item_new = {
				ATOKEN: this.TOKEN
				,pdt_company: ''
				,pdt_category: ''
			}
			this.is_item = false
		}
		,toExcel: function(){
			this.excel_data.content = this.items
			this.is_excel = true
		}
		,toItem: function (){
			this.$storage.push({ name: 'ProductItem', not_query: true})
		}
		,setProgram: function(program){
			this.$emit('onLoad', program)
		}
		,goBack: function(){
			this.item = null
			this.is_detail_view = false
			this.is_item_view = false
			this.$emit('onLoad', this.program)
		}
		,goSuccess: function(){
			this.is_detail_view = false
			this.is_item_view = false
			this.getData()
		}
		,setNotify: function({ type, message}){
			this.$bus.$emit('notify', { type: type, message: message })
		}
		,deleteItem: async  function(item){
			if(confirm("삭제하시겠습니까?")){
				this.$bus.$emit('on', true)
				try{
					const result = await this.$request.init({
						method: 'post'
						,url: 'management/postProductDelete'
						,data: {
							ATOKEN: this.TOKEN
							,pdt_uid: item.uid
							,pdt_code: item.pdt_code
						}
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
		}
		,getCategoryList: async function(){
			try{
				this.search.pdt_category = ''
				const result = await this.$request.init({
					method: 'get'
					,url: 'management/getCategoryList'
					,data: {
						agency_id: this.search.pdt_company
					}
				})

				if(result.success){
					this.category_list = result.data.result
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}
		}
		,getAgencyList: async function(){
			try{
				const result = await this.$request.init({
					method: 'get'
					,url: 'management/getAgencyList'
					,data: {
						agency_type: 'A001003'
					}
				})

				if(result.success){
					this.agency_list = result.data.result
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}
		}

		,do: async function(){

			await this.getAgencyList()

			await this.getCategoryList()

			await this.getData()
		}
		, getSort: async function(){

			try{
				this.$bus.$emit('on', true)
				const result = await this.$request.init({
					method: 'get'
					,url: 'management/getProductSortAgency'
					,data: {
						pdt_company: this.search.pdt_company
					}
				})

				if(result.success) {
					this.items_sort = result.data
					this.is_sort = true
				}else{
					throw result.message
				}
			}catch (e) {
				console.log(e)
				this.$bus.$emit('notify', { type: 'error', message: e })
			}finally {
				//await this.getData()
				this.$bus.$emit('on', false)
			}
		}
		, postSortUpdate: async function(){
			try{
				this.$bus.$emit('on', true)
				const result = await this.$request.init({
					method: 'post'
					,url: 'management/postProductSortAgency'
					,data: {
						items: this.items_sort_do
					}
				})

				if(result.success) {
					this.is_sort = false
					await this.getData();

					this.$bus.$emit('notify', { type: 'success', message: result.message })
				}else{
					throw result.message
				}
			}catch (e) {
				console.log(e)
				this.$bus.$emit('notify', { type: 'error', message: '통신 오류' })
			}finally {
				//await this.getData()
				this.$bus.$emit('on', false)
			}
		}

	}
	,created() {
		this.$emit('onLoad', this.program)
		this.do()
	}
	,watch: {

	}
}
</script>

<style>

.pdt-thumb {
	width: 100%;
	height: 80px;
	overflow: hidden;
}

.pdt-img img { width: 100%}
</style>