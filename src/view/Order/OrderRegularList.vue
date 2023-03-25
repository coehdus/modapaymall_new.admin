<template>

	<div class="full-height">

		<div class="full-height">

			<Search
				:search="item_search"
				:option="search_option"

				@change="getSearch"
				@click="getSearch"
			>
			</Search>

			<div class="mt-10 pa-10 bg-white">
				<table class="table table-even">
					<colgroup>
						<col width="80px" />
						<col width="auto" />
						<col width="180px" />
						<col width="120px" />
						<col width="120px" />

						<col width="120px" />
						<col width="120px" />
						<col width="120px" />
						<col width="120px" />
					</colgroup>
					<thead>
					<tr>
						<th>
							<input
								type="checkbox"
							/>
						</th>
						<th>정기결제 상품</th>
						<th>이름</th>
						<th>시작일</th>
						<th>결제일</th>
						<th>결제기간</th>
						<th>구독여부</th>
						<th>사용여부</th>
						<th>상세보기</th>
					</tr>
					</thead>
					<tbody>
					<tr
						v-for="item in items"
						:key="'item_' + item.uid"
					>
						<td>
							<input
								type="checkbox"
							/>
						</td>
						<td>
							<div class="flex-row items-center">
								<div class="square-100 mr-10"><img :src="item.pdt_img" class="width-100"/></div>
								<div>
									<div>{{ item.pdt_name }}</div>
									<div>{{ item.order_price }}</div>
								</div>
							</div>
						</td>
						<td>{{ item.member_name }} ({{ item.member_id }})</td>
						<td>{{ item.sDate }}</td>
						<td>매월 {{ item.regular_date }} 일</td>
						<td>{{ item.regular_rate }} 개월</td>
						<td>{{ codes.regular_complete_status[item.is_complete].name }}</td>
						<td>{{ codes.regular_cancel_status[item.is_cancel].name}}</td>
						<td><button
							@click="toDetail(item)"
							class="btn-success pa-10"
						>상세보기</button></td>
					</tr>
					</tbody>
				</table>
			</div>

			<Pagination
				:program="program"
				:options="item_search"
				:align="'center'"

				@click="getSearch"
				class="mt-auto"
			></Pagination>
		</div>
	</div>
</template>

<script>
import Pagination from "../../components/Pagination";
import Search from "../Layout/Search";
export default{
	name: 'OrderRegularList'
	,
	components: {Search, Pagination},
	props: ['Axios', 'TOKEN', 'codes']
	, data: function(){
		return {
			program: {
				name: '정기 결제 목록'
				,top: true
				,title: true
				,bottom: false
			}
			, item_search: {
				page: 1
				, list_cnt: 10
				, total_count: 1
				, year: this.$route.params.year
				, month: this.$route.params.month
				, date: this.$route.params.date
				, is_complete: ''
				, is_cancel: ''
				, search_type: 'member_name'
			}
			,search_option:{

				is_item: false
				,is_excel: false
				,is_cnt: true
				,cnt: 0
				,tCnt: 0
				,search_type: [
					{ name: '아이디', column: 'member_id'}
					,{ name: '이름', column: 'member_name'}
				]
				,select: [

					{ name: '구독 여부', column: 'is_complete', items: [
							{ name: '구독중', column: '0'}
							,{ name: '구독완료', column: '1'}
						]
					}
					, { name: '사용 여부', column: 'is_cancel', items: [
							{ name: '사용', column: '0'}
							,{ name: '미사용', column: '1'}
						]
					}
				]
			}
			, items: []
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
	, methods: {
		getData: async function(){
			try{
				this.$bus.$emit('on', true)

				const result = await this.$request.init({
					method: 'get'
					,url: 'management/getOrderRegular'
					,data: this.item_search
				})

				if(result.success){
					this.items = result.data.result
					this.item_search.total_count = result.data.tCnt
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message})
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$bus.$emit('on', false)
			}
		}
		, getSearch: function(page){
			if(page){
				this.item_search.page = page
			}

			this.getData()
		}

		, toDetail: function(item){
			this.$emit('push', { name: 'OrderRegularDetail', params: { idx: item.uid }})
		}
	}

	, created() {
		this.$emit('onLoad', this.program)
		this.getData()
	}
}
</script>