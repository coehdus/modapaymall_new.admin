<template>
	<div
		class="full-height flex-column"
	>
		<Search
			:search="search"
			:option="search_option"

			@change="getData"
			@click="getData"
		>
			<select
				slot="add"
				v-model="search.pg_code"
				class="pa-5-10 mr-10"

				@change="getSearch(1)"
			>
				<option value="">PG사</option>
				<template
					v-for="(code, index) in codes.P004.items"
				>
					<option
						:key="code.total_code + '_' + index"
						:value="code.code_value"
					>{{ code.code_name }}</option>
				</template>
			</select>
		</Search>

		<div
			class="mt-10 bg-white pa-10 full-height overflow-y-auto"
		>
			<div class="full-width">
				<table class="table table-even">
					<colgroup>
						<col width="80px" />
						<col width="150px" />
						<col width="150px" />
						<col width="150px" />
						<col width="150px" />
						<col width="auto" />
						<col width="auto" />
					</colgroup>
					<thead>
					<tr>
						<th>
							<input
								type="checkbox"
							/>
						</th>
						<th>PG사</th>
						<th>PG명</th>
						<th>수수료율</th>
						<th>승인여부</th>
						<th>등록일</th>
						<th>상세정보</th>
					</tr>
					</thead>
					<tbody
						v-if="items.length > 0"
					>
					<tr
						v-for="item in items"
						:key="item.uid"
					>
						<td>
							<input
								type="checkbox"
							/>
						</td>
						<td>{{ item.pg_code }}</td>
						<td>{{ item.pg_name }}</td>
						<td>{{ item.pg_fee }}%</td>
						<td
							class="full-height"
						>
							<div
								class=" flex-row justify-center"
							>
								<v-icon
									v-if="item.pg_status == 1"
									class="pa-5 bg-green color-white"
								>mdi mdi-power-plug</v-icon>
								<v-icon
									v-else
									class="pa-5 bg-red color-white"
								>mdi mdi-power-plug-off</v-icon>
							</div>
						</td>
						<td>{{ item.wDate }}</td>
						<td>
							<button
								class="bg-identify pa-5-10"
								@click="toDetail(item)"
							>상세정보</button>
						</td>
					</tr>
					</tbody>
				</table>

				<Empty
					v-if="!items.length"
				></Empty>

				<Pagination
					:program="program"
					:align="'center'"
					:options="search"

					@click="getSearch"
				></Pagination>
			</div>
		</div>

		<Modal
			:is_modal="is_modal_item"
			title="PG사 정보"
			top="true"
			width="520px"

			@close="is_modal_item = false;"
		>
			<ManagerPgItem
				slot="modal-content"
				:user="user"
				:codes="codes"
				:uid="item_info.uid"

				@success="is_modal_item = false; getData()"
				@click="is_modal_item = false; getData()"
				@cancel="is_modal_item = false;"
			></ManagerPgItem>
		</Modal>
	</div>
</template>

<script>

import Pagination from "../../components/Pagination";
import Search from "../Layout/Search";
import Empty from "@/view/Layout/Empty";
import Modal from "@/components/Modal";
import ManagerPgItem from "@/view/Manager/ManagerPgItem";
export default {
	name: 'PgList'
	, props: ['user', 'codes']
	, components: { Search, Pagination, Empty, Modal, ManagerPgItem}
	, data: function(){
		return {
			program: {
				name: 'PG 목록'
				, top: true
				, title: true
				, bottom: false
			}
			, search: {
				pg_code: ''
				, pg_status: ''
				, pg_able: ''
				, list_cnt: 10
				, search_type: 'account_id'
				, account_type: ''
				, agency_upper: ''
			}
			,search_option:{

				is_cnt: true
				,cnt: 0
				,tCnt: 0
				,search_type: [
					{ name: '아이디', column: 'account_id'}
					,{ name: '이름', column: 'account_name'}
				]
				,select: [
					{ name: '사용 여부', column: 'pg_status', items: [
							{ name: '사용가능', column: '1'}
							,{ name: '사용불가', column: '0'}
						]
					}
				]
			}
			, items: []
			, items_upper: []
			, is_modal_item: false
			, item_delete: { }
			, item_info: { }
		}
	}
	, computed: {
		pg_list: function(){
			let t = []
			this.codes['P004'].items.filter((item) => {
				console.log(item)
			})
			return t
		}
	}
	, methods: {

		getData: async function(){
			try{
				this.$bus.$emit('on', true)
				const result = await this.$request.init({
					method: 'get'
					,url: 'management/getPgList'
					,data: this.search
				})
				if(result.success){
					this.items = result.data
					this.$storage.setQuery(this.search)
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message})
				}
			}catch(e){
				console.log(e)
			}finally {
				this.$bus.$emit('on', false)
			}
		}
		, getSearch: function(page){
			this.search.page = page
			this.getData()
		}
		, onItem: function(){
			this.item_info = { }
			this.is_modal_item = true
		}
		, onItemDelete: function(item){
			if(confirm("해당 PG사 정보를 삭제하시겠습니까?")){
				this.postDelete(item)
			}
		}

		, postUpdate: async function(item){
			try{
				this.$bus.$emit('on', true)
				const result = await this.$request.init({
					method: 'post'
					,url: 'management/postPgItemUpdate'
					,data: {
						uid: item.uid
						, pg_status: item.pg_status
					}
				})

				if(result.success){
					this.$bus.$emit('notify', { type: 'success', message: result.message })
					await this.getData()
				}else{
					throw result.message
				}
			}catch (e) {
				console.log(e)
				this.$bus.$emit('notify', { type: 'error', message: '통신 오류' })
			}finally {
				this.$bus.$emit('on', false)
				this.is_confirm = false
				this.is_confirm2 = false
			}
		}
		, postDelete: async function(item){
			try{
				this.$bus.$emit('on', true)
				const result = await this.$request.init({
					method: 'post'
					,url: 'management/postDeletePgItem'
					,data: {
						uid: item.uid
					}
				})

				if(result.success){
					this.$bus.$emit('notify', { type: 'success', message: result.message })
					await this.getData()
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
		, toDetail: function(item){
			this.is_modal_item = true
			this.item_info = item
		}
	}
	, created() {
		this.$emit('onLoad', this.program)
		this.getData()
	}
}
</script>