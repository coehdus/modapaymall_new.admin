

export const columns = {
	Agent: {
		settlement: [
			{ label: 'No', field: 'rowNumber'}
			,{ label: '날짜', field: 'settlementDate'}
			,{ label: '하위 대리점', field: 'businessName'}
			,{ label: '총 결제금액', field: 'paymentAmount'}
			,{ label: '총 결제건수', field: 'paymentCount'}
			,{ label: '하위 대리점 수익', field: 'revenueSubAmount'}
			,{ label: '마진율', field: 'marginFeeRate'}
			,{ label: '내 수익', field: 'revenueAmount'}
		]
	}
	,Merchant: {
		list: [
			{ label: 'No', field: 'rowNumber'}
			,{ label: '사업자', field: 'companyTypeName'}
			,{ label: '가맹점명', field: 'businessName'}
			,{ label: '대표자', field: 'ceoName'}
			,{ label: '정산주기', field: 'settlementCycleName'}
			,{ label: '연한도', field: 'yearLimit'}
			,{ label: '총 결제금액', field: 'totalPaymentAmount'}
			,{ label: '잔여한도', field: 'yearLimitRemainingLimit'}
			,{ label: '가입일', field: 'joinDate'}
			,{ label: '상태', field: 'statusName'}
		]
		,settlement: [
			{ label: 'No', field: 'rowNumber'}
			,{ label: '가맹점명', field: 'businessName'}
			,{ label: '결제건수', field: 'totalPaymentCount'}
			,{ label: '결제금액', field: 'totalPaymentAmount'}
			,{ label: '정산금액', field: 'totalSettlementAmount'}
			,{ label: '수수료율', field: 'feeRate'}
			,{ label: 'AGENT', field: 'agentInformation'}
			,{ label: '상태', field: 'statusName'}
			,{ label: '정산일', field: 'settlementAmount'}
		]
		,payment: [
			{ label: 'No', field: 'rowNumber'}
			,{ label: '서비스타입', field: 'serviceTypeName'}
			,{ label: '결제일시', field: 'tradDate'}
			,{ label: '결제정보', field: 'productName'}
			,{ label: '결제금액', field: 'totAmount'}
			,{ label: '수수료정산 예정금액', field: 'commission'}
		]
	}
}
	