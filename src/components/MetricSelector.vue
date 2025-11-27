<template>
  <div class="selector">
    <div class="selector-label">指标选择</div>
    <div class="selector-options">
      <div
        v-for="metric in metrics"
        :key="metric.code"
        class="selector-option"
        :class="{ active: isMetricSelected(metric.code) }"
        @click="toggleMetric(metric)"
      >
        {{ metric.name || metric.code }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useChartStore } from '../store/chartStore'
import { apiService } from '../services/APIService'

const chartStore = useChartStore()
const metrics = ref([])

// 根据数据集ID获取指标列表
const fetchMetrics = async () => {
  try {
    const datasetId = chartStore.chartConfig.datasetId
    // 实际项目中应从API获取指标列表，这里根据不同数据集返回不同的指标
    let metricList = []
    
    // 根据不同数据集返回不同的指标列表
    switch (datasetId) {
      case 'ds_sales_001':
        metricList = [
          { code: 'total_sales', name: '销售额' },
          { code: 'order_count', name: '订单数' },
          { code: 'customer_count', name: '客户数' },
          { code: 'avg_order_value', name: '客单价' }
        ]
        break
      case 'ds_user_001':
        metricList = [
          { code: 'user_count', name: '用户数' },
          { code: 'active_users', name: '活跃用户数' },
          { code: 'new_users', name: '新增用户数' },
          { code: 'retention_rate', name: '留存率' }
        ]
        break
      case 'ds_product_001':
        metricList = [
          { code: 'product_count', name: '产品数' },
          { code: 'stock_quantity', name: '库存数量' },
          { code: 'sales_volume', name: '销量' },
          { code: 'avg_price', name: '平均价格' }
        ]
        break
      default:
        metricList = [
          { code: 'default_metric', name: '默认指标' }
        ]
    }
    
    metrics.value = metricList
    
    // 当切换数据集时，清空当前选中的指标，因为不同数据集的指标可能不同
    chartStore.chartConfig.metrics = []
  } catch (error) {
    console.error('获取指标列表失败:', error)
  }
}

const isMetricSelected = (code) => {
  return chartStore.chartConfig.metrics.some(metric => metric.code === code)
}

const toggleMetric = (metric) => {
  if (isMetricSelected(metric.code)) {
    chartStore.removeMetric(metric.code)
  } else {
    chartStore.addMetric({
      code: metric.code,
      alias: metric.name || metric.code
    })
  }
}

// 监听数据集ID变化，重新获取指标列表
watch(
  () => chartStore.chartConfig.datasetId,
  () => {
    fetchMetrics()
  }
)

onMounted(() => {
  fetchMetrics()
})
</script>