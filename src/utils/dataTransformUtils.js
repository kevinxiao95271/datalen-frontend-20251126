// 数据转换工具
export const dataTransformUtils = {
  // 将API返回的数据转换为图表所需格式
  transformToChartData: (rawData, config) => {
    const { dimensions, metrics } = config
    
    return {
      dimensions,
      metrics,
      data: rawData.data.map(item => {
        const transformedItem = {}
        // 保留维度字段
        dimensions.forEach(dim => {
          transformedItem[dim] = item[dim]
        })
        // 保留指标字段
        metrics.forEach(metric => {
          transformedItem[metric.alias] = item[metric.alias]
        })
        return transformedItem
      })
    }
  },
  
  // 转换数据格式为CSV
  transformToCSV: (data, headers) => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n')
    
    return csvContent
  },
  
  // 转换数据格式为Excel兼容的JSON
  transformToExcelJSON: (data, sheetName = 'Sheet1') => {
    return {
      sheets: [{
        name: sheetName,
        data: data
      }]
    }
  },
  
  // 处理空值
  handleNullValues: (data, replaceValue = 0) => {
    return data.map(item => {
      const newItem = { ...item }
      Object.keys(newItem).forEach(key => {
        if (newItem[key] === null || newItem[key] === undefined) {
          newItem[key] = replaceValue
        }
      })
      return newItem
    })
  }
}