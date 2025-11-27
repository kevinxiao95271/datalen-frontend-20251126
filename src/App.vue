<template>
  <div class="app">
    <header class="app-header">
      <h1>DataLen BI</h1>
    </header>
    <main class="app-main">
      <ControlPanel />
      <div class="chart-container">
        <ChartComponent />
      </div>
    </main>
  </div>
</template>

<script setup>
import ControlPanel from './components/ControlPanel.vue'
import ChartComponent from './components/ChartComponent.vue'
</script>

<style scoped>
.app {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background-color: #409eff;
  color: white;
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.chart-container {
  flex: 1;
  padding: 20px;
  background-color: #f5f7fa;
  overflow: auto;
}
</style>