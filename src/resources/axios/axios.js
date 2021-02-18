import axios from 'axios'

var domain = 'agency.reappay.net'
var dev = 'https://api.dev.pg.reappay.net/agent/v1/'
var server = 'https://api.pg.reappay.net/agent/v1/'
var location = window.location.href

var baseUrl = ''

if(location.indexOf(domain) > -1){
	baseUrl = server
}else{
	baseUrl = dev
}

export async function Axios({ method, url, data, header, authorize, multipart, TOKEN, blob }){

	const instance = axios.create({
		baseURL: baseUrl
		,timeout: 30000
	})
	
	const getUrl = function(){
		return url
	}
	
	const getParams = function(){
		if(method == 'get'){
			return data
		}
	}
	
	const getData = function(){
		if(method != 'get'){
			const formData = new FormData();
			for(var key in data){
				formData.append(key, data[key])
			}
			if(multipart){
				return formData
			}else{
				return data
			}
		}
	}
	
	const getHeader = function(){
		
		let default_header = {
			'Content-Type': 'application/json'
			,'Access-Control-Allow-Origin' : '*'
		}
		
		if(authorize){
			default_header.Authorization = 'Bearer ' + (TOKEN ? TOKEN : sessionStorage.getItem('TOKEN'))
		}
		
		if(multipart){
			default_header['Content-Type'] = 'multipart/form-data'
		}
		
		if(blob){
			default_header['responseType'] = 'blob'
		}

		return header ? header : default_header
	}
	
	try{
		const result = await instance({
			method: method
			,url: getUrl()
			,params: getParams()
			,data: getData()
			,headers: getHeader()
		})
		
		if(result.status == 200){
			const data = result.data
			if(data.status == 200){
				return {success: true, data: data}
			}else if(result.status == 40120){
				return {success: false, message: '인증이 만료되었습니다'}
			}else{
				return {success: false, message: data.message}
			}
		}else{
			const data = result.data
			console.log(data.status)
			if(data.status == 40120){
				return {success: false, message: '인증이 만료되었습니다'}
			}else{
				return {success: false, message: '통신오류: ' + result.status}
			}
		}
	}catch(E){
		console.log('Axios result error')
		console.log(E)
		
		return {success: false, message: '통신오류: ' + E}
	}
}



