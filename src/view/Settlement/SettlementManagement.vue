<template>
	<div class="full-height">

		<div class="full-height">
			<div
				class="pa-10 text-right box"
			>
				<select
					v-model="item_do.year"
					class="pa-5 box mr-10"
				>
					<option
						v-for="year in year_list"
						:key="'year_' + year"
						:value="year"
					>{{ year }}년</option>
				</select>

				<select
					v-model="item_do.month"
					class="pa-5 box mr-10"
				>
					<option
						v-for="month in 12"
						:key="'month_' + month"
						:value="month"
					>{{ month }}월</option>
				</select>

				<select
					v-model="item_do.day"
					class="pa-5 box mr-10"
				>
					<option
						v-for="day in 31"
						:key="'day_' + day"
						:value="day"
					>{{ day }}일</option>
				</select>

				<button
					class="pa-5-10 btn-success"
					@click="save"
				>정산 실행</button>
			</div>


			<div class="mt-10 pa-10 bg-white">
				<table class="table table-even">
					<thead>
						<tr>
							<th>정산일</th>
							<th>정산 실행일시</th>
							<th>정산 변경일시</th>
							<th>정산여부</th>
							<th>지급여부</th>
							<th>관리</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="item in item_list"
							:key="'settlement_' + item.uid"
						>
							<td>{{ item.year }}.{{ item.month }}.{{ item.day }}</td>
							<td>{{ item.wDate }}</td>
							<td>{{ item.mDate }}</td>
							<td>{{ item.date }}</td>
							<td>{{ item.date }}</td>
							<td></td>
						</tr>
					</tbody>
				</table>
			</div>
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
			,year_start: 2021
			,item_do: {
				ATOKEN: this.TOKEN
				,year: new Date().getFullYear()
				,month:  new Date().getMonth() + 1
				,day: new Date().getDate()
			}
		}
	}
	,computed: {
		item_list: function(){
			return this.items.filter(function(item){
				return item
			})
		}
		,year_list: function(){
			let start = 2021
			let date = new Date()
			let year = date.getFullYear()
			let years = []
			for(let i = start; i <= year; i++){
				years.push(i)
			}

			return years
		}

	}
	,methods: {
		getData: async function(){
			try{
				this.$bus.$emit('on', true)

				const result = await this.$request.init({
					method: 'get'
					,url: 'management/getSettlement'
					,data: {
						ATOKEN: this.TOKEN
					}
				})

				if(result.success){
					this.items = result.data
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message})
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$bus.$emit('on', false)
			}
		}
		,save: async function(){

			try{
				this.$bus.$emit('on', true)

				const result = await this.$request.init({
					method: 'post'
					,url: 'management/postSettlement'
					,data: this.item_do
				})

				if(result.success){
					await this.getData()
					this.$bus.$emit('notify', { type: 'success', message: result.message})
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message})
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$bus.$emit('on', false)
			}
		}
	}
	,created() {
		this.$emit('onLoad', this.program)
		this.getData()
	}
}
</script>