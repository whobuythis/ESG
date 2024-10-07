
### `MonthlyEmissionsChart.vue` 수정

```vue
<template>
  <div>
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'MonthlyEmissionsChart',
  components: {
    Bar
  },
  props: {
    emissionsData: {
      type: Object,
      required: true
    }
  },
  computed: {
    chartData() {
      const labels = Object.keys(this.emissionsData);
      const data = Object.values(this.emissionsData);

      console.log('Chart Labels:', labels); // Log the labels
      console.log('Chart Data:', data); // Log the data

      return {
        labels: labels,
        datasets: [
          {
            label: 'Monthly Emissions (tCO₂e)',
            backgroundColor: '#42A5F5',
            data: data
          }
        ]
      }
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    }
  }
}
</script>
