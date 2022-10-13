<template>
	<div
		class="full-height flex-column pa-10"
	>
		<div
			class="justify-space-between  "
			v-if="items.length > 0"
		>
			<div
				v-for="(item, key) in item_list"
				:key="'title_' + key"
				class=" flex-1 mr-10 bg-white pa-10 flex-column"
			>
				<h6 class="mt-10 justify-space-between">
					<span>{{ key.slice(-1) }} 차 카테고리</span>
					<v-icon
						class="color-blue"
						@click="addCategory(key)"
					>mdi mdi-pencil-box-outline</v-icon>
				</h6>
				<ul
					class="mt-10  box full-height"
				>
					<template
						v-for="(sub, sub_index) in item"
					>
					<li
						v-if="is_view(sub)"
						:key="sub.category_code"
						class="pa-10 justify-space-between mb-10"
						:class="{ 'bg-eee': isSelect(sub) }"
					>
						<input
							v-model="items[sub.index].category_name"
							class="input-box flex-3 mr-10"
							placeholder="카테고리명을 입력하세요"
						/>
						<span
							class="flex-1 justify-end"
						>
							<v-icon
								class="flex-1 color-red "
								@click="isDelete(sub)"
							>mdi mdi-delete-outline</v-icon>
							<span
								class="flex-1 flex-column justify-center"
							>
								<v-icon
									:class="sub_index ? 'color-icon' : ''"
								>mdi mdi-arrow-up-bold-box-outline</v-icon>
							</span>
							<span
								class="flex-1 flex-column justify-center"
							>
								<v-icon
									:class="sub_index == Object.keys(item).length - 1 ? '' : 'color-icon'"
								>mdi mdi-arrow-down-bold-box-outline</v-icon>
							</span>
							<v-icon
								@click="setSub(items[sub.index])"
								class="flex-1 color-icon"
							>mdi mdi-arrow-right-bold-box-outline</v-icon>
						</span>
					</li>
					</template>
					<template

						v-if="key.slice(-1) > 1"
						>
					<li
						v-if="(key.slice(-1) == 2 && !category1) || (key.slice(-1) == 3 && !category2) || (key.slice(-1) == 4 && !category3)"
						class="pa-10"
					>
						상위 카테고리를 선택하세요
					</li>
					</template>
				</ul>

			</div>
		</div>

		<div
			class="mt-auto justify-center"
		>
			<button
				class="bg-blue pa-10-20"
				@click="save"
			>저장</button>
		</div>

		<Modal
			:is_modal="is_modal"
			:option="modal_option"

			@close="close"
		>
			<template
				slot="modal-bottom"
			>
				<button
					class="btn bg-red"
					@click="deleteItem"
				>삭제</button>
				<button
					class="btn bg-gray-light color-333"
					@click="close"
				>취소</button>
			</template>
		</Modal>
	</div>
</template>

<script>
	import Modal from "@/components/Modal";
	export default {
		name: 'ProductCategory'
		,
		components: {Modal},
		props: ['Axios', 'user', 'TOKEN']
		,data: function(){
			return {
				program: {
					name: '상품 카테고리'
					,top: true
					,title: true
					,search: false
					,bottom: false
				}
				,search: {
					ATOKEN: this.TOKEN
				}
				,items: [

				]
				,item_new: [

				]
				,item_now: {

				}
				,category1: null
				,category2: null
				,category3: null
				,item_delete: null
				,is_modal: false
				,modal_option: {
					top: true
					,title: '카테고리 삭제'
					,content: '해당 카테고리를 삭제하시겠습니까?'
					,bottom: true
					,width: '360px'
					,slot_bottom: true
				}
			}
		}
		,computed: {
			item_list: function(){
				let list = {
					depth1: []
					,depth2: []
					,depth3: []
					,depth4: []
				}
				let index = 0
				this.items.filter(function(item){

					item.index = index
					list['depth' + item.depth].push(item)

					index++
					return item
				})

				return list
			}
			,new_list: function(){
				let list = {
					depth1: []
					,depth2: []
					,depth3: []
					,depth4: []
				}
				let index = 0
				this.item_new.filter(function(item){

					item.index = index
					list['depth' + item.depth].push(item)
					index++
					return item
				})

				return list
			}
			,item_save: function(){
				let list = []
				this.items.filter(function(item){

					list.push(JSON.stringify(item))
				})

				return list
			}
		}
		,methods: {
			getData: async function(){
				try{
					const result = await this.Axios({
						method: 'post'
						,url: 'management/getCategoryList'
						,data: this.search
					})

					if(result.success){
						this.items = result.data.result
					}else{
						this.$bus.$emit('notify', { type: 'error', message: result.message })
					}
				}catch (e) {
					console.log(e)
				}
			}
			,save: async function(){
				this.$emit('onLoading')
				try{
					const result = await this.Axios({
						method: 'post'
						,url: 'management/postCategory'
						,data: {
							ATOKEN: this.TOKEN
							,category: JSON.stringify(this.items)
						}
					})

					if(result.success){
						await this.getData()
						this.$bus.$emit('notify', { type: 'success', message: result.message })
					}else{
						this.$bus.$emit('notify', { type: 'error', message: result.message })
					}
				}catch (e) {
					console.log(e)
				}finally {
					this.$emit('offLoading')
				}
			}

			,deleteItem: async function(){
				this.$emit('onLoading')
				try{
					const result = await this.Axios({
						method: 'post'
						,url: 'management/postCategoryDelete'
						,data: {
							ATOKEN: this.TOKEN
							,category_code: this.item_delete.category_code
						}
					})

					if(result.success){
						this.close()
						await this.getData()
						this.$bus.$emit('notify', { type: 'success', message: result.message })
					}else{
						this.$bus.$emit('notify', { type: 'error', message: result.message })
					}
				}catch (e) {
					console.log(e)
				}finally {
					this.$emit('offLoading')
				}
			}
			,addCategory: function(key){

				let item = this.item_new[key]
				let depth = key.slice(-1)

				if(depth > 1 && !this['category' + (Number(depth) - 1)]){
					this.$bus.$emit('notify', { type: 'error', message: '상위 카테고리를 선택하세요'})
					return false
				}

				let sort =this.items.length
				if(depth > 1) {
					sort = this['category' + (Number(depth) - 1)].sort + '-' + this.items.length
				}

				if(!item){
					item = {
						category_code1: this.category1 ? this.category1.category_code : ''
						,category_code2: this.category2 ? this.category2.category_code : ''
						,category_code3: this.category3 ? this.category3.category_code : ''
						,category_code4: ''
						,category_name: ''
						,sort: sort
						,depth: depth
					}
				}

				this.items.push(item)
			}
			,setSub: function(item){
				if(!item.category_code){
					return false
				}
				this.item_now = item
				this['category' + item.depth] = item
			}
			,isSelect: function(item){
				if(!item.category_code){
					return false
				}
				let item_now = this.item_now
				let is_view = false

				if(item_now) {
					switch (item.depth){
						default:
							is_view = false
							break;
						case '1':
							if(item_now.category_code1 == item.category_code1){
								is_view = true
							}
							break;
						case '2':
							if(item_now.category_code2 == item.category_code2){
								is_view = true
							}
							break;
						case '3':
							if(item_now.category_code3 == item.category_code3){
								is_view = true
							}
							break;
					}
				}
				return is_view
			}
			,is_view: function(item){

				let item_now = this.item_now
				let is_view = false

				if(item_now) {
					switch (item.depth){
						default:
							is_view = false
							break;
						case '1':
							is_view = true
							break;
						case '2':
							if(item_now.category_code1 == item.category_code1){
								is_view = true
							}
							break;
						case '3':
							if(item_now.category_code2 == item.category_code2){
								is_view = true
							}
							break;
						case '4':
							if(item_now.category_code3 == item.category_code3){
								is_view = true
							}
							break;
					}
				}
				return is_view
			}
			,isDelete: function(item){
				this.item_delete = item
				this.is_modal = true
			}
			,close: function(){
				this.item_delete = null
				this.is_modal = false
			}
		}
		,created() {
			this.$emit('onLoad', this.program)
			this.getData()
		}
	}
</script>

<style>
 .on { background-color: black}
</style>