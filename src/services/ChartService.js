export const chartService = {
  // 生成图表配置项
  generateChartOption: (chartConfig, chartData) => {
    const { dimensions, metrics, chartType } = chartConfig
    const { data } = chartData
    
    // 如果没有数据，返回一个空的图表配置
    if (!data || data.length === 0) {
      return {
        title: {
          text: '无数据',
          left: 'center'
        },
        tooltip: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: []
      }
    }
    
    let option = {
      title: {
        text: '图表展示',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: metrics.map(m => m.alias),
        top: 30
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      }
    }
    
    // 根据图表类型生成不同的配置
    switch (chartType) {
      case 'bar':
      case 'stacked_bar':
        // 处理分组柱状图和堆叠柱状图
        let xAxisData = []
        let seriesData = []
        
        // 检查是否有多个维度，如果有，使用第二个维度作为分组依据
        if (dimensions.length > 1) {
          // 多个维度：第一个维度作为X轴，第二个维度作为分组
          const mainDimension = dimensions[0]
          const subDimension = dimensions[1]
          
          // 获取所有主维度值
          const mainDimensionValues = [...new Set(data.map(item => item[mainDimension]))]
          xAxisData = mainDimensionValues
          
          // 获取所有子维度值
          const subDimensionValues = [...new Set(data.map(item => item[subDimension]))]
          
          // 为每个指标生成系列数据
          metrics.forEach(metric => {
            subDimensionValues.forEach(subValue => {
              const seriesItem = {
                name: `${metric.alias} - ${subValue}`,
                type: 'bar',
                stack: chartType === 'stacked_bar' ? `${metric.alias}_stack` : undefined,
                data: mainDimensionValues.map(mainValue => {
                  // 查找对应的数据项
                  const dataItem = data.find(item => 
                    item[mainDimension] === mainValue && item[subDimension] === subValue
                  )
                  if (dataItem) {
                    // 尝试使用alias作为字段名，如果不存在则使用code，否则使用第一个数值字段
                    if (dataItem.hasOwnProperty(metric.alias)) {
                      return dataItem[metric.alias]
                    } else if (dataItem.hasOwnProperty(metric.code)) {
                      return dataItem[metric.code]
                    } else {
                      // 获取第一个数值字段
                      const firstNumberField = Object.keys(dataItem).find(key => typeof dataItem[key] === 'number')
                      return firstNumberField ? dataItem[firstNumberField] : 0
                    }
                  }
                  return 0
                })
              }
              seriesData.push(seriesItem)
            })
          })
        } else {
          // 单维度：使用指标作为分组
          xAxisData = data.map(item => item[dimensions[0]])
          
          metrics.forEach(metric => {
            const seriesItem = {
              name: metric.alias,
              type: 'bar',
              stack: chartType === 'stacked_bar' ? 'total' : undefined,
              data: data.map(item => {
                // 尝试使用alias作为字段名，如果不存在则使用code，否则使用第一个数值字段
                if (item.hasOwnProperty(metric.alias)) {
                  return item[metric.alias]
                } else if (item.hasOwnProperty(metric.code)) {
                  return item[metric.code]
                } else {
                  // 获取第一个数值字段
                  const firstNumberField = Object.keys(item).find(key => typeof item[key] === 'number')
                  return firstNumberField ? item[firstNumberField] : 0
                }
              })
            }
            seriesData.push(seriesItem)
          })
        }
        
        option.xAxis = {
          type: 'category',
          data: xAxisData
        }
        option.yAxis = {
          type: 'value'
        }
        option.series = seriesData
        break
        
      case 'line':
        option.xAxis = {
          type: 'category',
          data: data.map(item => item[dimensions[0]])
        }
        option.yAxis = {
          type: 'value'
        }
        option.series = metrics.map(metric => ({
          name: metric.alias,
          type: 'line',
          // 获取数据对象中的第一个数值字段作为默认值
          data: data.map(item => {
            // 尝试使用alias作为字段名，如果不存在则使用code，否则使用第一个数值字段
            if (item.hasOwnProperty(metric.alias)) {
              return item[metric.alias]
            } else if (item.hasOwnProperty(metric.code)) {
              return item[metric.code]
            } else {
              // 获取第一个数值字段
              const firstNumberField = Object.keys(item).find(key => typeof item[key] === 'number')
              return firstNumberField ? item[firstNumberField] : 0
            }
          })
        }))
        break
        
      case 'pie':
        option.tooltip.trigger = 'item'
        option.legend.orient = 'vertical'
        option.legend.left = 'left'
        option.series = [{
          name: metrics[0].alias,
          type: 'pie',
          radius: '50%',
          data: data.map(item => {
            // 获取数据对象中的第一个数值字段作为默认值
            let value = 0
            if (item.hasOwnProperty(metrics[0].alias)) {
              value = item[metrics[0].alias]
            } else if (item.hasOwnProperty(metrics[0].code)) {
              value = item[metrics[0].code]
            } else {
              // 获取第一个数值字段
              const firstNumberField = Object.keys(item).find(key => typeof item[key] === 'number')
              value = firstNumberField ? item[firstNumberField] : 0
            }
            return {
              name: item[dimensions[0]],
              value: value
            }
          }),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
        break
        
      case 'scatter':
        option.xAxis = {
          type: 'value',
          name: dimensions[0]
        }
        option.yAxis = {
          type: 'value',
          name: metrics[0].alias
        }
        option.series = [{
          name: metrics[0].alias,
          type: 'scatter',
          data: data.map(item => {
            // 获取数据对象中的第一个数值字段作为默认值
            let value = 0
            if (item.hasOwnProperty(metrics[0].alias)) {
              value = item[metrics[0].alias]
            } else if (item.hasOwnProperty(metrics[0].code)) {
              value = item[metrics[0].code]
            } else {
              // 获取第一个数值字段
              const firstNumberField = Object.keys(item).find(key => typeof item[key] === 'number')
              value = firstNumberField ? item[firstNumberField] : 0
            }
            return [item[dimensions[0]], value]
          })
        }]
        break
        
      case 'radar':
        option.radar = {
          indicator: dimensions.map(dim => {
            // 获取维度对应的最大值
            const maxValue = Math.max(...data.map(item => {
              // 尝试获取维度对应的值，如果不存在则返回0
              return item[dim] || 0
            }))
            return {
              name: dim,
              max: maxValue > 0 ? maxValue : 100
            }
          })
        }
        option.series = [{
          name: metrics[0].alias,
          type: 'radar',
          data: [{
            value: dimensions.map(dim => {
              // 尝试获取维度对应的值，如果不存在则返回0
              return item[dim] || 0
            }),
            name: metrics[0].alias
          }]
        }]
        break
        
      default:
        break
    }
    
    return option
  }
}