<template>
	<div
		class="top bg-333"
	>
		<div
			class="logo pa-10 text-center size-px-20 font-weight-bold cursor-pointer"
			@click="$emit('push', {name: 'Index'})"
		>{{ $production_title }}</div>
		<div class=" pa-10 flex-1 justify-space-between">

			<div>
				<span
					class="mr-10 cursor-pointer vertical-middle"
				>
					<v-icon
						class="color-icon-dark vertical-middle"
					>mdi mdi-store</v-icon>
					{{ user.role_name }}

				</span>

				<button
					v-if="user.role_group == 'manager'"
					class=" pa-5-10 radius-10 cursor-pointer bg-eee color-333"
					@click="toSetting"
				>상점 설정</button>

				<button
					v-show="user.role == codes.type_code_agency"
					@click="isCopy"
					class=" pa-5-10 radius-10 cursor-pointer bg-eee color-333"
				>대리점 코드 발급</button>
			</div>

			<div class="">

				<span class="vertical-middle">
					{{ user.shop_name }}
					({{ user.account_id }}) 님 환영합니다
				</span>


				<button
					v-show="user.role == codes.type_code_agency"
					@click="postShopLogin"
					class=" pa-5-10 radius-10 cursor-pointer bg-eee color-333"
				>내 상점 바로가기</button>
				<button
					class="btn-blue pa-5-10 size-px-12 ml-10 radius-5"
					@click="confirmLogout"
				>로그아웃</button>
			</div>

		</div>

		<Modal
			:is_modal="is_modal"
			:option="modal_option"
			:top="true"
			:bottom="true"

			title="상점 설정"
			:bottom_class="'justify-center pb-10'"
			:click_class="'mr-10 bg-identify'"

			@close="is_modal = !is_modal"
			@click="save"
			@cancel="is_modal = !is_modal"
		>
			<div
				slot="modal-content"
				class="bg-base "
			>
				<table class="table table-even">
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
						<tr
							v-if="user.admin_type_code != 'supply'"
						>
							<th>결제 수수료</th>
							<td>
								<input
									v-if="user.admin_type_code == 'admin'"
									v-model="item.shop_per"
									placeholder="상점명을 입력하세요"
									class="input-box"
								/>
								<template
									v-else
								>{{ item.shop_per }}</template>
							</td>
						</tr>
						<tr
							v-if="user.admin_type_code == 'agency' || user.admin_type_code == 'supply'"
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
							v-if="user.admin_type_code == 'agency' || user.admin_type_code == 'supply'"
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
							v-if="user.admin_type_code == 'supply'"
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
							v-if="user.admin_type_code == 'admin'"
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
							v-if="user.admin_type_code == 'supply'"
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
		</Modal>
		<Modal
			:is_modal="is_modal2"
			:option="modal_option2"

			:top="true"
			:bottom="true"
			:slot_bottom="true"
			title="대리점 QR 코드"

			width="360px"
			content_class="bg-white text-center"

			@close="close"
			@click="close"
			@cancel="close"
		>

			<div slot="modal-content" class="bg-white text-center">
				<qr-code :text="shop_link"></qr-code>
			</div>
			<template
				slot="modal-bottom"
			>
				<button
					class="flex-1 bg-blue pa-10"
					@click="copy"
				>URL 복사</button>
				<button
					class="flex-1 bg-default pa-10"
					@click="close"
				>닫기</button>
			</template>
		</Modal>

		<Modal
			:is_modal="is_member"
			:option="modal_option2"

			:top="true"
			:bottom="true"
			:slot_bottom="true"
			title="내 상점 접속 정보 생성"

			width="360px"
			content_class="bg-white text-center"

			@close="close"
			@click="postShopMember"
			@cancel="close"
		>

			<div slot="modal-content" class="bg-white text-center ">
				<br/>
				내 상점에서 사용 가능한 정보를 생성합니다
				<br/>
				<br/>
			</div>
			<template
				slot="modal-bottom"
			>
				<button
					class="flex-1 bg-blue pa-10"
					@click="postShopMember"
				>확인</button>
				<button
					class="flex-1 bg-default pa-10"
					@click="close"
				>취소</button>
			</template>
		</Modal>
	</div>
</template>

<script>

	import '@toast-ui/editor/dist/toastui-editor.css';

	import { Editor } from '@toast-ui/vue-editor';
	import Modal from "@/components/Modal";

	import Vue from 'vue'
	import VueQRCodeComponent from 'vue-qrcode-component'
	Vue.component('qr-code', VueQRCodeComponent)

	import { Base64 } from 'js-base64'

	export default{
		name: 'Top'
		, components: { Modal, editor: Editor }
		, props: ['user', 'codes', 'Base64', 'rules', 'TOKEN', 'Axios']
		,data: function(){
			return {

				item: {}
				, is_modal: false
				, modal_option: {
				}
				, is_modal2: false
				, modal_option2: {

				}
				, is_member: false
			}
		}
		,computed: {
			shop_link: function(){
				let t = this.codes.live_url + encodeURI(Base64.encode(this.user.account_id))

				if(this.user.shop_link){
					t = this.user.shop_link + '/Auth/Join/' + encodeURI(Base64.encode(this.user.account_id))
				}
				return t
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
					sessionStorage.removeItem(Base64.encode(process.env.VUE_APP_NAME) + 'AT')
					sessionStorage.removeItem(Base64.encode(process.env.VUE_APP_NAME) + 'AT2')
					document.location.href= process.env.VUE_APP_PUBLIC_PATH
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

				this.clipBoard(this.shop_link);
				alert('대리점 회원가입 바로가기 링크가 복사되었습니다.');
			}
			,toSetting: function(){
				this.$emit('push', {name: 'ManagerSetting'})
			}
			,getData: async function(){
				try{
					const result = await this.$request.init({
						method: 'get'
						,url: 'management/getShop'
						,data: {
							ATOKEN: this.TOKEN
						}
					})

					if(result.success){
						this.item = result.data
						this.$bus.$emit('notify', { type: 'success', message: result.message })
					}else{
						//this.is_modal = true
						this.$bus.$emit('notify', { type: 'error', message: result.message })
					}
				}catch (e) {
					console.log(e)
				}
			}
			,save: async function(){
				this.item.ATOKEN = this.TOKEN

				if(this.user.admin_type_code == 'supply') {
					let shop_return = this.$refs.shop_return.invoke("getMarkdown")

					if (!shop_return) {
						this.$refs.shop_return.invoke("setMarkdown", this.item.shop_return)
					}
					this.item.shop_return = shop_return

				}

				try{
					const result = await this.$request.init({
						method: 'post'
						,url: 'management/postShop'
						,data: this.item
					})

					if(result.success){
						this.is_modal = false
						this.$bus.$emit('notify', { type: 'success', message: result.message })
					}else{
						this.$bus.$emit('notify', { type: 'error', message: result.message })
					}
				}catch (e) {
					console.log(e)
				}
			}
			,close: function(){
				this.is_modal = false
				this.is_modal2 = false
				this.is_member = false
			}
			,isCopy: function(){
				this.is_modal2 = true
			}
			, postShopLogin: async function(){

				try{
					this.$bus.$emit('on', true)
					const result = await this.$request.init({
						method: 'post'
						,url: 'management/postShopLogin'
						,data: {

						}
					})

					if(result.success){
						this.onShop()
					}else{
						this.$bus.$emit('notify', { type: 'error', message: result.message })
						if(result.data){
							if(result.data.type == 'member'){
								this.is_member = true
							}
						}
					}
				}catch (e) {
					console.log(e)
				}finally {
					this.$bus.$emit('on', false)
				}
			}
			, onShop: function(){
				window.open('/Auth/Login/Shop/' + this.user.account_id, 'shop')
			}
			, postShopMember: async function(){
				try{
					this.$bus.$emit('on', true)
					const result = await this.$request.init({
						method: 'post'
						,url: 'management/postShopMember'
						,data: {

						}
					})

					if(result.success){
						this.onShop()
					}else{
						this.$bus.$emit('notify', { type: 'error', message: result.message })
					}
				}catch (e) {
					console.log(e)
				}finally {
					this.is_member = false
					this.$bus.$emit('on', false)
				}
			}
		}

		,created() {
			// this.getData()
		}
	}
</script>

<style>
	.top {
		border-bottom: 1px solid #ddd;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		color: #bbb;
		padding: 5px 0;
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