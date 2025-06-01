import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router'
import { useAdminStore } from '../stores/admin'


// 创建axios实例
const api = axios.create({
  baseURL: "/api", 
  timeout: 60000, // 请求超时时间
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 在发送请求之前处理config
    const token = localStorage.getItem('token')
    console.log('token', token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log('config', config.headers.Authorization)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 处理HTTP网络错误
    let message = ''
    if (error.response) {
      // 服务器返回了响应，但状态码不在2xx范围
      message = `HTTP Error: ${error.response.status}`
      // 处理常见状态码（根据需求扩展）
      switch (error.response.status) {
        case 401:
          message = '身份认证失败，请先登录'
          const admin = useAdminStore()
          admin.clearAuth()
          router.replace('/login')
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求资源不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      message = '网络连接异常，请检查网络'
    } else {
      // 其他错误
      message = error.message
    }

    ElMessage({
      message,
      type: 'error',
      duration: 5 * 1000
    })

    return Promise.reject(error)
  }
)

export default api