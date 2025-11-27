<template>
  <div class="selector">
    <div class="selector-label">图表类型</div>
    <div class="selector-options">
      <div
        v-for="type in chartTypes"
        :key="type.value"
        class="selector-option"
        :class="{ active: selectedType === type.value }"
        @click="selectChartType(type.value)"
      >
        {{ type.label }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useChartStore } from '../store/chartStore'

const chartStore = useChartStore()
const selectedType = ref(chartStore.chartConfig.chartType)

const chartTypes = [
  { label: '柱状图', value: 'bar' },
  { label: '堆叠柱状图', value: 'stacked_bar' },
  { label: '折线图', value: 'line' },
  { label: '饼图', value: 'pie' },
  { label: '散点图', value: 'scatter' },
  { label: '雷达图', value: 'radar' }
]

const selectChartType = (type) => {
  selectedType.value = type
  chartStore.setChartType(type)
}
</script>