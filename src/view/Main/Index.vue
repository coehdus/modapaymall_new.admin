<template>
	<div class="flex-column full-height bg-base overflow-y-auto">
		<div>
			<div class="justify-space-between">
				<GChart
					type="LineChart"
					:data="chart_data_weekly_cnt"
					:options="chartOptions3"
					class="flex-1 mr-10 box"
				/>
				<GChart
					type="ColumnChart"
					:data="chart_data_weekly"
					:options="chartOptions"
					class="flex-1 mr-10 box"
				/>
				<GChart
					type="BarChart"
					:data="chart_data_monthly"
					:options="chartOptions2 "
					class="flex-1 box"
				/>
			</div>
		</div>
		<div
			class="full-height mt-10 justify-space-between "
		>
			<div class="full-height flex-1 flex-column overflow-y-auto mr-10 ">
				<h6 class="">이번달 정산</h6>
				<ul class="pa-10 full-height box overflow-y-auto">
					<li
						class="ptb-10 justify-space-between"
					>
						<span>총 판매건수</span>
						<span>{{ settlement_data.total_cnt }} 건</span>
					</li>
					<li
						class="ptb-10 justify-space-between"
					>
						<span>총 판매금액</span>
						<span>{{ Math.floor(settlement_data.total_sale_price) | makeComma}} 원</span>
					</li>
					<li
						class="ptb-10 justify-space-between"
					>
						<span>총 수익금액</span>
						<span>{{ Math.floor(settlement_data.total_revenue_price) | makeComma }} 원</span>
					</li>
				</ul>
			</div>
			<div class="full-height flex-1 flex-column overflow-y-auto mr-10">
				<h6 class="">이번달 정산</h6>
				<ul class="pa-10 full-height box overflow-y-auto">
				</ul>
			</div>
			<div class="full-height flex-1 flex-column overflow-y-auto mr-10">
				<h6 class="">최근 문의</h6>
				<ul class="pa-10  box full-height overflow-y-auto">
					<template
						v-if="qna_items.length > 0"
					>
					<li
						v-for="qna in qna_item_list"
						:key="'qna_' + qna.uid"
						class="ptb-10 justify-space-between"
						@click="toQnaDetail(qna)"
					>
						<span>[{{ qna.is_answer }}] {{  qna.b_title  }}</span>
						<span>{{  qna.wDate | transDate('-')}}</span>
					</li>
					</template>
					<li
						v-else
					>등록된 문의가 없습니다</li>
				</ul>
			</div>
			<div class="full-height flex-1 flex-column overflow-y-auto">
				<h6 class="">공지사항</h6>
				<ul class="pa-10 full-height box overflow-y-auto">
					<template
						v-if="notice_items.length > 0"
					>
					<li
						v-for="notice in notice_items"
						:key="'notice_' + notice.uid"
						class="ptb-10 justify-space-between"
						@click="toNoticeDetail(notice)"
					>
						<span>{{  notice.b_title  }}</span>
						<span>{{  notice.wDate | transDate('-')}}</span>
					</li>
					</template>
					<li
						v-else
					>공지사항이 없습니다</li>
				</ul>
			</div>
		</div>
		<div class="mt-auto pa-10 "></div>
	</div>
</template>

<script>

import { GChart } from 'vue-google-charts'

	export default{
		name: 'Main'
		,props: ['Axios', 'TOKEN', 'date', 'user', 'codes']
		,components: { GChart }
		,data: function(){
			return {
				program: {
					name: '대시보드'
					,top: true
					,title: true
					,search: false
					,bottom: false
				}
				,member_info: {

				}
				,items: [
					{}, {}, {}, {}
				]
				,item: {

				}
				,chartData: [
					['Month', '판매량', '매출', '수익'],
					['2021.09.13',  165,      938,         522],
					['2021.09.14',  135,      1120,        599],
					['2021.09.15',  157,      1160,        587],
					['2021.09.16',  139,      1110,        615],
					['2021.09.17',  136,      691,         629]
				]
				,chartOptions: {
					title : '최근 1주일 판매수익',
					height: 350,
					seriesType: 'bars'
					,vAxis: {format: 'short'}
				}
				,chartOptions2: {
					title : '이번달 판매수익',
					height: 350,
				}
				,chartOptions3: {
					title : '최근 1주일 판매량',
					height: 350,
				}
				,chart_data: []
				,chart_data2: []
				,settlement_data: {
					total_cnt: 0
				}
				,qna_items: []
				,notice_items: []
			}
		}
		,computed: {
			qna_item_list: function(){
				return this.qna_items.filter(function(item){
					if(item.b_answer){
						item.is_answer = '답변완료'
					}else{
						item.is_answer = '답변대기'
					}
					return item
				})
			}
			,chart_data_weekly: function(){
				let data = [
					["판매일", "매출", "수익"]
				]

				let start = this.date.getLastWeekDate(this.date.getToday(), '-')

				let date = start
				for(let i = 0; i < 7; i++){

					let is_do = false
					this.chart_data.filter(function(item){
						if(item.date == date) {
							data.push([
								item.date
								, Number(item.total_sale_price)
								, Number(item.total_revenue_price)
							])
							is_do = true
						}
					})

					if(!is_do){
						data.push([
							date
							, 0
							, 0
						])
					}
					date = this.date.getNextDay(date, '-')
				}

				return data
			}
			,chart_data_weekly_cnt: function(){
				let data = [
					["판매일", "판매랑"]
				]

				let start = this.date.getLastWeekDate(this.date.getToday(), '-')

				let date = start
				for(let i = 0; i < 7; i++){

					let is_do = false
					this.chart_data.filter(function(item){
						if(item.date == date) {
							data.push([
								item.date
								, Number(item.total_cnt)
							])
							is_do = true
						}
					})

					if(!is_do){
						data.push([
							date
							, 0
						])
					}
					date = this.date.getNextDay(date, '-')
				}

				return data
			}
			,chart_data_monthly: function(){
				let data = [
					["판매일", "매출", "수익"]
				]

				if(this.chart_data2.length > 0){

					this.chart_data2.filter(function(item){
						data.push([
							item.date
							,Number(item.total_sale_price ? item.total_sale_price : 0)
							,Number(item.total_revenue_price ? item.total_revenue_price : 0)
						])
					})
				}else{
					data.push([
						''
						,0
						,0
					])
				}

				return data
			}
		}
		,methods: {
			getData: async function(){
				const result = await this.Axios({
					method: 'post'
					,url: 'management/getDashboard'
					,data: {
						ATOKEN: this.TOKEN
					}
				})

				if(result.success){
					this.chart_data = result.data.chart_data
					this.chart_data2 = result.data.chart_data2
					this.settlement_data = result.data.settlement_data
					this.qna_items = result.data.qna_list
					this.notice_items = result.data.notice_list
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message})
				}
			}
			,goDetail(item){
				item.TOKEN = sessionStorage.getItem('delimallAT')
				this.$set(this, 'item', item)
			}
			,clear(){
				this.$set(this, 'item', {})
				this.setProgram(this.program)
			}
			,setProgram(program){
				this.$emit('onLoad', program)
			}
			,setNotify({ type, message}){
				this.$emit('setNotify', { type: type, message: message })
			}
			,toQnaDetail: function(item){
				this.$router.push({ name: 'BbsAnswer', params: { b_code: item.b_code, bbs_uid: item.uid}})
			}
			,toNoticeDetail: function(item){
				if(this.user.role == this.codes.type_code_admin){
					this.$router.push({ name: 'BbsDetail', params: { b_code: item.b_code, bbs_uid: item.uid}})
				}else{
					this.$router.push({ name: 'BbsView', params: { b_code: item.b_code, bbs_uid: item.uid}})
				}
			}
		}
		,created: function(){
			this.$emit('onLoad', this.program)
			this.getData()
		}
	}
	
</script>

<style>

	.label { color: white; border-radius: 5px; padding: 3px 7px 3px; line-height: 12px !important; font-size: 10px;}
	.label-new { background-color: #0D47A1;}
	.label-hot { background-color: #e64a19;}
	.label-recomm { background-color: #0f9d58;}
	.label-season { background-color: #00b0ff;}
</style>
