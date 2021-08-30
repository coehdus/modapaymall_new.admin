<template>
	<div
		class="full-height justify-space-between"
	>
		<div
			class="full-height full-width"
		>
			<table>
				<colgroup>
					<col width="80px" />
					<col width="150px" />
					<col width="auto" />
					<col width="150px" />
					<col width="150px" />
					<col width="150px" />
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
							class="pdt-img"
						>
							<img
								v-if="item.img"
								:src="item.img"
							/>
							<v-icon
								v-else
							>mdi mdi-image</v-icon>
						</td>
						<td
							class="text-left"
						>{{ item.pdt_name }}</td>
						<td>{{ item.pdt_price | makeComma }}</td>
						<td>{{ item.pdt_delivery | makeComma }}</td>
						<td>{{ item.pdt_stock | makeComma }}</td>
						<td>{{ item.is_use_name }}</td>
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
	props: ['Axios', 'TOKEN']
	,data: function (){
		return {
			program: {
				name: '상품 목록'
				,top: true
				,title: true
			}
			,search: {
				ATOKEN: this.TOKEN
			}
			,items: [

			]
			,item: {

			}
			,options: {

			}
		}
	}
	,computed: {
		item_list: function (){
			const self = this
			return this.items.filter(function(item){
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
				return item
			})
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
		,setItem: function (item){
			if(this.item.uid == item.uid){
				this.item = {

				}
			}else {
				this.item = item
			}
		}
	}
	,created() {
		this.$emit('onLoad', this.program)
		this.getData()
	}
}
</script>

<style>
</style>