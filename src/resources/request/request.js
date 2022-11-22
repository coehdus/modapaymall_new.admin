
import {Axios} from "@/resources/axios/axios";

export const request = {
    Axios: Axios,

    upload_url: function(file_name){
        //console.log('file_name', file_name)
        if(!file_name){
            return ''
        }
        if(file_name.indexOf('https') > -1){
            return file_name
        }

        if(file_name.indexOf('data:image') > -1){
            return file_name
        }

        if(process.env.VUE_APP_TYPE == 'sample'){
            try{
                return require('@/assets/image/' + file_name)
            }catch (e) {
                console.log(e)
                return ''
            }
        }else{
            return require(file_name)
        }
    },

    init: async function({ method, url, data, header, authorize, multipart, TOKEN, blob, name, type }){
        try {

            // console.log('request init: ', method, url, data, name, type)
            /*
            for(let [key, val] of Object.entries(data)){
                console.log(key, val)
            }

             */
            if(!type && process.env.VUE_APP_TYPE == 'sample'){
                if(method == 'get'){
                    let result = this.sample.getSampleData(data)
                    // console.log('request result', result)
                    return result
                }else{
                    if(typeof this.sample[name] === 'function'){
                        return this.sample[name](data)
                    }else{
                        throw 'not method ' + method
                    }
                }

            }else{
                console.log(' do axios ')
                return Axios({ method, url, data, header, authorize, multipart, TOKEN, blob })
            }
        }catch (e) {
            // console.log('init', e)
            return { success: false, message: e}
        }
    }
    , set: function(obj, arg){

        let t = ''
        if(obj){
            t = obj[arg]
        }
        return t
    }
}