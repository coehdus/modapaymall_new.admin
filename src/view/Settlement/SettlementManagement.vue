<template>
	<div class="full-height">
		<div class="full-height">
			<table>
				<thead>
					<tr>
						<th>정산일</th>
						<th>정산여부</th>
						<th>지급여부</th>
						<th>관리</th>
					</tr>
				</thead>
				<tbody>
					<template
						v-if="items.length > 0"
					>
					<tr
						v-for="item in item_list"
						:key="'settlement_' + item.uid"
					>
						<td>{{ item.date }}</td>
						<td>{{ item.date }}</td>
						<td>{{ item.date }}</td>
						<td>{{ item.date }}</td>
					</tr>
					</template>
					<tr
						v-else
					>
						<td colspan="4" class="pa-50">정산 내역이 없습니다</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
export default {
	name: 'SettlementManagement'
	,props: ['Axios', 'TOKEN']
	,data: function(){
		return {
			program: {
				name: '정산 내역'
				,top: true
				,title: true
				,bottom: false
			}
			,items: []
		}
	}
	,computed: {
		item_list: function(){
			return this.items.filter(function(item){
				return item
			})
		}
	}
	,methods: {
		getData: async function(){
			try{
				this.$emit('onLoading')

				const result = await this.Axios({
					method: 'get'
					,url: 'management/getSettlement'
					,data: {
						ATOKEN: this.TOKEN
					}
				})

				if(result.success){
					this.items = result.data
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message})
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$emit('offLoading')
			}
		}
	}
	,created() {
		this.$emit('onLoad', this.program)
		this.getData()
	}
}
</script>