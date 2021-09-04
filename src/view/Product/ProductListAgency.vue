<template>
	<div
		class="full-height flex-column"
	>
		<Search
			:search="search"
			:option="search_option"

			@change="getSearchData"
			@click="getSearchData"
			@toExcel="toExcel"
			@toItem="toItem"
		>
			<label
				slot="add"
				class=" pa-5 vertical-middle mr-10"
				@click="search.agency_use = search.agency_use == 1 ? null : 1; getSearchData()"
			>
				<v-icon
					v-if="search.agency_use == 1"
					class="color-green"
				>mdi mdi-checkbox-marked</v-icon>
				<v-icon
					v-else
					class="color-icon"
				>mdi mdi-checkbox-marked</v-icon>
				<span
					:class="{ 'color-green': search.agency_use == 1}"
				>진열 상품만 보기</span>
			</label>

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
						<col width="80px" />
						<col width="auto" />
						<col width="120px" />
						<col width="120px" />
						<col width="120px" />
						<col width="120px" />
						<col width="80px" />
						<col width="120px" />
						<col width="120px" />
						<col width="150px" />
						<col width="80px" />
					</colgroup>
					<thead>
					<tr>
						<th>
							<input
								type="checkbox"
							/>
						</th>
						<th
							colspan="2"
						>상품명</th>
						<th>공급가</th>
						<th>마진가</th>
						<th>판매가</th>
						<th>배송비</th>
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
							<input
								type="checkbox"
							/>
						</td>
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
							[{{ item.shop_name}}] <br/>
							{{ item.pdt_category_name }} <br/>
							{{ item.pdt_name }}
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

		<SideB
			v-if="item.uid"
			:title="'상품 상세 정보'"
		>
			<div
				slot="item"
			>

			</div>
		</SideB>

		<Excel
			v-if="is_excel"
			:excel_data="excel_data"
			:date="date"
		></Excel>
	</div>
</template>

<script>
import SideB from "../Layout/SideB";
import Pagination from "@/components/Pagination";
import Search from "../Layout/Search";
import Excel from "../../components/Excel";

export default {
	name: 'ManagerAdminList'
	,
	components: {Excel, Search, Pagination, SideB},
	props: ['Axios', 'TOKEN', 'member_info', 'codes', 'rules', 'date']
	,data: function (){
		return {
			program: {
				name: '상품 목록'
				,top: true
				,title: true
			}
			,search: {
				ATOKEN: this.TOKEN
				,pdt_company: ''
				,search_type: 'pdt_name'
				,agency_use: null
				,list_cnt: 10
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
				,select: [
					{ name: '공급사', column: 'pdt_company', items: []}
				]
			}
			,items: [

			]
			,item: {

			}
			,options: {

			}
			,supply_list: []
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
					,{ key: 0, name: '판매여부', column: 'agency_use_name'}
					,{ key: 0, name: '사용여부', column: 'is_use_name'}
					,{ key: 0, name: '등록일', column: 'wDate'}
				]
				,content: null
			}
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

				if(item.is_use == 'y'){
					item.is_use_name = '판매가능'
				}else{
					item.is_use_name = '판매불가'
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
			if(this.member_info.admin_type == 'supply'){
				return true
			}else{
				return false
			}
		}
		,is_agency: function(){
			if(this.member_info.admin_type == 'agency'){
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
			}
		}
		,update: async function(item){

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
				await this.getData()
			}
		}
		,setItem: function (item){
			if(this.item.uid == item.uid){
				this.item = {

				}
			}else {
				this.item = item
			}
		}
		,getSupplyList: async function(){
			try{
				const result = await this.Axios({
					method: 'get'
					,url: 'management/getSupplyList'
					,data: {
						ATOKEN: this.TOKEN
					}
				})

				if(result.success){
					this.supply_list = result.data.result
					this.search_option.select[0].items = this.select_option_admin
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}
		}
		,toExcel: function(){
			this.excel_data.content = this.items
			this.is_excel = true
		}
		,toItem: function (){
			this.is_item = !this.is_item
		}
		,getSearchData: function(){
			this.$set(this.search, 'page', 1)
			this.getData()
		}
	}
	,created() {
		this.$emit('onLoad', this.program)
		if(this.member_info.admin_type == 'agency'){
			this.$emit('push', 'ProductListAgency')
		}
		this.getData()
		this.getSupplyList()
	}
	,watch: {
		'search.page': {
			handler: function(){
				this.getData()
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