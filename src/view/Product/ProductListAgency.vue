<template>
	<div
		class="full-height flex-column position-relative"
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
				<label
					class=" pa-5 vertical-middle mr-10"
					@click="search.agency_use = search.agency_use == 1 ? null : 1; getSearch()"
				>
					<v-icon
						v-if="search.agency_use == 1"
						class="color-green"
					>mdi mdi-checkbox-marked</v-icon>
					<v-icon
						v-else
						class="color-icon"
					>mdi mdi-checkbox-blank-outline</v-icon>
					<span
						:class="{ 'color-green': search.agency_use == 1}"
					>진열 상품만 보기</span>
				</label>
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
			class="mt-10 full-height full-width justify-space-between flex-column overflow-y-auto position-relative"
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
						<col width="120px" />
						<col width="80px" />
					</colgroup>
					<thead>
					<tr>
						<th
							colspan="2"
						>상품명</th>
						<th>공급가</th>
						<th>마진가</th>
						<th>판매가</th>
						<th>배송비</th>
						<th>재고</th>
						<th>판매여부</th>
						<th>진열여부</th>
						<th>등록일</th>
						<th>상세정보</th>
					</tr>
					</thead>
					<tbody>
					<tr
						v-for="item in item_list"
						:key="item.uid"
					>
						<td
						>
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
							[{{ item.shop_name}}] [{{ item.category_name }}] <br/>
							{{ item.pdt_name }}
							<div
								v-if="item.agency_use == 1"
								class="mt-5"
							>
								메인진열:
								<label
									class="mr-10"
								><input type="checkbox" class="vertical-middle" @change="setPdtType(item, 'new')" :checked="item.is_new"/> NEW</label>
								<label
									class="mr-10"
								><input type="checkbox" class="vertical-middle" @change="setPdtType(item, 'hot')" :checked="item.is_hot"/> HOT</label><label
									class="mr-10"
								><input type="checkbox" class="vertical-middle" @change="setPdtType(item, 'reccom')" :checked="item.is_reccom"/> 추천 상품</label>
							</div>
						</td>
						<td>{{ item.pdt_purchase | makeComma }} 원</td>
						<td>
							<input
								v-model="item.agency_price"
								type="number"
								class="box flex-1 pa-5"
								style="width: 80px"
								@change="update(item)"
								:rules="[rules.max(item, 'agency_price', 10)]"
							/> 원
						</td>
						<td>
							<input
								v-model="item.agency_sale_price"
								type="number"
								class="box flex-1 pa-5"
								style="width: 80px"
								:rules="[rules.max(item, 'agency_sale_price', 10)]"
								readonly
							/> 원
						</td>
						<td>{{ item.shop_delivery_price | makeComma }}</td>
						<td>{{ item.is_sold_name }}</td>
						<td>
							<v-icon
								v-if="item.is_use == 1"
								class="pa-5 "
								:class="item.is_use == 1 ? 'bg-green color-white' : 'btn-default' "

							>mdi mdi-cart</v-icon>
							<v-icon
								v-else
								class="pa-5  "
								:class="item.is_use != 1 ? 'bg-red color-white' : 'btn-default' "
							>mdi mdi-cart-off</v-icon>
						</td>
						<td
							class="full-height"
						>
							<div
								class=" flex-row justify-center"
							>
								<v-icon
									class="pa-5 "
									:class="item.agency_use == 1 ? 'bg-green color-white' : 'btn-default' "
									@click="item.agency_use = 1; update(item)"
								>mdi mdi-power-plug</v-icon>
								<v-icon
									class="pa-5  "
									:class="item.agency_use != 1 ? 'bg-red color-white' : 'btn-default' "
									@click="item.agency_use = 0; update(item)"
								>mdi mdi-power-plug-off</v-icon>
							</div>
						</td>
						<td>{{ item.wDate.substring(0, 10) }}</td>
						<td
							@click="setItem(item)"
						>
							<v-icon
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
		</div>

		<Excel
			v-if="is_excel"
			:excel_data="excel_data"
			:date="date"
		></Excel>

		<ProductDetail
			v-if="is_detail_view"
			:Axios="Axios"
			:rules="rules"
			:member_info="member_info"
			:supply_list="supply_list"
			:category_list="category_list"
			:codes="codes"
			:pdt_code="item.pdt_code"
			:TOKEN="TOKEN"

			@onLoad="setProgram"
			@goBack="goBack"
			@goSuccess="goSuccess"
			@setNotify="setNotify"
			@update="update"

			class="pa-10 position-absolute bg-base full-width full-height"
			style="top: 0; right: 0"
		></ProductDetail>
	</div>
</template>

<script>

import Pagination from "@/components/Pagination";
import Search from "../Layout/Search";
import Excel from "../../components/Excel";
import ProductDetail from "@/view/Product/ProductDetailAgency";

export default {
	name: 'ManagerAdminList'
	,
	components: {ProductDetail, Excel, Search, Pagination,},
	props: ['Axios', 'TOKEN', 'user', 'codes', 'rules', 'date', 'category_list', 'supply_list']
	,data: function (){
		return {
			program: {
				name: '상품 목록'
				,top: true
				,title: true
			}
			,search: {
				ATOKEN: this.TOKEN
				,page: this.$route.query.page ? this.$route.query.page : 1
				,search_type: this.$route.query.search_type ? this.$route.query.search_type : 'pdt_name'
				,search_value: this.$route.query.search_value ? this.$route.query.search_value : ''
				,pdt_company: this.$route.query.pdt_company ? this.$route.query.pdt_company : ''
				,agency_use: this.$route.query.agency_use ? this.$route.query.agency_use : null
				,list_cnt: this.$route.query.list_cnt ? this.$route.query.list_cnt : 10
			}
			,search_option:{
				is_excel: true
				,is_item: false
				,is_cnt: true
				,cnt: 0
				,tCnt: 0
				,search_type: [
					{ name: '상품명', column: 'pdt_name'}
				]
			}
			,items: [

			]
			,item: {

			}
			,options: {

			}
			,pdt_type: []
			,is_excel: false
			,excel_data: {
				name: '상품 목록'
				,header: [
					{ key: 0, name: '공급사', column: 'shop_name'}
					,{ key: 0, name: '카테고리', column: 'category_name'}
					,{ key: 0, name: '상품명', column: 'pdt_name'}
					,{ key: 0, name: '공급가', column: 'pdt_purchase'}
					,{ key: 0, name: '마진가', column: 'agency_price'}
					,{ key: 0, name: '판매가', column: 'agency_sale_price'}
					,{ key: 0, name: '공급 배송비', column: 'pdt_delivery'}
					,{ key: 0, name: '재고', column: 'pdt_stock'}
					,{ key: 0, name: '판매여부', column: 'is_use_name'}
					,{ key: 0, name: '진열여부', column: 'agency_use_name'}
					,{ key: 0, name: '등록일', column: 'wDate'}
				]
				,content: null
			}
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
					item.is_use_name = '판매가능'
				}else{
					item.is_use_name = '판매불가'
				}

				if(item.agency_use == '1'){
					item.agency_use_name = '진열상품'
				}else{
					item.agency_use_name = '미진열'
				}

				item.is_sold_name = self.codes.is_sold[item.is_sold]

				if(item.is_sold == 2){
					item.is_sold_name = item.pdt_stock
				}

				if(item.agency_pdt_type) {
					if (item.agency_pdt_type.indexOf('new') > -1) {
						item.is_new = true
					}
					if (item.agency_pdt_type.indexOf('hot') > -1) {
						item.is_hot = true
					}
					if (item.agency_pdt_type.indexOf('reccom') > -1) {
						item.is_reccom = true
					}
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
		,select_option_admin: function(){
			let list = []
			this.supply_list.filter(function(item){

				list.push({
					name: item.admin_name
					,column: item.admin_id
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
				})

				if(result.success){
					this.items = result.data.result
					this.$set(this.search, 'total_count', result.data.tCnt)
					this.search_option.tCnt = result.data.tCnt
					this.search_option.cnt = result.data.cnt
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$emit('offLoading')
			}
		}
		,update: async function(item){
			this.$emit('onLoading')
			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/postProductUpdate'
					,data: {
						ATOKEN: this.TOKEN
						,uid: item.uid
						,pdt_code: item.pdt_code
						,agency_price: item.agency_price ? item.agency_price : ''
						,agency_sale_price: item.agency_sale_price ? item.agency_sale_price : ''
						,agency_use: item.agency_use
						,pdt_type: item.pdt_type
					}
				})

				if(result.success){
					this.is_detail_view = false
					this.$emit('setNotify', { type: 'success', message: result.message })
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
				this.$emit('setNotify', { type: 'error', message: '통신 오류' })
			}finally {
				await this.getSearch()
				this.$emit('offnLoading')
			}
		}
		,setItem: function (item){
			this.item = item
			this.is_detail_view = !this.is_detail_view
		}
		,toExcel: function(){
			this.excel_data.content = this.item_list
			this.is_excel = true
		}
		,toItem: function (){
			this.is_item = !this.is_item
		}
		,getSearch: function(){
			this.$emit('push', { name: this.$route.name, param: this.$route.params, query: this.search})
			this.getData()
		}
		,setPdtType: function(item, type){

			let pdt_type = item.agency_pdt_type.split(',')

			if(pdt_type.indexOf(type) > -1){
				pdt_type.pop(pdt_type.indexOf(type))
			}else {
				pdt_type.push(type)
			}

			item.pdt_type = pdt_type

			this.update(item)
		}
		,setProgram: function(program){
			this.$emit('onLoad', program)
		}
		,goBack: function(){
			this.item = null
			this.is_detail_view = false
			this.$emit('onLoad', this.program)
		}
		,goSuccess: function(){
			this.is_detail_view = false
			this.getSearch()
		}
		,setNotify: function({ type, message}){
			this.$emit('setNotify', { type: type, message: message })
		}

	}
	,created() {
		this.$emit('onLoad', this.program)
		this.getData()
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