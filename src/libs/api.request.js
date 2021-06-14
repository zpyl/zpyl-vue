import HttpRequest from '@/libs/axios'
import config from '@/config'
const baseUrl = '127.0.0.1:8085' // process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

const axios = new HttpRequest(baseUrl)
export default axios
