<template>
  <div class="selector">
    <div class="selector-label">维度选择</div>
    <div class="selector-options">
      <div
        v-for="dimension in dimensions"
        :key="dimension"
        class="selector-option"
        :class="{ active: chartStore.chartConfig.dimensions.includes(dimension) }"
        @click="toggleDimension(dimension)"
      >
        {{ dimension }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useChartStore } from '../store/chartStore'
import { apiService } from '../services/APIService'

const chartStore = useChartStore()
const dimensions = ref([])

// 根据数据集ID获取维度列表
const fetchDimensions = async () => {
  try {
    const datasetId = chartStore.chartConfig.datasetId
    // 实际项目中应从API获取维度列表，这里根据不同数据集返回不同的维度
    let dimensionList = []
    
    // 根据不同数据集返回不同的维度列表
    switch (datasetId) {
      case 'ds_sales_001':
        dimensionList = ['region', 'month', 'product', 'category', 'channel']
        break
      case 'ds_user_001':
        dimensionList = ['age', 'gender', 'city', 'province', 'registration_date']
        break
      case 'ds_product_001':
        dimensionList = ['category', 'brand', 'price_range', 'stock_status', 'launch_date']
        break
      default:
        dimensionList = ['default_dimension']
    }
    
    dimensions.value = dimensionList
    
    // 当切换数据集时，清空当前选中的维度，因为不同数据集的维度可能不同
    chartStore.chartConfig.dimensions = []
  } catch (error) {
    console.error('获取维度列表失败:', error)
  }
}

const toggleDimension = (dimension) => {
  const index = chartStore.chartConfig.dimensions.indexOf(dimension)
  if (index > -1) {
    chartStore.removeDimension(dimension)
  } else {
    chartStore.addDimension(dimension)
  }
}

// 监听数据集ID变化，重新获取维度列表
watch(
  () => chartStore.chartConfig.datasetId,
  () => {
    fetchDimensions()
  }
)

onMounted(() => {
  fetchDimensions()
})
</script>