<template>
	<div
		class="top bg-base"
	>
		<div
			class="logo bg-base pa-10 color-white text-center"
			@click="$emit('push', 'Index')"
		>Logo Position</div>
		<div class=" pa-10 ">
			<span
				class="mr-10 cursor-pointer"
				@click="setModalShop"
			>
				<v-icon
					class="color-icon"
				>mdi mdi-store</v-icon>
				상점 설정
			</span>
			<span
				v-show="member_info.admin_type == 'agency'"
				@click="copy"
				class="mr-10 bg-black pa-5-10 radius-10"
			>
				대리점 코드 발급
			</span>
			<span>
				{{ admin_div_name }}
				{{ member_info.admin_name }}
				({{ member_info.admin_id}}) 님 환영합니다
				<button
					class="btn-blue prl-10 size-px-12 vertical-middle"
					@click="confirmLogout"
				><span class="vertical-middle">로그아웃</span><v-icon class="color-eee">mdi mdi-chevron-right</v-icon></button>
			</span>

		</div>

		<Modal
			:is_modal="is_modal"
			:option="modal_option"
		>
			<div
				slot="modal-title"
				class="bg-base pa-10-20 color-ddd"
			>
				<strong class="size-px-24">{{ modal_option.title }}</strong>
				<button
					class="modal-btn-close "
					@click="is_modal = !is_modal"
				><v-icon class="color-icon">mdi-close-circle</v-icon></button>
			</div>
			<div
				slot="modal-content"
				class="bg-base"
			>
				<table class="shop-table bg-base full-width">
					<col width="150px" />
					<col width="auto" />
					<tbody>
						<tr>
							<th>상점명</th>
							<td><input
								v-model="item.shop_name"
								placeholder="상점명을 입력하세요"
								class="input-box"
							/></td>
						</tr>
						<tr>
							<th>결제 수수료</th>
							<td><input
								v-model="item.shop_per"
								placeholder="상점명을 입력하세요"
								class="input-box"
							/></td>
						</tr>
						<tr
							v-if="member_info.admin_type_code == 'agency' || member_info.admin_type_code == 'supply'"
						>
							<th>배송비 구분</th>
							<td>
								<button
									class="pa-5-10"
									:class="item.delivery_type == '무료' ? 'bg-green' : 'bg-gray'"
									@click="item.delivery_type = '무료'"
								>무료</button>
								<button
									class="pa-5-10"
									:class="item.delivery_type == '유료' ? 'bg-green' : 'bg-gray'"
									@click="item.delivery_type = '유료'"
								>유료</button>
							</td>
						</tr>
						<tr
							v-if="member_info.admin_type_code == 'agency' || member_info.admin_type_code == 'supply'"
						>
							<th>배송비</th>
							<td class="form-inline">
								<input
									v-model="item.delivery_price"
									class="box pa-10"
									type="number"
									placeholder="배송비"
									:rules="[rules.max(item, 'delivery_price', 10)]"
								/> 원 <br/>

								<input
									v-model="item.free_price"
									class="box pa-10 mt-10"
									type="number"
									placeholder="무료 금액"
									:rules="[rules.max(item, 'free_price', 10)]"
								/> 원 이상 구매시 무료
							</td>
						</tr>
						<tr
							v-if="member_info.admin_type_code == 'supply'"
						>
							<th>제주도/도서/산간<br/> 추가 배송비</th>
							<td class="form-inline justify-space-between">

								<span><input
									v-model="item.island_price"
									class="box pa-10"
									type="number"
									placeholder="도서산간 추가 배송비"
									:rules="[rules.max(item, 'island_price', 10)]"
								/> 원</span>
								<button
									class="mt-10 pa-5-10 bg-black"
								>제주도/도서/산간 지역 목록 <v-icon class="color-icon">mdi mdi-chevron-right</v-icon></button>
							</td>
						</tr>
						<tr
							v-if="member_info.admin_type_code == 'agency'"
						>
							<th>무통장 입금 계좌</th>
							<td>
								<textarea
									v-model="item.bank_info"
									name="bank_info" style="height: 80px"
									placeholder="은행명 계좌번호 예금주 입력 / 엔터로 구분"
								></textarea>
							</td>
						</tr>
						<tr
							v-if="member_info.admin_type_code == 'supply'"
						>
							<th>교환 / 반품 안내</th>
							<td>
								<editor
									:initialValue="item.shop_return"
									height="300px"
									initialEditType="wysiwyg"
									ref="shop_return"
									class="text-left"
								/>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div
				slot="modal-bottom"
				class="justify-space-between"
			>
				<button
					class="flex-1 pa-10 btn-identify"
					@click="save"
				>저장</button>
				<button
					class="flex-1 pa-10 btn-default"
					@click="is_modal = !is_modal"
				>닫기</button>
			</div>
		</Modal>
	</div>
</template>

<script>

	import '@toast-ui/editor/dist/toastui-editor.css';

	import { Editor } from '@toast-ui/vue-editor';
	import Modal from "@/components/Modal";
	export default{
		name: 'Top'
		, components: { Modal, editor: Editor }
		, props: ['member_info', 'codes', 'Base64', 'rules', 'TOKEN', 'Axios']
		,data: function(){
			return {
				modal_option: {
					top: true
					,title: '상점 설정'
					,bottom: true
				}
				, is_modal: false
				,item: {
				}
			}
		}
		,computed: {
			admin_div_name: function(){
				let name = ''
				switch(this.member_info.admin_type){
					case 'admin':
						name = '관리자'
						break;
					case 'agency':
						name = '대리점'
						break;
					case 'supply':
						name = '공급사'
						break;
				}

				return name
			}
		}
		,methods: {
			onSide: function(){
				this.$emit('toggleSide')
			}
			,toMain: function(){
				this.$emit('push', 'Login')
			}
			,confirmLogout: function() {
				if(confirm("로그아웃 하시겠습니까?")){
					sessionStorage.removeItem('delimallAT')
					document.location.href= '/ADMIN/Auth/Login'
				}
			}

			,clipBoard: function (val){
				const t = document.createElement("textarea");
				document.body.appendChild(t);
				t.value = val;
				t.select();
				document.execCommand('copy');
				document.body.removeChild(t);
			}

			,copy: function (){
				this.clipBoard(this.codes.dev_url + encodeURI(this.Base64.encode(this.member_info.admin_id)));
				alert('대리점 회원가입 바로가기 링크가 복사되었습니다.');
			}
			,setModalShop: function(){
				this.is_modal = true
			}
			,getData: async function(){
				try{
					const result = await this.Axios({
						method: 'get'
						,url: 'management/getShop'
						,data: {
							ATOKEN: this.TOKEN
						}
					})

					if(result.success){
						this.item = result.data
						this.$emit('setNotify', { type: 'success', message: result.message })
					}else{
						this.is_modal = true
						this.$emit('setNotify', { type: 'error', message: result.message })
					}
				}catch (e) {
					console.log(e)
				}
			}
			,save: async function(){
				this.item.ATOKEN = this.TOKEN

				if(this.member_info.admin_type_code == 'supply') {
					let shop_return = this.$refs.shop_return.invoke("getMarkdown")

					if (!shop_return) {
						this.$refs.shop_return.invoke("setMarkdown", this.item.shop_return)
					}
					this.item.shop_return = shop_return

				}

				try{
					const result = await this.Axios({
						method: 'post'
						,url: 'management/postShop'
						,data: this.item
					})

					if(result.success){
						this.is_modal = false
						this.$emit('setNotify', { type: 'success', message: result.message })
					}else{
						this.$emit('setNotify', { type: 'error', message: result.message })
					}
				}catch (e) {
					console.log(e)
				}
			}
		}
		,created() {
			this.getData()
		}
	}
</script>

<style>
	.top {
		border-bottom: 1px solid #ddd;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.top .logo {
		width: 180px;
	}

	.modal-container {
		width: 50% !important;
		max-width: 920px;
		margin: 0 auto;
	}

	.shop-table td { text-align: left}


	.toastui-editor-defaultUI-toolbar button {
		margin: 7px 0px;
	}
</style>