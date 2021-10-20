<template>
	<div
		slot="item"
		class="flex-column overflow-y-auto"
	>
		<div
			class="justify-space-between"
		>
			<div class="flex-1 mr-10">
				<div class="pa-10">
					<div class="position-relative">
						<select
							v-model="item.pdt_company"
							class="input-box "
							:disabled="is_supply"
						>
							<option
								:value="''"
							>공급사</option>
							<template
								v-for="supply in supply_list"
							>
							<option
								v-if="user.admin_type_code == 'admin' || user.admin_type_code == 'distributor' || user.admin_id == supply.admin_id"
								:key="supply.admin_id"
								:value="supply.admin_id"
							>{{ supply.shop_name }}</option>
							</template>
						</select>
						<v-icon
							class="position-absolute color-icon"
							style="right: 10px; top: 5px;"
						>mdi mdi-menu-down</v-icon>
					</div>

					<div class="mt-10 position-relative">
						<select
							v-model="item.pdt_category"
							class="input-box"
						>
							<option
								:value="''"
							>카테고리</option>
							<option
								v-for="category in category_list"
								:key="category.category_code"
								:value="category.category_code"
							>{{ category.category_name }}</option>
						</select>
						<v-icon
							class="position-absolute color-icon"
							style="right: 10px; top: 5px;"
						>mdi mdi-menu-down</v-icon>
					</div>

					<div
						v-if="item.uid"
					>
						<div
							class="mt-10 input-box bg-black"
						>{{ item.pdt_code }}</div>
					</div>
					<div class="mt-10">
						<input
							v-model="item.pdt_name"
							placeholder="상품명"
							class="input-box"
							maxlength="25"
						/>
					</div>
					<div class="mt-10">
						<input
							v-model="item.pdt_purchase"
							type="number"
							placeholder="공급가"
							class="input-box"
							:rules="[rules.max(item, 'pdt_purchase', 10)]"
						/>
					</div>
					<div class="mt-10">
						<input
							v-model="item.pdt_delivery"
							type="number"
							placeholder="개별 배송비"
							class="input-box"
							:rules="[rules.max(item, 'pdt_dis_delivery', 10)]"
						/>
					</div>
					<div class="mt-10">
						<input
							v-model="item.pdt_summary"
							placeholder="한줄 설명"
							class="input-box"
							maxlength="250"
						/>
					</div>

					<div class="mt-10">

						<label
							class="box pa-10 justify-space-between "
						>
							{{ main_img_name }}

							<v-icon
								class="color-icon"
							>mdi mdi-image</v-icon>
							<input
								v-show="false"
								type="file"
								placeholder="대표 이미지"
								class="input-box"
								maxlength="250"
								@change="setMainImg"
								accept="image/*"
							/>
						</label>
					</div>

					<div class="mt-10">

						<label
							class="box pa-10 justify-space-between"
						>
							{{ sub_img_name }}
							<v-icon
								class="color-icon"
							>mdi mdi-image</v-icon>
							<input
								v-show="false"
								type="file"
								placeholder="대표 이미지"
								class="input-box"
								maxlength="250"
								@change="setSubImg"
								multiple
								accept="image/*"
							/>
						</label>
					</div>
				</div>

				<div class="pa-10 ">
					<div class="pa-10 box justify-space-between">
						<div>
								상품 옵션 <v-icon
								small
								class="box color-green "
								@click="addOption"
							>mdi mdi-plus</v-icon>
						</div>

						<div class="color-red mt-10 text-left">
							옵션 내용은 콤마(,)로 구분합니다 ex) 사이즈: s,m,l,xl,xxl
						</div>
					</div>
					<div class="mt-10">
						<ul>
							<li
								v-for="(option, index) in item_options.option"
								:key="'option_' + option.uid"
								class="mb-10"
							>
								<input
									v-model="option.opt_name"
									class="box pa-10 mr-10"
									placeholder="옵션명"
								>
								<input
									v-model="option.opt_cont"
									class="box pa-10 mr-10"
									placeholder="옵션 내용"
								>
								<v-icon

									class="box pa-5 color-red "
									@click="removeOption(option, index)"
								>mdi mdi-close</v-icon>
							</li>
						</ul>
					</div>
				</div>
			</div>

			<div class="flex-1 prl-10">
				<div
				>
					<h6>상품 정보</h6>
					<editor
						v-if="!update_item"
						:options="editorOptions"
						height="300px"
						initialEditType="wysiwyg"
						ref="pdt_info"
						class="text-left mt-10"
					/>
					<editor
						v-else
						:options="editorOptions"
						height="300px"
						:initialValue="item.pdt_info"
						initialEditType="wysiwyg"
						ref="pdt_info"
						class="text-left mt-10"
					/>
				</div>

				<div
					class="mt-10"
				>

					<h6>배송/반품 정보</h6>
					<editor
						v-if="!update_item"
						:options="editorOptions"
						height="300px"
						initialEditType="wysiwyg"
						ref="pdt_notice"
						class="text-left mt-10"
					/>
					<editor
						v-else
						:options="editorOptions"
						height="300px"
						:initialValue="item.pdt_notice"
						initialEditType="wysiwyg"
						ref="pdt_notice"
						class="text-left mt-10"
					/>
				</div>
			</div>
		</div>

		<div class="mt-30 text-center">
			<button
				class="pa-10 box btn-blue mr-10"
				@click="save"
			>{{ btn_name }}</button>
			<button
				class="pa-10 box btn-gray"
				@click="$emit('goBack')"
			>목록 </button>
		</div>
	</div>
</template>

<script>

import '@toast-ui/editor/dist/toastui-editor.css';

import { Editor } from '@toast-ui/vue-editor';
export default {
	name: 'ProductItem'
	,props: ['Axios', 'user', 'rules', 'supply_list', 'category_list', 'update_item', 'codes', 'TOKEN']
	,components: {
		editor: Editor
	}
	,data: function(){
		return {
			program: {
				name: this.update_item ? '상품 정보' : '상품 등록'
				,top: true
				,title: true
				,bottom: false
			}
			,item: {
				ATOKEN: this.TOKEN
				,pdt_company: this.user.admin_type_code == 'supply' ? this.user.admin_id : ''
				,pdt_category: ''
			}
			,sub_img: [

			]
			,editorOptions: {
				hideModeSwitch: true
			}
			,item_options: {
				option: []
			}
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
		,is_supply: function(){
			if(this.user.admin_type == 'suppy'){
				return true
			}else{
				return false
			}
		}
		,main_img_name: function(){
			let name = '대표 이미지'
			if(this.item.pdt_img1){
				name = this.item.pdt_img1.name
			}
			return name
		}
		,sub_img_name: function(){
			let name = '상품 이미지'

			for(const [key, value] of Object.entries(this.sub_img)){

				name = value.name
				if(key > 0){
					name = value.name + ' 외 ' + key + '개'
				}
			}
			return name
		}
	}
	,methods: {
		setMainImg: function(e){
			let main_img = e.target.files[0]
			this.$set(this.item, 'pdt_img1', main_img)
		}
		,setSubImg: function(e){
			let sub_img = e.target.files

			this.sub_img = sub_img

			for(const [key, val] of Object.entries(sub_img)){
				this.$set(this.item, 'pdt_img' + (Number(key)+2), val)
			}
			this.$set(this.item, 'img_cnt', Object.keys(sub_img).length)
		}
		,save: async function(){

			let pdt_info = this.$refs.pdt_info.invoke("getMarkdown")
			let pdt_notice = this.$refs.pdt_notice.invoke("getMarkdown")

			if(!pdt_info){
				this.$refs.pdt_info.invoke("setMarkdown", this.item.pdt_info)
			}
			if(!pdt_notice){
				this.$refs.pdt_notice.invoke("setMarkdown", this.item.pdt_notice)
			}

			this.item.pdt_info = pdt_info
			this.item.pdt_notice = pdt_notice

			for(let [key, val] of Object.entries(this.item_options.option)){
				this.$set(this.item, 'pdt_options' + key, val.uid + ';;' + val.opt_name + ';;' + val.opt_cont)
			}

			this.$set(this.item, 'opt_cnt', Object.keys(this.item_options.option).length)

			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/postProduct'
					,data: this.item
				})

				if(result.success){
					this.$emit('setNotify', { type: 'success', message: result.message })
					this.$emit('goBack')
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}
		}
		,addOption: function(){
			this.item_options.option.push({
				uid: ''
				,opt_name: ''
				,opt_cont: ''
			})
		}
		,removeOption: async  function(option, index){
			//console.log(option)
			if(option.uid){
				if(confirm("옵션을 삭제하시겠습니까?1")){
					this.item_options.option.splice(index, 1)

					try{
						option.ATOKEN = this.TOKEN
						const result = await this.Axios({
							method: 'post'
							,url: 'management/postProductOptionDelete'
							,data: option
						})

						if(result.success){
							this.item_options.option.splice(index, 1)
						}else{
							this.$emit('setNotify', { type: 'error', message: result.message })
						}
					}catch (e) {
						console.log(e)
					}
				}
			}else{
				this.item_options.option.splice(index, 1)
			}
		}
	}
	,created() {
		this.$emit('onLoad', this.program)
	}
}
</script>

<style>

.v-file-input__text--placeholder {
	color: #bbb !important;
	font-size: 14px;
}

.theme--light.v-icon {
	color: #bbb;
}
</style>