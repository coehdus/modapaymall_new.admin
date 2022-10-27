import axios from 'axios'
import {Base64} from "js-base64";

let domain = process.env.VUE_APP_DOMAIN
let dev = process.env.VUE_APP_DEV
let server = process.env.VUE_APP_SERVER
let location = window.location.href

let baseUrl = ''

console.log(process.env)

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
			if(!data.ATOKEN){
				let TOKEN = sessionStorage.getItem(Base64.encode(process.env.VUE_APP_NAME) + 'AT')
				data.ATOKEN = TOKEN
			}
			return data
		}
	}

	const getData = function(){
		if(method != 'get'){
			const formData = new FormData();
			for(let key in data){

				formData.append(key, data[key])
			}
			if(!formData.get('ATOKEN') && !formData.get('UTOKEN')){
				let TOKEN = sessionStorage.getItem(Base64.encode(process.env.VUE_APP_NAME) + 'AT')
				if(TOKEN){
					formData.append("ATOKEN", TOKEN)
				}
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
			default_header.Authorization = 'Bearer ' + TOKEN
		}else{

			//let TOKEN = sessionStorage.getItem(Base64.encode(process.env.VUE_APP_NAME) + 'AT')

			// default_header.Authorization = 'Bearer ' + TOKEN
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



