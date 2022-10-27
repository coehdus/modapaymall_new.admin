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
					v-model="search.pdt_category"
					class="pa-5-10 mr-10"
					@change="getSearch(1)"
				>
					<option value="">카테고리</option>
					<option
						v-for="category in category_list"
						:key="'category_' + category.uid"
						:value="category.category_code"
					>{{ category.category_name }}</option>
				</select>
				<select
					v-model="search.pdt_company"
					class="pa-5-10 mr-10"
					@change="getSearch(1)"
				>
					<option value="">공급사</option>
					<option
						v-for="supply in supply_list"
						:key="'supply_' + supply.uid"
						:value="supply.supply_id"
					>{{ supply.supply_name }}</option>
				</select>
			</template>
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
							<th>공급사 판매여부</th>
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
									v-if="is_supply"
									class=" flex-row justify-center"
								>
									<v-icon
										class="pa-5 "
										:class="item.is_supply_sale == 1 ? 'bg-green color-white' : 'btn-default' "
										@click="item.is_supply_sale = 1; update(item)"
									>mdi mdi-cart</v-icon>
									<v-icon
										class="pa-5  "
										:class="item.is_supply_sale != 1 ? 'bg-red color-white' : 'btn-default' "
										@click="item.is_supply_sale = 0; update(item)"
									>mdi mdi-cart-off</v-icon>
								</div>
								<div
									v-else
								>
									<v-icon
										v-if="item.is_supply_sale == 1"
										class="pa-5 "
										:class="item.is_supply_sale == 1 ? 'bg-green color-white' : 'btn-default' "

									>mdi mdi-cart</v-icon>
									<v-icon
										v-else
										class="pa-5  "
										:class="item.is_supply_sale != 1 ? 'bg-red color-white' : 'btn-default' "
									>mdi mdi-cart-off</v-icon>
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
		></Excel>

	</div>
</template>

<script>

import Pagination from "@/components/Pagination";
import Search from "../Layout/Search";
import Excel from "../../components/Excel";
import Empty from "@/view/Layout/Empty";
export default {
	name: 'ManagerAdminList'
	,
	components: {Empty, Excel, Search, Pagination},
	props: ['Axios', 'TOKEN', 'user', 'codes', 'date', 'rules']
	,data: function (){
		return {
			program: {
				name: '상품 목록'
				,top: true
				,title: true
			}
			,search: this.$storage.init({
				ATOKEN: this.TOKEN
				,pdt_company: ''
				,search_type: 'pdt_name'
				,is_use: ''
				,is_supply_delete: ''
				,list_cnt: 10
				,page: 1
				,pdt_category: ''
			})
			,search_option:{
				is_excel: true
				, is_item: this.user.role_group == 'agency' ? false : true
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
			,supply_list: []
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
					,{ key: 0, name: '공급사', column: 'shop_name'}
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
			if(this.user.role_group == 'admin'){
				return true
			}else{
				return false
			}
		}
		,is_agency: function(){
			if(this.user.role_group == 'agency'){
				return true
			}else{
				return false
			}
		}

		,supply_list_as: function(){

			let list = []
			this.supply_list.filter(function(item){

				list.push({
					name: item.shop_name, column: item.seller_id
				})
			})

			return list
		}
	}
	,methods: {
		getData: async function(){
			this.$emit('onLoading')
			try{
				const result = await this.Axios({
					method: 'get'
					,url: 'management/getProductList'
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
				this.$emit('offLoading')
			}
		}
		,getSearch: function(page){
			if(page){
				this.search.page = page
			}

			this.getData()
		}
		,update: async function(item){
			this.$emit('onLoading')
			try{
				const result = await this.Axios({
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
				this.$emit('offLoading')
			}
		}
		,toDetail: function (item){
			let name = 'ProductDetail'
			switch(this.user.role_group){
				case 'admin':
					break;
				case 'supply':
					break;
				case 'agency':
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
				this.$emit('onLoading')
				try{
					const result = await this.Axios({
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
					this.$emit('offLoading')
				}
			}
		}
		,getCategoryList: async function(){
			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/getCategoryList'
					,data: {
						ATOKEN: this.TOKEN
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
		,getSupplyList: async function(){
			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/getSupplyList'
					,data: {
						ATOKEN: this.TOKEN
					}
				})

				if(result.success){
					this.supply_list = result.data.result
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}
		}

		,do: async function(){

			await this.getCategoryList()

			await this.getSupplyList()

			await this.getData()
		}

	}
	,created() {
		this.$emit('onLoad', this.program)
		if(this.user.role == 'agency') {
			this.$emit('push', {name: 'ProductListAgency'})
		}else{
			this.do()
		}
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