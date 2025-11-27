export const dataService = {
  // 转换原始数据为图表可用格式
  transformChartData: (rawData, config) => {
    const { dimensions, metrics } = config
    
    // 确保数据格式正确
    return {
      data: rawData.data || [],
      dimensions: dimensions,
      metrics: metrics,
      chartType: config.chartType
    }
  },
  
  // 计算数据统计信息
  calculateStats: (data, field) => {
    if (!data || data.length === 0) {
      return {
        min: 0,
        max: 0,
        avg: 0,
        sum: 0
      }
    }
    
    const values = data.map(item => item[field]).filter(v => typeof v === 'number')
    const sum = values.reduce((acc, val) => acc + val, 0)
    
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: sum / values.length,
      sum: sum
    }
  },
  
  // 格式化数据值
  formatValue: (value, type = 'number') => {
    switch (type) {
      case 'currency':
        return `¥${value.toFixed(2)}`
      case 'percentage':
        return `${(value * 100).toFixed(2)}%`
      case 'number':
        if (value >= 10000) {
          return `${(value / 10000).toFixed(2)}万`
        }
        return value.toFixed(2)
      default:
        return value
    }
  }
}