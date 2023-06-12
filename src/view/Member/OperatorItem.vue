<template>
	<div>
		<div class="pa-10 under-line bg-eee">
			<h6 class="">영업자 등록<button
				@click="$emit('cancel')"
				style="float: right"
				class="box"
			><v-icon>mdi-close</v-icon></button></h6>

		</div>
		<div class="pa-10">
			<div class="mt-10 position-relative">
				<select
					v-model="item.admin_code"
					class="input-box"
					:disabled="is_agency"
				>
					<option
						value=""
					>소속 대리점</option>
					<option
						v-for="(agency, index) in agency_list"
						:key="'agency_' + index"
						:value="agency.agency_id"
					>{{ agency.agency_name }}</option>
				</select>
				<v-icon
					class="position-absolute color-icon"
					style="right: 10px; top: 5px;"
				>mdi mdi-menu-down</v-icon>
			</div>
			<div class="mt-10">
				<input
					v-model="item.member_id"
					placeholder="아이디"
					class="input-box"
					maxlength="25"
				/>
			</div>
			<div class="mt-10">
				<input
					v-model="item.member_name"
					placeholder="이름"
					class="input-box"
					maxlength="25"
				/>
			</div>
			<div class="mt-10">
				<input
					v-model="item.member_tell"
					type="number"
					placeholder="연락처"
					class="input-box"
					:rules="[rules.max(item, 'member_tell', 15)]"
				/>
			</div>
			<div class="mt-10">
				<input
					v-model="item.member_email"
					type="email"
					placeholder="이메일"
					class="input-box"
				/>
			</div>
			<div
				class="mt-10 justify-space-between"
				@click="is_on_address = true"
			>
				<input
					v-model="item.member_post"
					placeholder="우편번호"
					class="input-box mr-10"
					readonly
				/>
				<button
					class="btn btn-identify"
				>주소찾기</button>
			</div>
			<div class="mt-10">
				<input
					v-model="item.member_addr1"
					placeholder="주소"
					class="input-box"
					readonly
				/>
			</div>
			<div class="mt-10">
				<input
					v-model="item.member_addr2"
					placeholder="상세주소"
					class="input-box"
				/>
			</div>
			<div class="mt-10">
				<button
					class="btn btn-identify"
					@click="save"
				>{{ btn_name }}</button>
			</div>
		</div>

		<DaumPost
			:overlay="is_on_address"
			@callBack="addPost"
		></DaumPost>
	</div>
</template>

<script>
import DaumPost from "../../components/Daum/DaumPost";
export default {
	name: 'OperatorItem'
	, components: {DaumPost}
	, props: ['Axios', 'user', 'codes', 'rules',  'is_agency', 'TOKEN']
	, data: function(){
		return {
			item: {
				admin_code: ''
			}
			, agency_list: []
			, search: {
				agency_type: 'A001003'
			}
			, is_on_address: false
		}
	}
	,computed: {
		btn_name: function (){
			if(this.item.uid){
				return '저장'
			}else{
				return '신규 등록'
			}
		}
	}
	, methods:{

		save: async function(){
			try{
				this.$bus.$emit('on', true)
				const result = await this.$request.init({
					method: 'post'
					,url: 'management/postSalesMember'
					,data: this.item
				})

				if(result.success){
					this.$emit('click')
					this.$bus.$emit('notify', { type: 'success', message: this.$language.common.success })
				}else{
					throw result.message
				}
			}catch (e) {
				console.log(e)
				this.$bus.$emit('notify', { type: 'error', message: e })
			}finally {
				this.$bus.$emit('on', false)
			}
		}
		, getAgencyList: async function(){

			try{
				const result = await this.$request.init({
					method: 'get'
					,url: 'management/getSalesAgencyList'
					,data: this.search
				})

				if(result.success){
					this.agency_list = result.data.result
					//this.search_option.select[0].items = this.select_option_agency
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}
		}
		, addPost: function (call) {

			this.$set(this.item, 'member_post', call.zonecode)
			this.$set(this.item, 'member_addr1', call.address)

			this.is_on_address = false
		}
	}
	, created() {
		this.getAgencyList()
	}
}
</script>