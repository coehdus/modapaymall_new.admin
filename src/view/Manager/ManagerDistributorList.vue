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
			class="mt-10 full-height full-width justify-space-between overflow-y-auto"
		>
			<div class="full-width">
				<table
					v-if="items.length > 0"
				>
					<colgroup>
						<col width="80px" />
						<col width="150px" />
						<col width="150px" />
						<col width="150px" />
						<col width="150px" />
						<col width="auto" />
						<col width="auto" />
						<col width="180px" />
						<col width="150px" />
					</colgroup>
					<thead>
					<tr>
						<th>
							<input
								type="checkbox"
							/>
						</th>
						<th>총판명</th>
						<th>아이디</th>
						<th>이름</th>
						<th>연락처</th>
						<th>사용여부</th>
						<th>판매여부</th>
						<th>가입일</th>
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
						<td>{{ item.shop_name }}</td>
						<td>{{ item.seller_id }}</td>
						<td>{{ item.admin_name }}</td>
						<td>{{ item.admin_phone }}</td>
						<td
							class="full-height"
						>
							<div
								class=" flex-row justify-center"
							>
								<v-icon
									class="pa-5"
									:class="item.admin_status == 1 ? 'bg-green color-white' : 'btn-default' "
									@click="item.admin_status = 1; update(item)"
								>mdi mdi-account-check</v-icon>
								<v-icon
									class="pa-5 "
									:class="item.admin_status != 1 ? 'bg-red color-white' : 'btn-default' "
									@click="item.admin_status = 0; update(item)"
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
				<div
					v-else
					class="flex-column justify-center bg-white"
				>
					<table
						class="bg-white"
					>
						<colgroup>
							<col width="80px" />
							<col width="150px" />
							<col width="150px" />
							<col width="150px" />
							<col width="150px" />
							<col width="auto" />
							<col width="auto" />
							<col width="180px" />
							<col width="150px" />
						</colgroup>
						<thead>
						<tr>
							<th>
								<input
									type="checkbox"
								/>
							</th>
							<th>총판명</th>
							<th>아이디</th>
							<th>이름</th>
							<th>연락처</th>
							<th>사용여부</th>
							<th>판매여부</th>
							<th>가입일</th>
							<th>상세정보</th>
						</tr>
						</thead>
					</table>
					<div class="pa-50 text-center bg-base under-line">
						<v-icon
							class="size-px-48 color-gray"
						>mdi-cloud-off-outline</v-icon>
						<p class="mt-10 size-px-16 color-gray">조회된 내역이 없습니다.</p>
					</div>
				</div>

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
				:title="'총판 정보'"
				:bg-title="'bg-' + (item_new.uid ? (item_new.admin_status == 1 ? 'green' : 'red') : '')"

				@click="clear_item"
			>
				<template
					slot="item"
					class="flex-column overflow-y-auto "
				>
					<ManagerAgencyItem
						:item_new="item_new"
						:rules="rules"

						@click="save"
						class="bg-white"
					></ManagerAgencyItem>
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
import Pagination from "../../components/Pagination";
import Search from "../Layout/Search";
import ManagerAgencyItem from "./ManagerAgencyItem";
import Excel from "../../components/Excel";

export default {
	name: 'ManagerDistributorList'
	, components: {Excel, ManagerAgencyItem, Search, Pagination, SideB}
	, props: ['Axios', 'rules', 'TOKEN', 'date']
	, data: function (){
		return {
			program: {
				name: '총판 목록'
				,top: true
				,title: true
			}
			,options: {

			}
			,search: {
				ATOKEN: this.TOKEN
				,page: this.$route.query.page ? this.$route.query.page : 1
				,search_type: this.$route.query.search_type ? this.$route.query.search_type : ''
				,search_value: this.$route.query.search_value ? this.$route.query.search_value : ''
				,list_cnt: this.$route.query.list_cnt ? this.$route.query.list_cnt : 10
				,admin_status: this.$route.query.admin_status ? this.$route.query.admin_status :''
				,shop_status: this.$route.query.shop_status ? this.$route.query.shop_status :''
			}
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
					{ name: '사용 여부', column: 'admin_status', items: [
							{ name: '사용', column: '1'}
							,{ name: '미사용', column: '0'}
						]
					}
					,{ name: '판매 여부', column: 'shop_status', items: [
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
				name: '총판 목록'
				,header: [
					{ key: 0, name: '총판명', column: 'shop_name'}
					,{ key: 0, name: '아이디', column: 'admin_id'}
					,{ key: 0, name: '이름', column: 'admin_name'}
					,{ key: 0, name: '연락처', column: 'admin_tell'}
					,{ key: 0, name: '가입일', column: 'wDate'}
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
			this.$bus.$emit('on', true)
			try{
				const result = await this.$request.init({
					method: 'get'
					,url: 'management/getDistributorList'
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
		,save: async function(){
			this.$bus.$emit('on', true)
			try{
				const result = await this.$request.init({
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
				this.$bus.$emit('on', false)
			}
		}
		,update: async function(item){
			this.$bus.$emit('on', true)
			try{
				const result = await this.$request.init({
					method: 'post'
					,url: 'management/postAdminUpdate'
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
				this.$bus.$emit('on', false)
			}
		}
		,toDetail: function (item){
			this.$emit('push', { name: 'ManagerDetail', params: { type: 'distributor', idx: item.uid }})
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
			this.$bus.$emit('on', true)
			try{
				const result = await this.$request.init({
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
				this.$bus.$emit('on', false)
			}
		}
		,toExcel: function(){
			this.excel_data.content = this.items
			this.is_excel = true
		}
		,toItem: function (){
			this.$emit('push', { name: 'ManagerItem', params: { type: 'distributor'}})
		}
		,getSearch: function(){
			this.$emit('push', { name: this.$route.name, params: this.$route.params, query: this.search })
			this.getData()
		}
	}
	,created() {
		this.$emit('onLoad', this.program)
		this.clear_item()
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