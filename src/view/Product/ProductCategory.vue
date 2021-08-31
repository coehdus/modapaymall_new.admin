<template>
	<div
		class="full-height flex-column"
	>
		<div
			class="justify-space-between"
			v-if="Object.keys(item_list).length > 0"
		>
			<div
				v-for="(item, key) in item_list"
				:key="'title_' + key"
				class="full-height flex-1 mr-20 flex-column"
			>
				<h6 class="mt-10 justify-space-between">
					<span>{{ key.slice(-1) }} 차 카테고리</span>
					<v-icon
						class="color-blue"
						@click="addCategory(key)"
					>mdi mdi-pencil-box-outline</v-icon>
				</h6>
				<ul
					class="mt-10 pa-10 box-shadow full-height"
				>
					<template
						v-for="(sub, sub_index) in item"
					>
					<li
						v-if="is_view(sub)"
						:key="sub.category_code"
						class="justify-space-between mb-10"
					>
						<input
							v-model="items[sub.index].category_name"
							class="input-box flex-3 mr-10"
						/>

						<span
							class="flex-1 justify-end"
						>
							<span
								v-if="sub_index"
								class="flex-1 flex-column justify-center"
							>
								<v-icon
								>mdi mdi-arrow-up-bold-box-outline</v-icon>
							</span>
							<span
								v-if="sub_index < Object.keys(item).length - 1"
								class="flex-1 flex-column justify-center"
							>
								<v-icon
								>mdi mdi-arrow-down-bold-box-outline</v-icon>
							</span>
							<v-icon
								class="flex-1 color-red "
							>mdi mdi-delete-outline</v-icon>
							<v-icon
								@click="setSub(items[sub.index])"
								class="flex-1"
								:class="isSelect(sub)"
							>mdi mdi-arrow-right-bold-box-outline</v-icon>
						</span>
					</li>
					</template>
					<li
						v-for="(new_category, index) in new_list['depth' + key.slice(-1)]"
						:key="'new_category' + key.slice(-1) + index"
						class="justify-space-between"
					>
						<input
							v-model="item_new[new_category[index]]"
							placeholder="신규 카테고리"
							class="input-box flex-3 mb-10 mr-10"
						/>

						<span
							class="flex-1 justify-space-between"
						>

							<span
								class="flex-1 flex-column justify-center"
							>
								<v-icon
								>mdi mdi-arrow-up-bold-box-outline</v-icon>
							</span>
							<span
								class="flex-1 flex-column justify-center"
							>
								<v-icon
								>mdi mdi-arrow-down-bold-box-outline</v-icon>
							</span>
							<v-icon
								class="flex-1 color-red"
							>mdi mdi-delete-outline</v-icon>
						</span>
					</li>
				</ul>

			</div>
		</div>

		<div
			class="mt-10"
		>
			<button
				class="btn-identify"
			>저장</button>
		</div>
		<div>
			{{ item_list }}
		</div>
		<div>
		{{ item_new }}
		</div>
		<div>
		{{ new_list }}
		</div>
		<div>
			{{ item_now }}
		</div>
	</div>
</template>

<script>
	export default {
		name: 'ProductCategory'
		,props: ['Axios', 'member_info', 'TOKEN']
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

				console.log(list)

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

				console.log(list)

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
						this.$emit('setNotify', { type: 'error', message: result.message })
					}
				}catch (e) {
					console.log(e)
				}
			}
			,addCategory: function(key){

				let item = this.item_new[key]
				if(!item){
					item = {
						category_code1: ''
						,category_code2: ''
						,category_code3: ''
						,category_code4: ''
						,category_name: ''
						,depth: key.slice(-1)
					}
				}

				this.item_new.push(item)
			}
			,setSub: function(item){
				this.item_now = item
			}
			,isSelect: function(item){
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
		}
		,created() {
			this.$emit('onLoad', this.program)
			this.getData()
		}
	}
</script>