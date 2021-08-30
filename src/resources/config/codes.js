

export const codes = {
	metaInfo: {
		title: 'delimall'
		,copyright: 'delimall'
	}
	,img_url: 'http://delimall.co.kr/API/data/product/'
	,pay_div: {
		card: { code: 'card', name: '카드결제', color: 'blue'}
		,bank: { code: 'bank', name: '무통장 입금', color: 'gray'}
		,point: { code: 'point', name: '포인트 결제', color: 'red'}
	}
	,o_status: [
		{ code: 0, name: '', color: ''}
		,{ code: 1, name: '입금대기', color: 'gray'}
		,{ code: 2, name: '결제완료', color: 'green'}
		,{ code: 3, name: '취소요청', color: 'orange'}
		,{ code: 4, name: '주문취소', color: 'red'}
	]
	,odt_status: {

		step1: { code: 1, name: '주문접수', color: ''}
		,step2: { code: 2, name: '배송준비중', color: ''}
		,step3: { code: 3, name: '배송중', color: ''}
		,step4: { code: 4, name: '배송완료', color: ''}
		,step5: { code: 5, name: '구매확정', color: 'green'}
		,step21: { code: 21, name: '주문 취소 요청', color: 'red'}
		,step22: { code: 22, name: '주문 취소 완료', color: 'red'}
		,step31: { code: 31, name: '교환요청', color: 'orange'}
		,step32: { code: 32, name: '교환처리중', color: 'orange'}
		,step33: { code: 33, name: '교환 배송중', color: 'orange'}
		,step34: { code: 34, name: '교환 완료', color: 'orange'}
		,step41: { code: 41, name: '반품 요청', color: 'red'}
		,step42: { code: 42, name: '반품 처리중', color: 'red'}
		,step43: { code: 43, name: '반품 완료', color: 'red'}
	}

}