<template>
	<div
		class="full-height justify-space-between"
	>
		<div
			class="full-height full-width flex-column"
		>
			<table>
				<colgroup>
					<col width="80px" />
					<col width="150px" />
					<col width="150px" />
					<col width="150px" />
					<col width="150px" />
					<col width="150px" />
					<col width="auto" />
					<col width="auto" />
					<col width="150px" />
				</colgroup>
				<thead>
				<tr>
					<th>
						<input
							type="checkbox"
						/>
					</th>
					<th>대리점명</th>
					<th>아이디</th>
					<th>이름</th>
					<th>연락처</th>
					<th>가입일</th>
					<th>사용여부</th>
					<th>판매여부</th>
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
					<td>{{ item.wDate }}</td>
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
			:title="'대리점 정보'"
		>
			<div
				slot="item"
				class="flex-column overflow-y-auto"
			>
				<div class="pa-10">
					<div>
						<div
							v-if="item_new.uid"
							class="input-box bg-gray-light"
						>{{ item_new.admin_id }}</div>
						<input
							v-else
							v-model="item_new.admin_id"
							placeholder="대리점 아이디"
							class="input-box"
							maxlength="25"
							:rules="[rules.id(item_new, 'admin_id', { min: 5, max: 20})]"
						/>
					</div>
					<div class="mt-10">
						<input
							v-model="item_new.shop_name"
							placeholder="대리점 명"
							class="input-box"
							maxlength="25"
						/>
					</div>
					<div class="mt-10">
						<input
							v-model="item_new.admin_name"
							placeholder="대리점 이름"
							class="input-box"
							maxlength="25"
						/>
					</div>
					<div class="mt-10">
						<input
							v-model="item_new.admin_phone"
							type="number"
							placeholder="대리점 연락처"
							class="input-box"
							:rules="[rules.max(item_new, 'admin_phone', 15)]"
						/>
					</div>
					<div
						class="mt-10"
					>
						<input
							v-model="item_new.admin_password"
							type="password"
							placeholder="비밀번호"
							class="input-box"
							maxlength="25"
						/>
						<input
							v-model="item_new.admin_password_confirm"
							type="password"
							placeholder="비밀번호 확인"
							class="input-box mt-10"
							maxlength="25"
						/>
					</div>
					<div class="mt-10">
						<button
							class="btn btn-identify"
							@click="save"
						>{{ btn_name }}</button>
					</div>
				</div>
			</div>
		</SideB>
	</div>
</template>

<script>
import SideB from "../Layout/SideB";
import Pagination from "../../components/Pagination";

export default {
	name: 'ManagerAgencyList'
	,
	components: {Pagination, SideB},
	props: ['Axios', 'rules', 'ATOKEN']
	,data: function (){
		return {
			program: {
				name: '대리점 목록'
				,top: true
				,title: true
			}
			,options: {

			}
			,search: {
				ATOKEN: this.ATOKEN
			}
			,items: [

			]
			,item_new: {

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

			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/getAgencyList'
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
		,save: async function(){
			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/postSeller'
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
				this.$emit('setNotify', { type: 'error', message: '통신 오류' })
			}
		}
		,update: async function(item){

			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/postAdminUpdate'
					,data: item
				})

				if(result.success){
					this.clear_item()
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
			}
		}
		,clear_item: function(){
			this.item_new = {
				ATOKEN: this.ATOKEN
				,admin_level: 0
				,admin_type: 'agency'
			}
		}
		,confirmDelete: function(item){
			if(confirm("삭제하시겠습니까?")){
				this.deleteItem(item)
			}
		}
		,deleteItem: async  function(item){

			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/postAdminDelete'
					,data: item
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
				this.$emit('setNotify', { type: 'error', message: '통신 오류' })
			}
		}
	}
	,created() {
		this.$emit('onLoad', this.program)
		this.clear_item()
		this.getData()
	}
}
</script>