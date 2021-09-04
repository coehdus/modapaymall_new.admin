<template>
	<div
		slot="item"
		class="flex-column overflow-y-auto"
	>
		<div class="pa-10">
			<div class="">
				<select
					v-model="item_new.pdt_company"
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
					v-model="item_new.pdt_category"
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
				v-if="item_new.uid"
			>
				<div
					class="mt-10 input-box bg-black"
				>{{ item_new.pdt_code }}</div>
			</div>
			<div class="mt-10">
				<input
					v-model="item_new.pdt_name"
					placeholder="상품명"
					class="input-box"
					maxlength="25"
				/>
			</div>
			<div class="mt-10">
				<input
					v-model="item_new.pdt_purchase"
					type="number"
					placeholder="공급가"
					class="input-box"
					:rules="[rules.max(item_new, 'pdt_purchase', 10)]"
				/>
			</div>
			<div class="mt-10">
				<input
					v-model="item_new.pdt_dis_delivery"
					type="number"
					placeholder="개별 배송비"
					class="input-box"
					:rules="[rules.max(item_new, 'pdt_dis_delivery', 10)]"
				/>
			</div>
			<div class="mt-10">
				<input
					v-model="item_new.pdt_summary"
					placeholder="한줄 설명"
					class="input-box"
					maxlength="250"
				/>
			</div>

			<div class="mt-10">

				<label
					class="box pa-10 justify-space-between"
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
			<div
				class="mt-10"
			>
				<textarea
					v-model="item_new.pdt_info"
					placeholder="상품 정보"
				></textarea>
				<editor
					:initialValue="item_new.pdt_info"
					:options="editorOptions"
					height="500px"
					initialEditType="wysiwyg"
					previewStyle="vertical"
				/>
			</div>

			<div
				class="mt-10"
			>
				<textarea
					v-model="item_new.pdt_notice"
					placeholder="교환/반품 안내"
				></textarea>
			</div>
			<div class="mt-10">
				<button
					class="btn btn-identify"
					@click="$emit('click')"
				>{{ btn_name }}</button>
			</div>
		</div>
	</div>
</template>

<script>
import '@toast-ui/editor/dist/toastui-editor.css';

import { Editor } from '@toast-ui/vue-editor';

export default {
	name: 'ProductItem'
	,props: ['item_new', 'member_info', 'rules', 'supply_list', 'category_list']
	,components: {
		editor: Editor
	}
	,data: function(){
		return {
			main_img: null
			,sub_img: [

			]
			,editorOptions: {
				hideModeSwitch: true
			}
		}
	}
	,computed: {
		btn_name: function (){
			if(this.item_new.uid){
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
			if(this.main_img){
				name = this.main_img.name
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
			this.main_img = e.target.files[0]
			this.$emit('setMainImg', this.main_img)
		}
		,setSubImg: function(e){
			this.sub_img = e.target.files
			console.log(this.sub_img)
			this.$emit('setSubImg', this.sub_img)
		}
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