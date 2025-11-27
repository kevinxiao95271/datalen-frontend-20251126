<template>
  <div class="chart-component">
    <div class="chart" ref="chartRef"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { useChartStore } from '../store/chartStore'
import { chartService } from '../services/ChartService'

const chartRef = ref(null)
let chartInstance = null
const chartStore = useChartStore()

// 初始化图表
const initChart = () => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value)
    window.addEventListener('resize', handleResize)
  }
}

// 处理窗口大小变化
const handleResize = () => {
  chartInstance && chartInstance.resize()
}

// 更新图表
const updateChart = () => {
  if (!chartInstance) return
  
  const chartOption = chartService.generateChartOption(chartStore.chartConfig, chartStore.chartData)
  chartInstance.setOption(chartOption, true)
}

// 监听图表配置和数据变化
watch(
  () => [chartStore.chartConfig, chartStore.chartData],
  () => {
    updateChart()
  },
  { deep: true }
)

onMounted(() => {
  initChart()
  updateChart()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance && chartInstance.dispose()
})
</script>

<style scoped>
.chart-component {
  width: 100%;
  height: 100%;
  min-height: 500px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.chart {
  width: 100%;
  height: 400px;
}
</style>