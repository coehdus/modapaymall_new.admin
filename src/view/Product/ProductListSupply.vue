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
						<col width="auto" />
						<col width="120px" />
						<col width="120px" />
						<col width="200px" />
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
						<th>상품 배송비</th>
						<th>재고</th>
						<th>판매여부</th>
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
							[{{ item.pdt_category }}] <br/>
							{{ item.pdt_name }}
						</td>
						<td>
							<input
								v-model="item.pdt_purchase"
								type="number"
								placeholder="공급가"
								class="box pa-5"
								:rules="[rules.max(item, 'pdt_purchase', 10)]"
							/>
						</td>
						<td>
							<input
								v-model="item.pdt_delivery"
								type="number"
								placeholder="상품 배송비"
								class="box pa-5"
								:rules="[rules.max(item, 'pdt_purchase', 10)]"
							/>
						</td>
						<td
							class="full-height"
						>
							<div
								class=" flex-row justify-space-between"
							>
								<button
									class=" flex-1"
									:class="item.is_sold == 0 ? 'bg-green color-white' : 'btn-default' "
									@click="items[item.index].is_sold = 0; update(item)"
								>무한</button>
								<button
									class=" flex-1 "
									:class="item.is_sold == 1 ? 'bg-red color-white' : 'btn-default' "
									@click="items[item.index].is_sold = 1; update(item)"
								>품절</button>
								<button
									class="  flex-1"
									:class="item.is_sold == 2? 'bg-blue color-white' : 'btn-default' "
									@click="items[item.index].is_sold = 2; update(item)"
								>수량</button>
								<input
									v-model="items[item.index].pdt_stock"
									class=" flex-1 ptb-5"
									style="display: inline-block !important; border: 1px solid #ddd; width: 30px !important; text-align: center"
									@change="items[item.index].is_sold = 2; update(item)"
								/>
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
									:class="item.is_supply_sale == 1 ? 'bg-green color-white' : 'btn-default ' "
									@click="item.is_supply_sale = 1; update(item)"
								>mdi mdi-cart</v-icon>
								<v-icon
									class="pa-5  "
									:class="item.is_supply_sale != 1 ? 'bg-red color-white' : 'btn-default ' "
									@click="item.is_supply_sale = 0; update(item)"
								>mdi mdi-cart-off</v-icon>
							</div>
						</td>
						<td
							class="full-height"
						>
							<div
								class=" flex-row justify-center"
							>
								<v-icon
									v-if="item.is_use == 1"
									class="pa-5 bg-green"
								>mdi mdi-power-plug</v-icon>
								<v-icon
									v-else
									class="pa-5 bg-red"
								>mdi mdi-power-plug-off</v-icon>
							</div>
						</td>
						<td>{{ item.wDate.substring(0, 10) }}</td>
						<td
							@click="toDetail(item)"
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
						:options="options"
					></Pagination>
				</div>
			</div>

			<SideB
				v-if="item.uid"
				:title="'상품 상세 정보'"
				style="position: absolute; right: 0; top: 160px; width: 100%; height: calc(100% - 160px)"
				class="bg-base"
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

			@close="is_excel = false"
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
	props: ['Axios', 'TOKEN', 'user', 'codes', 'rules', 'date']
	,data: function (){
		return {
			program: {
				name: '상품 목록'
				,top: true
				,title: true
			}
			,search: {
				ATOKEN: this.TOKEN
				,search_type: this.$route.query.search_type ? this.$route.query.search_type : 'pdt_name'
				,search_value: this.$route.query.search_value ? this.$route.query.search_value : ''
				,list_cnt: this.$route.query.list_cnt ? this.$route.query.list_cnt : 10
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
					{ key: 0, name: '카테고리', column: 'category_name'}
					,{ key: 0, name: '상품명', column: 'pdt_name'}
					,{ key: 0, name: '공급가', column: 'pdt_purchase'}
					,{ key: 0, name: '상품 배송비', column: 'pdt_delivery'}
					,{ key: 0, name: '재고', column: 'pdt_stock_name'}
					,{ key: 0, name: '진열여부', column: 'is_use_name'}
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
	}
	,methods: {
		getData: async function(){
			this.$bus.$emit('on', true)
			try{
				const result = await this.$request.init({
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
					this.$bus.$emit('notify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$bus.$emit('on', false)
			}
		}
		,getSearch: function(){
			this.$emit('push', { name: this.$route.name, param: this.$route.params, query: this.search})
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
				await this.getSearch()
				this.$bus.$emit('on', true)
			}
		}
		,toDetail: function (item){
			this.$router.push({ name: 'ProductDetailSupply', params: { pdt_code: item.pdt_code }})
		}
		,getSupplyList: async function(){
			this.$bus.$emit('on', true)
			try{
				const result = await this.$request.init({
					method: 'get'
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
			}finally {
				this.$bus.$emit('on', false)
			}
		}
		,toExcel: function(){
			this.excel_data.content = this.item_list
			this.is_excel = true
		}
		,toItem: function (){
			this.$router.push({ name: 'ProductItem'})
			//this.is_item_view = !this.is_item_view
		}
	}
	,created() {
		this.$emit('onLoad', this.program)
		this.getData()
		this.getSupplyList()
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