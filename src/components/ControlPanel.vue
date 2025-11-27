<template>
  <div class="control-panel">
    <h3>图表配置</h3>
    
    <div class="form-item">
      <label class="form-label">数据集</label>
      <select class="form-control" v-model="chartStore.chartConfig.datasetId">
        <option value="ds_sales_001">销售数据集</option>
        <option value="ds_user_001">用户数据集</option>
        <option value="ds_product_001">产品数据集</option>
      </select>
    </div>
    
    <DimensionSelector />
    <MetricSelector />
    <ChartTypeSelector />
    
    <button class="btn btn-primary" @click="generateChart" :disabled="!canGenerate">
      生成图表
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useChartStore } from '../store/chartStore'
import DimensionSelector from './DimensionSelector.vue'
import MetricSelector from './MetricSelector.vue'
import ChartTypeSelector from './ChartTypeSelector.vue'

const chartStore = useChartStore()

const canGenerate = computed(() => {
  return (
    chartStore.chartConfig.dimensions.length > 0 &&
    chartStore.chartConfig.metrics.length > 0 &&
    chartStore.chartConfig.chartType
  )
})

const generateChart = async () => {
  await chartStore.generateChart()
}
</script>

<style scoped>
.control-panel {
  width: 300px;
  background-color: #fff;
  border-right: 1px solid #ebeef5;
  padding: 20px;
  overflow-y: auto;
}

.control-panel h3 {
  margin-bottom: 16px;
  color: #303133;
  font-size: 16px;
}
</style>