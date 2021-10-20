<template>
	<div
		class=" full-height flex-column position-relative "
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
					@change="getSearch"
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
					@change="getSearch"
				>
					<option value="">공급사</option>
					<option
						v-for="supply in supply_list"
						:key="'supply_' + supply.uid"
						:value="supply.seller_id"
					>{{ supply.shop_name }}</option>
				</select>
			</template>
		</Search>

		<div
			class="mt-10 full-height flex-column overflow-y-auto position-relative"
		>
			<div
				class="full-width full-height flex-column overflow-y-auto"
			>
				<table class="mt-10 ">
					<colgroup>
						<col width="80px" />
						<col width="auto" />
						<col width="120px" />
						<col width="120px" />
						<col width="120px" />
						<col width="120px" />
						<col width="120px" />
						<col width="120px" />
						<col width="120px" />
						<col width="80px" />
					</colgroup>
					<thead>
						<tr>
							<th
								colspan="2"
							>상품명</th>
							<th>공급가</th>
							<th>공급 배송비</th>
							<th>상품 배송비</th>
							<th>재고</th>
							<th>판매여부</th>
							<th
								v-if="!is_supply"
							>사용여부</th>
							<th>등록일</th>
							<th>상세정보</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="item in item_list"
							:key="item.uid"
						>
							<td>
								<div
									class="pdt-img flex-column justify-center"
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
							<td>{{ item.shop_delivery_price | makeComma }}</td>
							<td>{{ item.pdt_delivery | makeComma }}</td>
							<td
								class="full-height"
							>{{ item.is_sold_name }}</td>
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
								v-if="!is_supply"
								class="full-height"
							>
								<div
									v-if="is_agency"
									class=" flex-row justify-center"
								>
									<v-icon
										class="pa-5 "
										:class="item.agency_use == 1 ? 'bg-green color-white' : 'btn-default' "
										@click="item.is_use = 1; update(item)"
									>mdi mdi-power-plug</v-icon>
									<v-icon
										class="pa-5  "
										:class="item.agency_use != 1 ? 'bg-red color-white' : 'btn-default' "
										@click="item.is_use = 0; update(item)"
									>mdi mdi-power-plug-off</v-icon>
								</div>
								<div
									v-else
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
			</div>

			<Pagination
				:program="program"
				:align="'center'"
				:options="search"

				class="mt-auto pa-10"
			></Pagination>
		</div>

		<Excel
			v-if="is_excel"
			:excel_data="excel_data"
			:date="date"
		></Excel>

		<ProductItem
			v-if="is_item_view"
			:Axios="Axios"
			:rules="rules"
			:user="user"
			:supply_list="supply_list"
			:category_list="category_list"
			:codes="codes"

			@onLoad="setProgram"
			@goBack="goBack"
			@goSuccess="goSuccess"
			@setNotify="setNotify"

			class="position-absolute bg-base full-width full-height"
			style="top: 0; right: 0"
		></ProductItem>

		<ProductDetail
			v-if="is_detail_view"
			:Axios="Axios"
			:rules="rules"
			:user="user"
			:supply_list="supply_list"
			:category_list="category_list"
			:codes="codes"
			:pdt_code="item.pdt_code"
			:TOKEN="TOKEN"

			@onLoad="setProgram"
			@goBack="goBack"
			@goSuccess="goSuccess"
			@setNotify="setNotify"

			class="pa-10 position-absolute bg-base full-width full-height"
			style="top: 0; right: 0"
		></ProductDetail>
	</div>
</template>

<script>

import Pagination from "@/components/Pagination";
import Search from "../Layout/Search";
import Excel from "../../components/Excel";
import ProductItem from "./ProductItem";
import ProductDetail from "@/view/Product/ProductDetail";
export default {
	name: 'ManagerAdminList'
	,
	components: {ProductDetail, ProductItem, Excel, Search, Pagination},
	props: ['Axios', 'TOKEN', 'user', 'codes', 'date', 'rules', 'supply_list', 'category_list']
	,data: function (){
		return {
			program: {
				name: '상품 목록'
				,top: true
				,title: true
			}
			,search: {
				ATOKEN: this.TOKEN
				,pdt_company: this.$route.query.pdt_company ? this.$route.query.pdt_company : ''
				,search_type: this.$route.query.search_type ? this.$route.query.search_type : 'pdt_name'
				,is_use: this.$route.query.is_use ? this.$route.query.is_use : ''
				,list_cnt: this.$route.query.list_cnt ? this.$route.query.list_cnt : 10
				,page: this.$route.query.page ? this.$route.query.page : 1
				,pdt_category: ''
			}
			,search_option:{
				is_excel: true
				, is_item: true
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
				]
			}
			,items: [

			]
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
					,{ key: 0, name: '공급 배송비', column: 'pdt_delivery'}
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
			const self = this
			let index = 0
			return this.items.filter(function(item){
					item.ATOKEN = self.TOKEN
					if(item.pdt_img1){
						item.img = self.$language.img_url + item.pdt_img1
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

					item.is_sold_name = self.codes.is_sold[item.is_sold]

					if(item.is_sold == 2){
						item.is_sold_name = item.pdt_stock
					}

					item.index = index
					index++
				return item
			})
		}
		,is_supply: function(){
			if(this.user.admin_type == 'supply'){
				return true
			}else{
				return false
			}
		}
		,is_agency: function(){
			if(this.user.admin_type == 'agency'){
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

				}else{
					this.$emit('setNotify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$emit('offLoading')
			}
		}
		,getSearch: function(){
			this.$emit('push', { name: this.$route.name, paramas: this.$route.params, query: this.search })
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
					this.$emit('setNotify', { type: 'success', message: result.message })
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
				this.$emit('setNotify', { type: 'error', message: '통신 오류' })
			}finally {
				await this.getSearch()
				this.$emit('offLoading')
			}
		}
		,toDetail: function (item){
			let name = 'ProductDetail'
			switch(this.user.admin_type_code){
				case 'admin':
					break;
				case 'supply':
					name += 'supply'
					break;
				case 'agency':
					name += 'agency'
					break;
			}
			this.$emit('push', { name: name, params: { pdt_code: item.pdt_code }})
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
			this.$router.push({ name: 'ProductItem'})
			//this.is_item_view = !this.is_item_view
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
			this.$emit('setNotify', { type: type, message: message })
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

	}
	,created() {
		this.$emit('onLoad', this.program)
		if(this.user.admin_type_code == 'agency'){
			this.$emit('push', { name: 'ProductListAgency'})
		}else if(this.user.admin_type_code == 'supply'){
			this.$emit('push', { name: 'ProductListSupply'})
		}else if(this.user.admin_type_code == "admin" || this.user.admin_type_code == "distributor") {
			this.clear_item()
			this.getData()
		}else{
			this.$router.back()
		}
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

<style>

	.pdt-img {
		width: 80px;
		height: 80px;
		overflow: hidden;
	}
	.pdt-img img { width: 100%}
</style>