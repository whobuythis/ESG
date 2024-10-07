<template>
  <v-container>
    <v-row>
      <v-col>
        <h3>탄소배출 대시보드</h3>
        <v-card color="gradient-card-one" class="mb-4">
          <v-card-text>
            <div>
              <h3>총 배출량(tCO₂e)</h3>
              <p>{{ emissions.total }}</p>
            </div>
            <div>
              <p>Scope 1: {{ emissions.scope1 }}</p>
              <p>Scope 2: {{ emissions.scope2 }}</p>
              <p>Scope 3: {{ emissions.scope3 }}</p>
            </div>
          </v-card-text>
        </v-card>
        <v-card color="gradient-card-two">
          <v-card-text>
            <div>
              <h3>총 감축량(tCO₂e)</h3>
              <p>{{ reductions.total }}</p>
            </div>
            <div>
              <p>Scope 1: {{ reductions.scope1 }}</p>
              <p>Scope 2: {{ reductions.scope2 }}</p>
              <p>Scope 3: {{ reductions.scope3 }}</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <h3>월별 배출량</h3>
        <v-card color="white">
          <v-card-text>
            <monthly-emissions-chart :emissions-data="formattedMonthlyEmissions" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <h3>배출 및 감독원</h3>
    </v-row>
    <v-row>
      <v-tabs v-model="activeTab" color="#2926B4">
        <v-tab>All Transactions</v-tab>
        <v-tab>주요 배출원</v-tab>
        <v-tab>주요 감축 솔루션</v-tab>
      </v-tabs>
    </v-row>
    <v-row>
      <v-data-table v-if="activeTab === 0" :headers="headers" :items="transactions">
        <template v-slot:item.amount="{ item }">
          <span :class="{'text--red': item.amount > 0, 'text--green': item.amount < 0}">
            {{ item.amount }}
          </span>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn icon @click="download(item.id)">
            <v-icon>mdi-download</v-icon>
          </v-btn>
        </template>
      </v-data-table>
      <v-data-table v-else-if="activeTab === 1" :headers="headers" :items="emissionSources">
        <template v-slot:item.amount="{ item }">
          <span :class="{'text--red': item.amount > 0, 'text--green': item.amount < 0}">
            {{ item.amount }}
          </span>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn icon @click="download(item.id)">
            <v-icon>mdi-download</v-icon>
          </v-btn>
        </template>
      </v-data-table>
      <v-data-table v-else-if="activeTab === 2" :headers="headers" :items="reductionSolutions">
        <template v-slot:item.amount="{ item }">
          <span :class="{'text--red': item.amount > 0, 'text--green': item.amount < 0}">
            {{ item.amount }}
          </span>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn icon @click="download(item.id)">
            <v-icon>mdi-download</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-row>
  </v-container>
</template>


<script>
import axios from 'axios';
import firebase from 'firebase/app';
import 'firebase/auth';
import MonthlyEmissionsChart from './MonthlyEmissionsChart.vue';

export default {
  components: {
    MonthlyEmissionsChart
  },
  data() {
    return {
      activeTab: 0,
      headers: [
        { text: 'Description', value: 'description' },
        { text: 'Transaction ID', value: 'transaction_id' },
        { text: 'Type', value: 'type' },
        { text: 'Date', value: 'date' },
        { text: 'Amount', value: 'amount' },
        { text: '상세 데이터', value: 'actions', sortable: false },
      ],
      transactions: [],
      emissionSources: [],
      reductionSolutions: [],
      emissions: {
        total: 0,
        scope1: 0,
        scope2: 0,
        scope3: 10778.55
      },
      reductions: {
        total: 0,
        scope1: 0,
        scope2: 0,
        scope3: 0
      },
      monthlyEmissions: []
    }
  },
  computed: {
    formattedMonthlyEmissions() {
      if (this.monthlyEmissions.length === 0) return {};
      const data = this.monthlyEmissions[0]; // Assuming the first entry is for the required year
      return {
        Jan: data.jan,
        Feb: data.feb,
        Mar: data.mar,
        Apr: data.apr,
        May: data.may,
        Jun: data.jun,
        Jul: data.jul,
        Aug: data.aug,
        Sep: data.sep,
        Oct: data.oct,
        Nov: data.nov,
        Dec: data.decm
      };
    }
  },
  async created() {
    await this.fetchData(); // Fetch data when the component is created
  },
  methods: {
    async getToken() {
      const user = firebase.auth().currentUser;
      if (user) {
        try {
          const token = await user.getIdToken();
          console.log('Firebase ID Token:', token); // Log the token to the console
          return token;
        } catch (error) {
          console.error('Error fetching token:', error);
          return null;
        }
      } else {
        console.log('No user is signed in');
        return null;
      }
    },
    async fetchData() {
      const token = await this.getToken();
      if (!token) return;

      await this.fetchScopeEmissionData(token); // Fetch scope emission data
      await this.fetchScopeReductionData(token); // Fetch scope reduction data
      await this.fetchEmissionsData(token); // Fetch monthly emissions data
      await this.fetchTransactions(token); // Fetch all transactions
      await this.fetchEmissionSources(token); // Fetch main emission sources
      await this.fetchReductionSolutions(token); // Fetch main reduction solutions
    },

    async fetchScopeEmissionData(token) {
      try {
        const scope1Response = await axios.get('http://localhost:8080/api/dashboard/calculateTotalScope1/243', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const scope1Data = scope1Response.data;
        console.log('Scope 1 Emissions Data:', scope1Data);

        const scope2Response = await axios.get('http://localhost:8080/api/dashboard/calculateTotalScope2/243', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const scope2Data = scope2Response.data;
        console.log('Scope 2 Emissions Data:', scope2Data);

        this.emissions.scope1 = scope1Data;
        this.emissions.scope2 = scope2Data;
        this.emissions.total = scope1Data + scope2Data;
        console.log('Updated Emissions Data:', this.emissions);
      } catch (error) {
        console.error('There was an error fetching emissions data!', error);
      }
    },

    async fetchScopeReductionData(token) {
      try {
        const scope1Response = await axios.get('http://localhost:8080/api/dashboard/calculateScope1Reduction/243/2023/2024', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const scope1Data = scope1Response.data;
        console.log('Scope 1 Reduction Data:', scope1Data);

        const scope2Response = await axios.get('http://localhost:8080/api/dashboard/calculateScope2Reduction/243/2023/2024', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const scope2Data = scope2Response.data;
        console.log('Scope 2 Reduction Data:', scope2Data);

        this.reductions.scope1 = scope1Data;
        this.reductions.scope2 = scope2Data;
        this.reductions.total = scope1Data + scope2Data;
        console.log('Updated Reductions Data:', this.reductions);
      } catch (error) {
        console.error('There was an error fetching reductions data!', error);
      }
    },

    async fetchEmissionsData(token) {
      try {
        const response = await axios.get('http://localhost:8080/api/dashboard/monthlyEmissions/243/2023', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Monthly Data:', response.data); // Log the fetched data to the console
        this.monthlyEmissions = response.data; // Set the data
      } catch (error) {
        console.error('There was an error fetching Monthly Data!', error);
      }
    },

    fetchTransactions(token) {
      axios.get('http://localhost:8080/api/dashboard?companyId=243', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          console.log('Transactions Data:', response.data); // Log the fetched data to the console
          this.transactions = response.data;
        })
        .catch(error => {
          console.error('There was an error fetching transactions!', error);
        });
    },
    fetchEmissionSources(token) {
      axios.get('http://localhost:8080/api/dashboard/getemissions/243', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          console.log('Emission Sources Data:', response.data); // Log the fetched data to the console
          this.emissionSources = response.data;
        })
        .catch(error => {
          console.error('There was an error fetching emission sources!', error);
        });
    },
    fetchReductionSolutions(token) {
      axios.get('http://localhost:8080/api/dashboard/getreduces/243', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          console.log('Reduction Solutions Data:', response.data); // Log the fetched data to the console
          this.reductionSolutions = response.data;
        })
        .catch(error => {
          console.error('There was an error fetching reduction solutions!', error);
        });
    },
    download(id) {
      console.log(`Download item with id: ${id}`);
    }
  }
};
</script>


<style>
.gradient-card-one {
  background: linear-gradient(125deg, #ee0979, #e100ff, #2d0af0);
  color: white;
}

.gradient-card-two {
  background: linear-gradient(125deg, #31e77d, #96c93d, #2d0af0);
  color: white;
}

.mb-4 {
  margin-bottom: 1rem;
}
</style>
