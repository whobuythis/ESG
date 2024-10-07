<template>
  <v-container>
    <br>
    <h3>활성 배출원 Overview</h3>
    <br>
    <v-tabs v-model="tab" color="#2926B4">
      <v-tab key="one">Scope1</v-tab>
      <v-tab key="two">Scope2</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item key="one">
        <v-row class="mb-4">
          <v-col
              v-for="item in scope1Options"
              :key="item.value"
              cols="auto"
              class="px-2"
          >
            <v-btn
                :value="item.value"
                @click="onScopeOptionClick(item.value)"
                :color="toggle === item.value ? '#2926B4' : 'default'"
                class="mx-2 my-1"
                dark
            >
              <v-icon left>{{ item.icon }}</v-icon>{{ item.text }}
            </v-btn>
          </v-col>
        </v-row>
        <br>
        <v-data-table :headers="headers" :items="recordsScope1"></v-data-table>
      </v-tab-item>
      <v-tab-item key="two">
        <v-row class="mb-4">
          <v-col
              v-for="item in scope2Options"
              :key="item.value"
              cols="auto"
              class="px-2"
          >
            <v-btn
                :value="item.value"
                @click="onScopeOptionClick(item.value)"
                :color="toggle === item.value ? '#2926B4' : 'default'"
                class="mx-2 my-1"
                dark
            >
              <v-icon left>{{ item.icon }}</v-icon>{{ item.text }}
            </v-btn>
          </v-col>
        </v-row>
        <br>
        <v-data-table :headers="headers2" :items="filteredRecordsScope2"></v-data-table>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import axios from 'axios';
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  data() {
    return {
      tab: 'one',
      toggle: null,
      selectedScopeOption: null,
      recordsScope1: [],
      recordsScope2: [],
      headers: [
        { text: '번호', value: 'number' },
        { text: '배출원명', value: 'source' },
        { text: '연료', value: 'fuel' },
        { text: '연도', value: 'year'},
        { text: '1월', value: 'jan' },
        { text: '2월', value: 'feb' },
        { text: '3월', value: 'mar' },
        { text: '4월', value: 'apr' },
        { text: '5월', value: 'may' },
        { text: '6월', value: 'jun' },
        { text: '7월', value: 'jul' },
        { text: '8월', value: 'aug' },
        { text: '9월', value: 'sep' },
        { text: '10월', value: 'oct' },
        { text: '11월', value: 'nov' },
        { text: '12월', value: 'dec' },
      ],
      headers2: [
        { text: '번호', value: 'number' },
        { text: '배출원명', value: 'source' },
        { text: '요금제', value: 'tariff' },
        { text: '계약전력', value: 'contractedPower' },
        { text: '연도', value: 'year'},
        { text: '1월', value: 'jan' },
        { text: '2월', value: 'feb' },
        { text: '3월', value: 'mar' },
        { text: '4월', value: 'apr' },
        { text: '5월', value: 'may' },
        { text: '6월', value: 'jun' },
        { text: '7월', value: 'jul' },
        { text: '8월', value: 'aug' },
        { text: '9월', value: 'sep' },
        { text: '10월', value: 'oct' },
        { text: '11월', value: 'nov' },
        { text: '12월', value: 'dec' },
      ],
      scope1Options: [
        { text: '이동연소', value: '이동연소', icon: 'mdi-car' },
        { text: '고정연소', value: '고정연소', icon: 'mdi-cog' },
        { text: '공정배출', value: '공정배출', icon: 'mdi-recycle' },
        { text: '탈루배출', value: '탈루배출', icon: 'mdi-cloud-upload' },
        { text: '폐기물', value: '폐기물', icon: 'mdi-trash-can' },
      ],
      scope2Options: [
        { text: '전력사용', value: '전력사용', icon: 'mdi-lightning-bolt-circle' },
      ],
      isLoading: false
    };
  },
  computed: {
    filteredRecordsScope1() {
      return this.toggle
          ? this.recordsScope1.filter(record => record.scopeOptions === this.toggle)
          : this.recordsScope1;
    },
    filteredRecordsScope2() {
      return this.recordsScope2;
    }
  },
  mounted() {
    this.checkUserAndFetchData();
  },
  methods: {
    async getToken() {
      try {
        const user = firebase.auth().currentUser;
        if (user) {
          const token = await user.getIdToken(true);
          return token;
        } else {
          console.error('User not authenticated');
          return null;
        }
      } catch (error) {
        console.error('Error fetching token:', error);
        return null;
      }
    },
    async fetchRecordsScope1() {
      const token = await this.getToken();
      if (!token) return;

      try {
        console.log(this.selectedScopeOption, 123124);
        const response = await axios.get('http://localhost:8080/api/scope1/records', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            scope1Option: this.selectedScopeOption
          }
        });
        console.log(response.data.data, "111");
        this.recordsScope1 = response.data.data.map((item, index) => {
          return {
            ...item,
            number: index + 1
          };
        });
      } catch (error) {
        console.error('Error fetching Scope1 records:', error);
      }
    },
    async fetchRecordsScope2() {
      const token = await this.getToken();
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:8080/api/scope2/records', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.recordsScope2 = response.data.data.map((item, index) => {
          return {
            ...item,
            number: index + 1
          };
        });
      } catch (error) {
        console.error('Error fetching Scope2 records:', error);
      }
    },
    onScopeOptionClick(value) {
      this.toggle = value;
      this.selectedScopeOption = value;
      this.fetchRecordsScope1();
    },
    checkUserAndFetchData() {
      this.isLoading = true;
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          await this.fetchRecordsScope1();
          await this.fetchRecordsScope2();
        } else {
          console.error('No user signed in');
          this.$router.push('/login');
        }
        this.isLoading = false;
      });
    }
  }
};
</script>

<style>
.v-btn {
  margin: 0 8px 8px 0;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>
