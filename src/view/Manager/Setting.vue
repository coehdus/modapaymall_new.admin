<template>
	<div class="full-height">
		<div
			class="full-height"
		>
			<div
				class="justify-space-between "
			>
				<div class="flex-1 bg-white pa-10 mr-10">
					<h6 class="under-line-identify">계정정보</h6>
					<table class="table th-left td-left">
						<col width="120px">
						<col width="auto">
						<col width="120px">
						<col width="auto">
						<tbody>
							<tr>
								<th>운영 수수료 <span class="color-red">*</span></th>
								<td>
									<input
										v-model="item.admin_per"
										class="input-box full-width pa-5-10 mr-10"
										placeholder="수수료를 입력하세요"
										:rules="[rules.demical(item, 'admin_per', { min: 2, max: 2})]"

										@keyup.enter="save"
									/>
								</td>
							</tr>
							<tr
								v-for="(code, index) in agency_per"
								:key="code.total_code + index"
							>
								<th>{{ code.code_name }} 수수료</th>
								<td class="position-relative">
									<input
										class="input-box full-width"
										placeholder="수수료를 입력하세요"
										:rules="[rules.demical(agency_per, code.code_value, { min: 2, max: 2})]"

										@change="setAgencyPer"
									/>

									{{ agency_per }}
								</td>
							</tr>
							<tr>
								<th>수수료 적용여부 <span class="color-red">*</span></th>
								<td class="">
									<button
										class=" pa-5-10"
										:class="item.is_per === '1'? 'bg-identify' : 'bg-default'"
										@click="item.is_per = '1'"
									>일괄 적용</button>
									<button
										class=" pa-5-10"
										:class="item.is_per === '2'? 'bg-identify' : 'bg-default'"
										@click="item.is_per = '2'"
									>일괄 우선 적용</button>
									<button
										class=" pa-5-10"
										:class="item.is_per === '3'? 'bg-identify' : 'bg-default'"
										@click="item.is_per = '3'"
									>개별 적용</button>
								</td>
							</tr>
							<tr>
								<th>판매여부 <span class="color-red">*</span></th>
								<td class="">
									<button
										class=" pa-5-10"
										:class="item.is_sale === '1'? 'bg-identify' : 'bg-default'"
										@click="item.is_sale = '1'"
									>판매</button>
									<button
										class=" pa-5-10"
										:class="item.is_sale === '0'? 'bg-danger' : 'bg-default'"
										@click="item.is_sale = '0'"
									>미판매</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="flex-1"></div>
			</div>
		</div>

		<div
			class="justify-center"
		>
			<button
				class="bg-identify pa-10-20 mr-10"
				@click="save"
			>저장</button>
		</div>
	</div>
</template>

<script>

export default {
	name: 'ManagerItem'
	,
	components: {},
	props: ['Axios', 'user', 'codes', 'rules']
	,data: function(){
		return {
			program: {
				name: '관리 설정'
				, top: true
				, title: true
				, bottom: false
			}
			,item: {
				admin_type: 'A001001'
				, admin_level: ''
				, is_sale: '1'
				, is_per: '1'
			}
		}
	}
	,computed: {
		agency_per: function(){
			let per = []

			if(this.item.agency_per){
				per = JSON.parse(this.item.agency_per)
			}else{
				for(let code in this.codes.B003.items){
					console.log(code)
					per.push({ code: code.total_code, name: code.code_name, val: 0})
				}
			}

			return per
		}
	}
	, methods: {
		getData: async function(){
			try{
				this.$emit('onLoading')
				const result = await this.Axios({
					method: 'post'
					,url: 'management/getSetting'
				})
				if(result.success){
					this.item = result.data
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message})
				}
			}catch(e){
				console.log(e)
			}finally {
				this.$emit('offLoading')
			}
		}
		,save: async function(){
			try{
				this.$emit('onLoading')
				const result = await this.Axios({
					method: 'post'
					,url: 'management/postSetting'
					,data: this.item
				})
				if(result.success){
					this.$emit('setNotify', { type: 'success', message: result.message})
					this.getData()
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message})
				}
			}catch(e){
				console.log(e)
			}finally {
				this.$emit('offLoading')
			}
		}
		,setAgencyPer: function(){

		}
	}
	, created() {
		this.$emit('onLoad', this.program)
		this.getData()
	}
}
</script>

<style>
.width-fee { width: 60px !important; text-align: right;}
</style>