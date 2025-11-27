import axios from 'axios'

// 创建axios实例
const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证信息等
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error('API请求失败:', error)
    return Promise.reject(error)
  }
)

export const apiService = {
  // 生成图表数据
  generateChart: async (config) => {
    return await axiosInstance.post('/charts/generate', config)
  },
  
  // 获取所有指标
  getMetrics: async () => {
    return await axiosInstance.get('/metrics')
  },
  
  // 获取数据集列表
  getDatasets: async (params) => {
    return await axiosInstance.get('/datasets', { params })
  },
  
  // 创建数据集
  createDataset: async (data) => {
    return await axiosInstance.post('/datasets', data)
  },
  
  // 查询数据集数据
  queryDataset: async (datasetId, query) => {
    return await axiosInstance.post(`/datasets/${datasetId}/query`, query)
  },
  
  // 获取所有模型
  getModels: async () => {
    return await axiosInstance.get('/models')
  }
}