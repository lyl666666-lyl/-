import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router'
const request = axios.create({ baseURL: '', timeout: 15000 })
request.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = 'Bearer ' + token
  return config
})
request.interceptors.response.use(res => {
  const data = res.data
  if (data && data.code && data.code !== 200) {
    ElMessage.error(data.message || '请求失败')
    if (data.code === 401) router.push('/login')
    return Promise.reject(data)
  }
  return data?.data ?? data
}, err => {
  if (err.response?.status === 401) { localStorage.clear(); router.push('/login') }
  ElMessage.error(err.response?.data?.message || err.message || '请求失败')
  return Promise.reject(err)
})
export default request
