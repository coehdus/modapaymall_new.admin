<template>
	<div
		class="full-height justify-space-between"
	>
		<div
			class="full-height full-width"
		>
			<div class=" ptb-10 text-right bg-white">

				<select
					class="pa-5 mr-10"
					v-model="search.search_type"
				>
					<option
						:value="''"
					>검색조건</option>
					<option
						:value="'pdt_name'"
					>상품명</option>
				</select>

				<input
					v-model="search.search_value"
					class="pa-5 box vertical-middle mr-10 "
					placeholder="검색어를 입력하세요"
				/>

				<button
					class="btn-blue pa-5 prl-10 vertical-middle mr-10"
					@click="getData"
				>검색</button>

			</div>
			<table class="mt-10 bg-white">
				<colgroup>
					<col width="40px" />
					<col width="120px" />
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
					<th>상품 배송비</th>
					<th>재고</th>
					<th>판매여부</th>
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
							>mdi mdi-image</v-icon>
						</div>
					</td>
					<td
						class="text-left"
					>
						<input
							v-model="item.pdt_name"
							type="text"
							placeholder="상품명"
							class="box pa-5"
							maxlength="50"
						/>
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
					</td>
					<td>{{ item.wDate.substring(0, 10) }}</td>
					<td
						@click="setItem(item)"
					>
						<v-icon
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
		>
			<div
				slot="item"
			>

			</div>
		</SideB>
	</div>
</template>

<script>
import SideB from "../Layout/SideB";
import Pagination from "@/components/Pagination";
export default {
	name: 'ManagerAdminList'
	,
	components: {Pagination, SideB},
	props: ['Axios', 'TOKEN', 'member_info', 'codes', 'rules']
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
			}
			,items: [

			]
			,item: {

			}
			,options: {

			}
			,supply_list: []
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
	}
	,methods: {
		getData: async function(){

			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/getProductList'
					,data: this.search
				})

				if(result.success){
					this.items = result.data.result
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
					method: 'post'
					,url: 'management/getSupplyList'
					,data: {
						ATOKEN: this.TOKEN
					}
				})

				if(result.success){
					this.supply_list = result.data.result
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}
		}
	}
	,created() {
		this.$emit('onLoad', this.program)
		if(this.member_info.admin_type == 'agency'){
			this.$emit('push', 'ProductListAgency')
		}else if(this.member_info.admin_type == 'supply'){
			this.$emit('push', 'ProductListSupply')
		}
		this.getData()
		this.getSupplyList()
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