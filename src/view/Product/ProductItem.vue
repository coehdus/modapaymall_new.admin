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
					<div class="">
						<select
							v-model="item.pdt_company"
							class="input-box"
							:disabled="is_supply"
						>
							<option
								:value="''"
							>공급사</option>
							<option
								v-for="supply in supply_list"
								:key="supply.admin_id"
								:value="supply.admin_id"
							>{{ supply.shop_name }}</option>
						</select>
						<v-icon
							class="position-absolute color-icon"
							style="right: 10px; top: 10px;"
						>mdi mdi-menu-down</v-icon>
					</div>

					<div class="mt-10 ">
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
							style="right: 10px; top: 10px;"
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
	,props: ['Axios', 'member_info', 'rules', 'supply_list', 'category_list', 'update_item', 'codes', 'TOKEN']
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
				,pdt_company: ''
				,pdt_category: ''
			}
			,sub_img: [

			]
			,editorOptions: {
				hideModeSwitch: true
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
			if(this.member_info.admin_type == 'suppy'){
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

			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/postProduct'
					,data: this.item
				})

				if(result.success){
					this.$emit('setNotify', { type: 'success', message: result.message })
					this.$emit('goSuccess')
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