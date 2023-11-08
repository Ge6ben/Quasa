<script lang="ts" setup>
import 'chartjs-adapter-date-fns';
import { ChartOptions } from 'chart.js';
import { computed, ref } from 'vue';
import { IAmazonHistoricalTrend } from 'src/components/models';
import ChartComponent from 'components/ChartComponent.vue';

const getChartOpts = computed<ChartOptions>(() => {
  return {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'bottom',
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
        // min: getPrices?.value[0],
        // max: getPrices.value[getPrices.value.length - 1],
        stacked: true,
        beginAtZero: true,
        border: {
          dash: [5, 5],
        },
      },
      y2: {
        position: 'right',

        // min: receivedData.datasets.map.reduce((a, b) => Math.min(a, b)),
        // max: new Date(receivedData.labels[receivedData.labels.length - 1]).getTime(),
        stacked: true,
        beginAtZero: true,
        border: {
          dash: [5, 5],
        },
      },
      x: {
        display: true,
        // min: new Date(getFirstChartData?.value?.labels[0]).getTime(),
        // max: new Date(getFirstChartData.value.labels[getFirstChartData.value.labels.length - 1]).getTime(),
        type: 'time',
        grid: {
          display: false,
        },
        date: {
          displayFormats: {
            quarter: 'MMM YY',
          },
        },
      },
    },
  };
});

let chartData = ref<IAmazonHistoricalTrend>();
const getFirstChartData = computed(() => {
  return {
    lables: [15, 10, 15],
    datasets: [
      {
        type: 'line',
        label: 'item 1',
        stepped: true,
        fill: false,
        borderColor: "'#6B6BF7'",
        backgroundColor: '#6B6BF7',
        data: [10, 20, 30],
        tension: 0.4,
      },
      {
        type: 'line',
        label: 'item 2',
        stepped: true,
        fill: false,
        borderColor: "'#FFD231'",
        backgroundColor: '#FFD231',
        data: [4, 8, 12],
        tension: 0.4,
      },
    ],
  };
});
</script>

<template>
  <q-card bordered flat>
    <chart-component
      :chart-data="getFirstChartData"
      :chart-options="getChartOpts"
    />
  </q-card>
</template>
