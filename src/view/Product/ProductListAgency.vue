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

			<button
				slot="last"
				class="btn-green pa-5-10 vertical-middle mr-10"
				@click="getSort"
			>상품 정렬</button>

		</Search>

		<div
			class="mt-10 pa-10 bg-white full-height  overflow-y-auto position-relative"
		>
			<div
				v-if="items.length > 0"

				class="full-height flex-column"
			>
				<table class="table table-even ">
					<colgroup>
						<col width="120px" />
						<col width="auto" />
						<col width="120px" />
						<col width="120px" />

						<col width="120px" />
						<col width="120px" />
						<col width="120px" />
						<col width="80px" />
					</colgroup>
					<thead>
					<tr>
						<th colspan="2">상품명</th>
						<th>판매가</th>
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
						<td>{{ item.pdt_price | makeComma }} 원</td>
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
									@click="item.agency_use = 1; postUpdate(item)"
								>mdi mdi-power-plug</v-icon>
								<v-icon
									class="pa-5  "
									:class="item.agency_use != 1 ? 'bg-red color-white' : 'btn-default' "
									@click="item.agency_use = 0; postUpdate(item)"
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
						:options="search"

						@click="getSearch"
					></Pagination>
				</div>
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
	name: 'ManagerAdminList'
	, components: {Modal, Empty, Excel, Search, Pagination, draggable}
	, props: ['Axios', 'TOKEN', 'user', 'codes', 'rules', 'date', 'category_list', 'supply_list']
	, data: function (){
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
			const self = this
			let index = 0
			return this.items.filter(function(item){
				item.ATOKEN = self.TOKEN
				if(item.pdt_img1){
					item.img = item.pdt_img1
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
				console.log('item.agency_pdt_type', item.agency_pdt_type)

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
			this.$emit('onLoading')
			try{
				const result = await this.Axios({
					method: 'get'
					,url: 'management/getProductListAgency'
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
				this.$emit('offLoading')
			}
		}
		, postUpdate: async function(item){
			this.$emit('onLoading')
			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/postProductUpdateAgency'
					,data: {
						ATOKEN: this.TOKEN
						,uid: item.uid
						,pdt_code: item.pdt_code
						,agency_use: item.agency_use
						,pdt_type: item.pdt_type
					}
				})

				if(result.success) {
					await this.getData()
				}else{
					throw result.message
				}
			}catch (e) {
				console.log(e)
				this.$bus.$emit('notify', { type: 'error', message: '통신 오류' })
			}finally {
				//await this.getData()
				this.$emit('offLoading')
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
		,getSearch: function(page){
			if(page){
				this.search.page = page
			}

			this.getData()
		}
		,setPdtType: function(item, type){

			let t = item.agency_pdt_type.split(',')
			let pdt_type = []
			for(let i = 0; i < t.length; i++){
				let tt = t[i].replaceAll(' ', '')
				if(!tt){
					continue
				}
				if(tt != type){
					pdt_type.push(tt)
				}
			}
			item.pdt_type = pdt_type
			this.postUpdate(item)
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
			this.$bus.$emit('notify', { type: type, message: message })
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
		, postSortUpdate: async function(){
			try{
				this.$emit('onLoading')
				const result = await this.Axios({
					method: 'post'
					,url: 'management/postProductSortAgency'
					,data: {
						ATOKEN: this.TOKEN
						, items: this.items_sort_do
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
				this.$emit('offLoading')
			}
		}
		, getSort: async function(){

			try{
				this.$emit('onLoading')
				const result = await this.Axios({
					method: 'get'
					,url: 'management/getProductSortAgency'
					,data: {
						ATOKEN: this.TOKEN
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
				this.$bus.$emit('notify', { type: 'error', message: '통신 오류' })
			}finally {
				//await this.getData()
				this.$emit('offLoading')
			}
		}

	}
	,created() {
		this.$emit('onLoad', this.program)
		this.getData()
	}
	,watch: {
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