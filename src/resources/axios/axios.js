import axios from 'axios'

let domain = process.env.VUE_APP_DOMAIN
let dev = process.env.VUE_APP_DEV
let server = process.env.VUE_APP_SERVER
let location = window.location.href

let baseUrl = ''

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
			for(let key in data){
				console.log(key)
				console.log(data[key])
				formData.append(key, data[key])
			}
			if(multipart){
				return formData
			}else{
				return formData
			}
		}
	}
	
	const getHeader = function(){
		
		let default_header = {

		}
		
		if(authorize){
			default_header.Authorization = 'Bearer ' + (TOKEN ? TOKEN : sessionStorage.getItem('delimallAT'))
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

			return result.data
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



