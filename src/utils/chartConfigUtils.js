// 图表配置工具
export const chartConfigUtils = {
  // 获取默认图表配置
  getDefaultChartConfig: () => {
    return {
      datasetId: '',
      dimensions: [],
      metrics: [],
      chartType: 'bar',
      title: '',
      subtitle: '',
      xAxis: {
        name: '',
        type: 'category',
        show: true
      },
      yAxis: {
        name: '',
        type: 'value',
        show: true
      },
      legend: {
        show: true,
        position: 'top'
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      }
    }
  },
  
  // 验证图表配置是否有效
  validateChartConfig: (config) => {
    const errors = []
    
    if (!config.datasetId) {
      errors.push('数据集ID不能为空')
    }
    
    if (!config.dimensions || config.dimensions.length === 0) {
      errors.push('至少选择一个维度')
    }
    
    if (!config.metrics || config.metrics.length === 0) {
      errors.push('至少选择一个指标')
    }
    
    if (!config.chartType) {
      errors.push('图表类型不能为空')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  },
  
  // 根据图表类型获取支持的配置项
  getChartTypeConfig: (chartType) => {
    const configs = {
      bar: {
        supportedDimensions: 1,
        supportedMetrics: 10,
        defaultDimensions: ['category'],
        defaultMetrics: ['value']
      },
      stacked_bar: {
        supportedDimensions: 1,
        supportedMetrics: 10,
        defaultDimensions: ['category'],
        defaultMetrics: ['value1', 'value2']
      },
      line: {
        supportedDimensions: 1,
        supportedMetrics: 10,
        defaultDimensions: ['time'],
        defaultMetrics: ['value']
      },
      pie: {
        supportedDimensions: 1,
        supportedMetrics: 1,
        defaultDimensions: ['category'],
        defaultMetrics: ['value']
      },
      scatter: {
        supportedDimensions: 1,
        supportedMetrics: 1,
        defaultDimensions: ['x'],
        defaultMetrics: ['y']
      },
      radar: {
        supportedDimensions: 5,
        supportedMetrics: 1,
        defaultDimensions: ['indicator1', 'indicator2', 'indicator3', 'indicator4', 'indicator5'],
        defaultMetrics: ['value']
      }
    }
    
    return configs[chartType] || configs.bar
  },
  
  // 生成图表配置的JSON字符串
  generateConfigJSON: (config) => {
    return JSON.stringify(config, null, 2)
  },
  
  // 解析图表配置的JSON字符串
  parseConfigJSON: (jsonString) => {
    try {
      return JSON.parse(jsonString)
    } catch (error) {
      console.error('解析图表配置失败:', error)
      return null
    }
  }
}