

export const sample = {
	agentList:[
		{
			"agentMarginRate": [
				"3.3%", '3.1%', '3.2%'
			],
			"agentSeq": "agentSeq",
			"agentTypeName": "리셀러",
			"businessName": "대리점 > 가맹점 상호명",
			"ceoName": "홍길동",
			"companyTypeName": "법인",
			"joinDate": "string",
			"managerEmail": "string",
			"managerMobilPhoneNumber": "string",
			"managerName": "string",
			"phoneNumber": 123345677,
			"rowNumber": 3,
			"status": "1",
			"statusName": "string"
		}
		,{
			"agentMarginRate": [
				"3.3%", '3.1%', '3.2%'
			],
			"agentSeq": "agentSeq",
			"agentTypeName": "리셀러",
			"businessName": "대리점 > 가맹점 상호명",
			"ceoName": "홍길동",
			"companyTypeName": "법인",
			"joinDate": "string",
			"managerEmail": "string",
			"managerMobilPhoneNumber": "string",
			"managerName": "string",
			"phoneNumber": 123345677,
			"rowNumber": 2,
			"status": "2",
			"statusName": "string"
		},{
			"agentMarginRate": [
				"3.3%", '3.1%', '3.2%'
			],
			"agentSeq": "agentSeq",
			"agentTypeName": "리셀러",
			"businessName": "대리점 > 가맹점 상호명",
			"ceoName": "홍길동",
			"companyTypeName": "법인",
			"joinDate": "string",
			"managerEmail": "string",
			"managerMobilPhoneNumber": "string",
			"managerName": "string",
			"phoneNumber": 123345677,
			"rowNumber": 1,
			"status": "3",
			"statusName": "string"
		}
	]
	,franchiseeList: [
		{
			"businessName": "대리점 > 가맹점 상호명",
			"ceoName": "홍길동",
			"companyTypeName": "개인",
			"feeRate": "feeRate",
			"joinDate": "joinDate",
			"marginFeeRate": "marginFeeRate",
			"pgMerchNo": "1",
			"rowNumber": 9,
			"servicesTypeName": "servicesTypeName",
			"settlementCycleName": "settlementCycleName",
			"status": "2",
			"statusName": "statusName",
			"totalPaymentAmount": "totalPaymentAmount",
			"yearLimit": "yearLimit",
			"yearLimitRemainingLimit": "yearLimitRemainingLimit"
		}
		,{
			"businessName": "대리점 > 가맹점 상호명",
			"ceoName": "홍길동",
			"companyTypeName": "비사업자",
			"feeRate": "feeRate",
			"joinDate": "joinDate",
			"marginFeeRate": "marginFeeRate",
			"pgMerchNo": "2",
			"rowNumber": 8,
			"servicesTypeName": "servicesTypeName",
			"settlementCycleName": "settlementCycleName",
			"status": "3",
			"statusName": "statusName",
			"totalPaymentAmount": "totalPaymentAmount",
			"yearLimit": "yearLimit",
			"yearLimitRemainingLimit": "yearLimitRemainingLimit"
		}
	]
	
	,franchiseeConfirmList: [
		{
			"businessName": "대리점 > 가맹점 상호명",
			"ceoName": "홍길동",
			"companyTypeName": "법인",
			"createAt": "2020-12-09T05:32:04.931Z",
			"id": 3,
			"rowNumber": 3,
			"serviceStatus": "NotApplied"
			,active: false
		}
		,
		{
			"businessName": "대리점 > 가맹점 상호명",
			"ceoName": "홍길동",
			"companyTypeName": "개인",
			"createAt": "2020-12-09T05:32:04.931Z",
			"id": 2,
			"rowNumber": 2,
			"serviceStatus": "NotApplied"
			,active: false
		}
		,
		{
			"businessName": "대리점 > 가맹점 상호명",
			"ceoName": "홍길동",
			"companyTypeName": "비사업자",
			"createAt": "2020-12-09T05:32:04.931Z",
			"id": 1,
			"rowNumber": 1,
			"serviceStatus": "cancel"
			,active: false
		}
	]
	
	,franchiseeItem: {
		"content": {
			"basic": {
				"joinDate": "joinDate",
				"userId": "userId",
				"userPhoneNumber": "userPhoneNumber",
				"userSeq": "userSeq"
			},
			"company": {
				"businessName": "businessName",
				"businessNumber": "businessNumber",
				"businessTypeCate": "businessTypeCate",
				"ceoMobilPhoneNumber": "ceoMobilPhoneNumber",
				"ceoName": "ceoName",
				"companyAddressDetail": 'companyAddressDetail',
				"companyAddressMain": "companyAddressMain",
				"companyTypeName": "companyTypeName",
				"companyZipCode": 'companyZipCode',
				"servicesTypeName": "servicesTypeName"
			},
			"insurance": {
				"insuranceCoverageAmount": "insuranceCoverageAmount",
				"monthLimit": "monthLimit",
				"oneTimeLimit": "oneTimeLimit",
				"yearLimit": "yearLimit"
			},
			"manager": {
				"managerEmail": "managerEmail",
				"managerMobilPhoneNumber": "managerMobilPhoneNumber",
				"managerName": "managerName"
			},
			"paymentItems": [
				{
				"agentMarginRate": "agentMarginRate",
				"dealerMarginRate": "dealerMarginRate",
				"merchantFeeRate": "merchantFeeRate",
				"resellerMarginRate": "resellerMarginRate",
				"serviceItemName": "serviceItemName",
				"supplyRate": "supplyRate"
				}
			],
			"settlement": {
				"bankAccountHolder": "bankAccountHolder",
				"bankAccountNumber": "bankAccountNumber",
				"bankCode": "bankCode",
				"settlementCycleName": "settlementCycleName"
			}
		},
		"message": "string",
		"status": 0,
		"timestamp": 0
	}
	
	,agentItem: {
		"content": {
			"basic": {
				"joinDate": "joinDate",
				"userId": "userId",
				"userPhoneNumber": "userPhoneNumber",
				"userSeq": "userSeq"
				,"status": 'apply'
				,"statusName": '정상사용'
			},
			"company": {
				"businessName": "businessName",
				"businessNumber": "businessNumber",
				"businessTypeCate": "businessTypeCate",
				"ceoMobilPhoneNumber": "ceoMobilPhoneNumber",
				"ceoName": "ceoName",
				"companyAddressDetail": 'companyAddressDetail',
				"companyAddressMain": "companyAddressMain",
				"companyTypeName": "companyTypeName",
				"companyZipCode": 'companyZipCode',
				"servicesTypeName": "servicesTypeName"
			},
			"insurance": {
				"insuranceCoverageAmount": "insuranceCoverageAmount",
				"monthLimit": "monthLimit",
				"oneTimeLimit": "oneTimeLimit",
				"yearLimit": "yearLimit"
			},
			"manager": {
				"managerEmail": "managerEmail",
				"managerMobilPhoneNumber": "managerMobilPhoneNumber",
				"managerName": "managerName"
			},
			"paymentItems": [
				{
				"agentMarginRate": "agentMarginRate",
				"dealerMarginRate": "dealerMarginRate",
				"merchantFeeRate": "merchantFeeRate",
				"resellerMarginRate": "resellerMarginRate",
				"serviceItemName": "serviceItemName",
				"supplyRate": "supplyRate"
				}
			],
			"settlement": {
				"bankAccountHolder": "bankAccountHolder",
				"bankAccountNumber": "bankAccountNumber",
				"bankCode": "bankCode",
				"settlementCycleName": "settlementCycleName"
			}
		},
		"message": "string",
		"status": 0,
		"timestamp": 0
	}
	
	,user: [
		{
			"joinDate": "string",
			"userId": "reappay",
			"userName": "립페이 대리점",
			"userSeq": "1",
			"userGrade": '1'
		}
		,{
			"joinDate": "string",
			"userId": "reappay",
			"userName": "립페이 리셀러",
			"userSeq": "2",
			"userGrade": '2'
		}
		,{
			"joinDate": "string",
			"userId": "reappay",
			"userName": "립페이 딜러",
			"userSeq": "3",
			"userGrade": '3'
		}
	]
	
	,status: {
		confirm: [
			{
				code: ''
				,name: '전체'
			}
			,{
				code: '1'
				,name: '심사대기'
			}
			,{
				code: '2'
				,name: '재심사'
			}
			,{
				code: '3'
				,name: '반려'
			}
		]
	}
	
	,dashboard: {
		monthly:[
			{
				month: 1
				,tot1: 100000
				,tot2: 200000
				,tot3: 300000
				,tot4: 10
				,tot5: 600000
				,active: false
			}
			,{
				month: 2
				,tot1: 100000
				,tot2: 200000
				,tot3: 300000
				,tot4: 10
				,tot5: 600000
				,active: false
			}
			,{
				month: 3
				,tot1: 100000
				,tot2: 200000
				,tot3: 300000
				,tot4: 10
				,tot5: 600000
				,active: false
			}
			,{
				month: 4
				,tot1: 100000
				,tot2: 200000
				,tot3: 300000
				,tot4: 10
				,tot5: 600000
				,active: false
			}
			,{
				month: 5
				,tot1: 100000
				,tot2: 200000
				,tot3: 300000
				,tot4: 10
				,tot5: 600000
				,active: false
			}
			,{
				month: 6
				,tot1: 100000
				,tot2: 200000
				,tot3: 300000
				,tot4: 10
				,tot5: 600000
				,active: false
			}
			,{
				month: 7
				,tot1: 100000
				,tot2: 200000
				,tot3: 300000
				,tot4: 10
				,tot5: 600000
				,active: false
			}
			,{
				month: 8
				,tot1: 100000
				,tot2: 200000
				,tot3: 300000
				,tot4: 10
				,tot5: 600000
				,active: false
			}
			,{
				month: 9
				,tot1: 100000
				,tot2: 200000
				,tot3: 300000
				,tot4: 10
				,tot5: 600000
				,active: false
			}
			,{
				month: 10
				,tot1: 100000
				,tot2: 200000
				,tot3: 300000
				,tot4: 10
				,tot5: 600000
				,active: false
			}
			,{
				month: 11
				,tot1: 100000
				,tot2: 200000
				,tot3: 300000
				,tot4: 10
				,tot5: 600000
				,active: true
			}
			,{
				month: 12
				,tot1: 100000
				,tot2: 200000
				,tot3: 300000
				,tot4: 10
				,tot5: 600000
				,active: false
			}
		]
	}
}