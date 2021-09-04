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
						<col width="150px" />
						<col width="150px" />
						<col width="200px" />
						<col width="150px" />
						<col width="150px" />
						<col width="150px" />
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
							<th>공급 배송비</th>
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
								class="pdt-img"
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
							>[{{ item.shop_name}}] <br/> {{ item.pdt_name }}</td>
							<td>{{ item.pdt_price | makeComma }}</td>
							<td>{{ item.shop_delivery_price | makeComma }}</td>
							<td
								class="full-height"
							>
								<div
									v-if="is_supply"
									class=" flex-row justify-space-between"
								>
									<button
										class=" flex-1"
										:class="item.is_sold == 1 ? 'bg-green color-white' : 'btn-default' "
										@click="items[item.index].is_sold = 1; update(item)"
									>무한</button>
									<button
										class=" flex-1 "
										:class="item.is_sold == 2 ? 'bg-red color-white' : 'btn-default' "
										@click="items[item.index].is_sold = 2; update(item)"
									>품절</button>
									<button
										class="  flex-1"
										:class="item.is_sold == 3? 'bg-blue color-white' : 'btn-default' "
										@click="items[item.index].is_sold = 3; update(item)"
									>재고</button>
									<input
										v-model="items[item.index].pdt_stock"
										class=" flex-1 ptb-5"
										style="display: inline-block !important; border: 1px solid #ddd; width: 30px !important; text-align: center"
										@change="items[item.index].is_sold = 3; update(item)"
									/>
								</div>
								<div
									v-else
								>
									{{ item.is_sold_name }}
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
										:class="item.is_use == 1 ? 'bg-green color-white' : 'btn-default' "
										@click="item.is_use = 1; update(item)"
									>mdi mdi-cart</v-icon>
									<v-icon
										class="pa-5  "
										:class="item.is_use != 1 ? 'bg-red color-white' : 'btn-default' "
										@click="item.is_use = 0; update(item)"
									>mdi mdi-cart-off</v-icon>
								</div>
								<div
									v-else
								>
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
								</div>
							</td>
							<td>{{ item.wDate.substring(0, 10) }}</td>
							<td
							>
								<v-icon
									v-if="item.uid == item_new.uid"
									class="color-red"
									@click="setItem(item)"
								>mdi mdi-close-box-outline</v-icon>
								<v-icon
									v-else
									@click="setItem(item)"
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
			<SideB
				v-if="is_item"
				:title="'상품 정보'"
				:bg-title="'bg-' + (item_new.uid ? (item_new.is_use == 1 ? 'green' : 'red') : '')"
				@click="clear_item"
				class="position-absolute full-width bg-base full-height"
				style="left: 0; top: 0; z-index: 999"
			>
				<template
					slot="item"
					class="flex-column overflow-y-auto "
				>
					<ProductItem
						:item_new="item_new"
						:rules="rules"
						:member_info="member_info"
						:supply_list="supply_list"
						:category_list="category_list"

						@click="save"
						@setMainImg="setMainImg"
						@setSubImg="setSubImg"
					></ProductItem>
				</template>
			</SideB>
		</div>

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
import ProductItem from "./ProductItem";
export default {
	name: 'ManagerAdminList'
	,
	components: {ProductItem, Excel, Search, Pagination, SideB},
	props: ['Axios', 'TOKEN', 'member_info', 'codes', 'date', 'rules']
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
				,is_use: ''
				,list_cnt: 10
			}
			,search_option:{
				is_excel: true
				,is_item: true
				,is_cnt: true
				,cnt: 0
				,tCnt: 0
				,search_type: [
					{ name: '상품명', column: 'pdt_name'}
				]
				,select: [
					{ name: '공급사', column: 'pdt_company', items: []}
					, { name: '사용 여부', column: 'is_use', items: [
							{ name: '사용', column: '1'}
							,{ name: '미사용', column: '0'}
						]
					}
				]
			}
			,items: [

			]
			,item: {

			}
			,item_new: {

			}
			,options: {

			}
			,supply_list: []
			,is_excel: false
			,excel_data: {
				name: '상품 목록'
				,header: [
					{ key: 0, name: '공급사', column: 'shop_name'}
					,{ key: 0, name: '상품명', column: 'pdt_name'}
					,{ key: 0, name: '공급가', column: 'pdt_purchase'}
					,{ key: 0, name: '공급 배송비', column: 'pdt_delivery'}
					,{ key: 0, name: '재고', column: 'pdt_stock'}
					,{ key: 0, name: '판매여부', column: 'agency_use_name'}
					,{ key: 0, name: '사용여부', column: 'is_use_name'}
					,{ key: 0, name: '등록일', column: 'wDate'}
				]
				,content: null
			}
			,is_item : true
			,category_list: [

			]
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
			if(this.item_new.uid == item.uid){
				this.clear_item()
			}else {
				this.item_new = item
				this.is_item = true
			}
		}
		,clear_item: function(){
			this.item_new = {
				ATOKEN: this.TOKEN
				,pdt_company: ''
				,pdt_category: ''
			}
			this.is_item = false
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
					this.search_option.select[0].items = this.select_option_admin
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
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
		,save: async function(){
			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/postProduct'
					,data: this.item_new
				})

				if(result.success){
					await this.getData()
					this.clear_item()
					this.$emit('setNotify', { type: 'success', message: result.message })
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}
		}
		,setMainImg: function(file){

			this.item_new.pdt_img1 = file
		}
		,setSubImg: function(files){

			for(const [key, val] of Object.entries(files)){
				this.$set(this.item_new, 'pdt_img' + (Number(key)+2), val)
			}

			this.$set(this.item_new, 'img_cnt', Object.keys(files).length)
		}
	}
	,created() {
		this.$emit('onLoad', this.program)
		if(this.member_info.admin_type == 'agency'){
			this.$emit('push', 'ProductListAgency')
		}else if(this.member_info.admin_type == 'supply'){
			this.$emit('push', 'ProductListSupply')
		}
		this.clear_item()
		this.getData()
		this.getSupplyList()
		this.getCategoryList()
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