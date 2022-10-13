<template>
	<div>
		<div class="pa-10 bg-white box-shadow">
			<input
				v-model="new_item.main_code"
				placeholder="메인 코드"
				class="box pa-10 mr-10"
				maxlength="4"
			>
			<input
				v-model="new_item.sub_code"
				placeholder="서브 코드"
				class="box pa-10 mr-10"
				maxlength="4"
			>
			<input
				v-model="new_item.code_name"
				placeholder="코드명"
				class="box pa-10 mr-10"
				maxlength="25"
			>
			<input
				v-model="new_item.code_index"
				placeholder="code_index"
				class="box pa-10 mr-10"
				maxlength="50"
			>
			<input
				v-model="new_item.code_value"
				placeholder="code_value"
				class="box pa-10 mr-10"
				maxlength="50"
			>
			<input
				v-model="new_item.code_color"
				placeholder="code_color"
				class="box pa-10 mr-10"
				maxlength="50"
			>
			<button
				class="pa-10 box bg-green"
				@click="save"
			>저장</button>
		</div>

		<div
			class="mt-10 pa-10 bg-white box-shadow"
		>
			<button
				v-for="(item, key) in item_list"
				:key="item.total_code"
				class="pa-10 box radius-10 mr-10"
				:class="main_code == key ? 'bg-identify color-eee' : 'bg-default' "
				@click="main_code = key; $set(new_item, 'main_code', key)"
			> {{ item.code_name }}</button>
		</div>

		<template
			v-for="(item, key) in item_list"
			>
			<ul
				v-if="main_code == item.main_code "
				:key="item.total_code + key"
				class="mt-10 pa-10 bg-white"
			>
				<li
					v-for="sub in item.items"
					:key="item.main_code + key + sub.sub_code"
				>
					<input
						class="input-box-inline mr-10 mb-10"
						v-model="sub.main_code"
						placeholder="메인코드"
					>
					<input
						class="input-box-inline mr-10 mb-10"
						v-model="sub.sub_code"
						placeholder="서브코드"
					>
					<input
						class="input-box-inline mr-10 mb-10"
						v-model="sub.code_name"
						placeholder="코드명"
					>
					<input
						class="input-box-inline mr-10 mb-10"
						v-model="sub.code_index"
						placeholder="code_index"
					>
					<input
						class="input-box-inline mr-10 mb-10"
						v-model="sub.code_value"
						placeholder="code_value"
					>
					<input
						class="input-box-inline mr-10 mb-10"
						v-model="sub.code_color"
						placeholder="code_color"
					>
				</li>
			</ul>
		</template>
	</div>
</template>

<script>
	export default {
		name: 'SettingCodeList'
		,props: ['Axios', 'user']
		,data: function(){
			return {
				program: {
					name: '코드 관리'
					,top: true
					,title: true
					,bottom: false
				}
				,items: [

				]
				,item: {

				}
				,new_item: {

				}
				,main_code: ''
			}
		}
		,computed: {
			item_list: function(){
				let list = {}
				if(this.items.length > 0) {
					this.items.filter(function (item) {

						let main = list[item.main_code]
						if(!main){
							item.items = []
							list[item.main_code] = item
						}
						list[item.main_code].items.push(item)
					})

					console.log(list)

					return list
				}else{
					return []
				}
			}
		}
		,methods: {
			getData: async function(){
				try{
					const result = await this.Axios({
						method: 'post'
						,url: 'management/getCodeList'
						,data: this.search
					})

					if(result.success){
						this.items = result.data.result
					}else{
						this.$bus.$emit('notify', { type: 'error', mesage: result.message})
					}
				}catch (e) {
					console.log(e)
				}
			}
			,save: async function(){
				try{
					const result = await this.Axios({
						method: 'post'
						,url: 'management/postCode'
						,data: this.new_item
					})

					if(result.success){
						await this.getData()

						this.$bus.$emit('notify', { type: 'success', message: result.message})
					}else{
						this.$bus.$emit('notify', { type: 'error', message: result.message})
					}
				}catch (e) {
					console.log(e)
				}
			}

		}
		,created() {
			this.$emit('onLoad', this.program)
			this.getData()
		}
	}
</script>