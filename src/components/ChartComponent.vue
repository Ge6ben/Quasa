<script lang="ts" setup>
import { computed } from 'vue';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { LineChart as Line } from 'vue-chart-3';

// Register the necessary Chart.js components
Chart.register(...registerables);

export interface Props {
  chartData: ChartData;
  chartOptions: ChartOptions;
}

const props = withDefaults(defineProps<Props>(), {
  // Data
  chartData: {
    labels: [''],
    datasets: [
      {
        type: 'line',
        label: '',
        backgroundColor: 'rgba(0, 0, 0, 0.12)',
        barPercentage: 0.2,
        borderRadius: 200,
        borderSkipped: 'top',
        data: [0],
      },
    ],
  },
  // Options
  chartOptions: {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'right', // Set the legend position to 'right',
        align: 'between',
        labels: {
          usePointStyle: true, // Use the same point style for the legend symbol as the line chart
          boxWidth: 12,
          boxHeight: 8,
          font: {
            family: 'Inter',
          },
        },
      },
    },
    scales: {
      y: {
        display: true,
        stacked: true,
        beginAtZero: true,
        border: {
          dash: [5, 5],
        },
      },
      x: {
        display: false,
      },
    },
  },
});
const getChartOpts = computed<ChartOptions>(() => props.chartOptions);
const receivedData = computed<ChartData>(() => props.chartData);
</script>

<template>
  <div class="q-pa-lg">
    <Line :chartData="receivedData" :options="getChartOpts" />
    <div id="NoData"></div>
  </div>
</template>
