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
					<col width="auto" />
					<col width="120px" />
					<col width="120px" />
					<col width="120px" />
				</colgroup>
				<thead>
					<tr>
						<th>
							<input
								type="checkbox"
							/>
						</th>
						<th>소속 대리점</th>
						<th>아이디</th>
						<th>이름</th>
						<th>연락처</th>
						<th>가입일</th>
						<th>사용여부</th>
						<th>상세정보</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="item in item_list"
						:key="item.uid"
						:bg-title="'bg-' + (item_new.uid ? (item_new.admin_status == 1 ? 'green' : 'red') : '')"
					>
						<td>
							<input
								type="checkbox"
							/>
						</td>
						<td>{{ item.admin_name }}</td>
						<td>{{ item.member_id }}</td>
						<td>{{ item.member_name }}</td>
						<td>{{ item.member_tell }}</td>
						<td>{{ item.join_date }}</td>
						<td
							class="full-height"
						>
							<div
								class=" flex-row justify-space-between"
							>
								<v-icon
									class="pa-5 flex-1"
									:class="item.m_status == 1 ? 'bg-green color-white' : 'btn-default' "
									@click="item.m_status = 1"
								>mdi mdi-account-check</v-icon>
								<v-icon
									class="pa-5  flex-1"
									:class="item.m_status != 1 ? 'bg-red color-white' : 'btn-default' "
									@click="item.m_status = 0"
								>mdi mdi-account-off</v-icon>
							</div>
						</td>
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
			:title="'회원 정보'"
		>
			<div
				slot="item"
			>
				<div class="pa-10">
					<div>
						<div
							v-if="item_new.member_id"
							class="input-box bg-gray-light"
						>{{ item_new.member_id }}</div>
						<input
							v-else
							v-model="item_new.member_id"
							placeholder="공급사 아이디"
							class="input-box"
							maxlength="25"
						/>
					</div>
					<div class="mt-10">
						<input
							v-model="item_new.shop_name"
							placeholder="공급사 명"
							class="input-box"
							maxlength="25"
						/>
					</div>
					<div class="mt-10">
						<input
							v-model="item_new.admin_name"
							placeholder="공급사 이름"
							class="input-box"
							maxlength="25"
						/>
					</div>
					<div class="mt-10">
						<input
							v-model="item_new.admin_phone"
							type="number"
							placeholder="공급사 연락처"
							class="input-box"
							:rules="[rules.max(item_new, 'admin_phone', 15)]"
						/>
					</div>
					<div
						v-if="item_new.admin_id"
						class="mt-10"
					>
						<button
							class="btn btn-identify"
						>비밀번호 변경</button>
					</div>
					<div
						v-else
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
						>저장</button>
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
		name: 'MemberList'
		,
		components: {Pagination, SideB},
		props: ['Axios', 'rules']
		,data: function (){
			return {
				program: {
					name: '회원 목록'
					,top: true
					,title: true
				}
				,search: {
					ATOKEN: this.TOKEN
				}
				,items: [

				]
				,item_new: {
					ATOKEN: this.TOKEN
				}
				,options: {

				}
			}
		}
		,computed: {
			item_list: function (){
				return this.items.filter(function(item){

					return item
				})
			}
		}
		,methods: {
			getData: async function(){

				try{
					const result = await this.Axios({
						method: 'post'
						,url: 'management/getMemberList'
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
				if(this.item_new.uid == item.uid){
					this.item_new = {
						ATOKEN: this.TOKEN
					}
				}else {
					this.item_new = item
				}
			}
		}
		,created() {
			this.$emit('onLoad', this.program)
			this.getData()
		}
	}
</script>