import { reactive, ref } from 'vue'
import { apiService } from '../services/APIService'
import { dataService } from '../services/DataService'

// 图表配置状态
const chartConfig = reactive({
  datasetId: 'ds_sales_001',
  dimensions: [],
  metrics: [],
  chartType: 'bar'
})

// 图表数据状态
const chartData = reactive({
  data: [],
  sql: '',
  loading: false,
  error: null
})

// 应用状态
const appState = reactive({
  isLoading: false,
  currentPage: 'chart'
})

export const useChartStore = () => {
  // 添加维度
  const addDimension = (dimension) => {
    if (!chartConfig.dimensions.includes(dimension)) {
      chartConfig.dimensions.push(dimension)
    }
  }
  
  // 移除维度
  const removeDimension = (dimension) => {
    const index = chartConfig.dimensions.indexOf(dimension)
    if (index > -1) {
      chartConfig.dimensions.splice(index, 1)
    }
  }
  
  // 添加指标
  const addMetric = (metric) => {
    const exists = chartConfig.metrics.some(m => m.code === metric.code)
    if (!exists) {
      chartConfig.metrics.push(metric)
    }
  }
  
  // 移除指标
  const removeMetric = (code) => {
    const index = chartConfig.metrics.findIndex(m => m.code === code)
    if (index > -1) {
      chartConfig.metrics.splice(index, 1)
    }
  }
  
  // 设置图表类型
  const setChartType = (type) => {
    chartConfig.chartType = type
  }
  
  // 生成图表
  const generateChart = async () => {
    chartData.loading = true
    chartData.error = null
    
    try {
      const datasetId = chartConfig.datasetId
      let mockData = []
      let mockSql = ''
      
      // 根据不同数据集生成不同的模拟数据
      switch (datasetId) {
        case 'ds_sales_001':
          // 销售数据集模拟数据
          mockData = [
            { region: '华东', month: '2024-01', 销售额: 10000, 订单数: 500 },
            { region: '华北', month: '2024-01', 销售额: 8000, 订单数: 400 },
            { region: '华南', month: '2024-01', 销售额: 12000, 订单数: 600 },
            { region: '华东', month: '2024-02', 销售额: 11000, 订单数: 550 },
            { region: '华北', month: '2024-02', 销售额: 9000, 订单数: 450 },
            { region: '华南', month: '2024-02', 销售额: 13000, 订单数: 650 }
          ]
          mockSql = `SELECT region, month, SUM(total_sales) as 销售额, COUNT(*) as 订单数 FROM sales WHERE dataset_id = '${chartConfig.datasetId}' GROUP BY region, month`
          break
          
        case 'ds_user_001':
          // 用户数据集模拟数据
          mockData = [
            { city: '北京', age: '18-25', 用户数: 1200, 活跃用户数: 800, 新增用户数: 200 },
            { city: '上海', age: '18-25', 用户数: 1500, 活跃用户数: 1000, 新增用户数: 300 },
            { city: '广州', age: '18-25', 用户数: 900, 活跃用户数: 600, 新增用户数: 150 },
            { city: '北京', age: '26-35', 用户数: 2000, 活跃用户数: 1500, 新增用户数: 400 },
            { city: '上海', age: '26-35', 用户数: 2500, 活跃用户数: 1800, 新增用户数: 500 },
            { city: '广州', age: '26-35', 用户数: 1800, 活跃用户数: 1300, 新增用户数: 350 }
          ]
          mockSql = `SELECT city, age, COUNT(*) as 用户数, COUNT(active) as 活跃用户数, COUNT(new_user) as 新增用户数 FROM users WHERE dataset_id = '${chartConfig.datasetId}' GROUP BY city, age`
          break
          
        case 'ds_product_001':
          // 产品数据集模拟数据
          mockData = [
            { category: '电子产品', brand: '品牌A', 产品数: 50, 库存数量: 1000, 销量: 500 },
            { category: '电子产品', brand: '品牌B', 产品数: 30, 库存数量: 800, 销量: 400 },
            { category: '服装', brand: '品牌C', 产品数: 100, 库存数量: 2000, 销量: 1200 },
            { category: '服装', brand: '品牌D', 产品数: 80, 库存数量: 1500, 销量: 900 },
            { category: '食品', brand: '品牌E', 产品数: 200, 库存数量: 3000, 销量: 2500 },
            { category: '食品', brand: '品牌F', 产品数: 150, 库存数量: 2500, 销量: 2000 }
          ]
          mockSql = `SELECT category, brand, COUNT(*) as 产品数, SUM(stock) as 库存数量, SUM(sales) as 销量 FROM products WHERE dataset_id = '${chartConfig.datasetId}' GROUP BY category, brand`
          break
          
        default:
          // 默认模拟数据
          mockData = [
            { dimension1: 'A', dimension2: 'X', metric1: 100, metric2: 200 },
            { dimension1: 'B', dimension2: 'X', metric1: 150, metric2: 250 },
            { dimension1: 'A', dimension2: 'Y', metric1: 120, metric2: 220 },
            { dimension1: 'B', dimension2: 'Y', metric1: 180, metric2: 280 }
          ]
          mockSql = `SELECT dimension1, dimension2, SUM(metric1) as metric1, SUM(metric2) as metric2 FROM default_table WHERE dataset_id = '${chartConfig.datasetId}' GROUP BY dimension1, dimension2`
      }
      
      // 实际项目中调用API生成图表数据
      // const response = await apiService.generateChart(chartConfig)
      // chartData.data = response.data
      // chartData.sql = response.sql
      
      // 使用模拟数据
      chartData.data = mockData
      chartData.sql = mockSql
    } catch (error) {
      chartData.error = '生成图表失败，请稍后重试'
      console.error('生成图表失败:', error)
    } finally {
      chartData.loading = false
    }
  }
  
  return {
    chartConfig,
    chartData,
    appState,
    addDimension,
    removeDimension,
    addMetric,
    removeMetric,
    setChartType,
    generateChart
  }
}