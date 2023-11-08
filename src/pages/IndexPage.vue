<script lang="ts" setup>
import 'chartjs-adapter-date-fns';
import { ChartOptions } from 'chart.js';
import { computed, ref } from 'vue';
import { IAmazonHistoricalTrend, ICategory } from 'src/components/models';
import ChartComponent from 'components/ChartComponent.vue';

const getPrices = ref([]);
const getLabels = ref([]);

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
        min: getPrices?.value[0],
        max: getPrices.value[getPrices.value.length - 1],
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
          // displayFormats: {
          //   quarter: 'MMM YY'
          // }
        },
      },
    },
  };
});

// Get only light colors randomly
function getRandomColor() {
  let letters = 'BCDEF'.split('');
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}

let chartData = ref<IAmazonHistoricalTrend>();
const getFirstChartData = computed(() => {
  // Add price chart
  let localData = {
    labels: [],
    datasets: [],
  };
  // In Amazon marketplace

  localData.labels = getLabels.value;
  chartData?.value?.categories?.forEach((item: ICategory) => {
    let randomColor = getRandomColor();
    let categoryDataset = {
      type: 'line',
      label: `BSR (${item.name} )`,
      stepped: true,
      fill: false,
      borderColor: randomColor,
      backgroundColor: randomColor,
      data: [{ x: 12, y: 43 }],
      tension: 0.4,
    };
    localData?.datasets.push(categoryDataset);
  });

  return localData;
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
