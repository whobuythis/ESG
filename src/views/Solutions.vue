<template>
  <v-container>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <span>Paid</span>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-data-table :headers="headers" :items="formattedPaidItems" class="elevation-1">
            <template v-slot:item.image="{ item }">
              <v-img :src="item.image" max-width="75" max-height="75"></v-img>
            </template>
            <template v-slot:footer>
              <tr>
                <td colspan="2" class="text-right">합계(참여자/NET-ZERO)</td>
                <td>{{ totalPaidParticipation }}</td>
                <td>{{ totalPaidNetZero }}</td>
                <td></td>
              </tr>
            </template>
          </v-data-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <br>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <span>Unpaid</span>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-data-table :headers="headers" :items="formattedUnpaidItems" class="elevation-1">
            <template v-slot:item.image="{ item }">
              <v-img :src="item.image" max-width="75" max-height="75"></v-img>
            </template>
            <template v-slot:footer>
              <tr>
                <td colspan="2" class="text-right">합계(참여자/NET-ZERO)</td>
                <td>{{ totalUnpaidParticipation }}</td>
                <td>{{ totalUnpaidNetZero }}</td>
                <td></td>
              </tr>
            </template>
          </v-data-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
import axios from 'axios';
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  data() {
    return {
      headers: [
        { text: 'Image', value: 'image' },
        { text: '회사명', value: 'companyName' },
        { text: '참여자 수', value: 'memberNum' },
        { text: 'NET-ZERO Point', value: 'netZeroPoint' },
        { text: '운영기간', value: 'period' },
      ],
      paidItems: [],
      unpaidItems: [],
    };
  },
  computed: {
    formattedPaidItems() {
      return this.paidItems.map(item => ({
        ...item,
        image: item.company.image,
        companyName: item.company.companyName,
        memberNum: item.company.memberNum,
        netZeroPoint: item.company.netZeroPoint,
        period: item.company.period
      }));
    },
    formattedUnpaidItems() {
      return this.unpaidItems.map(item => ({
        ...item,
        image: item.company.image,
        companyName: item.company.companyName,
        memberNum: item.company.memberNum,
        netZeroPoint: item.company.netZeroPoint,
        period: item.company.period
      }));
    },
    totalPaidParticipation() {
      return this.formattedPaidItems.reduce((sum, item) => sum + item.memberNum, 0);
    },
    totalPaidNetZero() {
      return this.formattedPaidItems.reduce((sum, item) => sum + item.netZeroPoint, 0);
    },
    totalUnpaidParticipation() {
      return this.formattedUnpaidItems.reduce((sum, item) => sum + item.memberNum, 0);
    },
    totalUnpaidNetZero() {
      return this.formattedUnpaidItems.reduce((sum, item) => sum + item.netZeroPoint, 0);
    },
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
          this.$router.push('/login'); // 로그인 페이지로 리디렉션
          return null;
        }
      } catch (error) {
        console.error('Error fetching token:', error);
        return null;
      }
    },
    async fetchData(token) {
      try {
        const [paidResponse, unpaidResponse] = await Promise.all([
          axios.get('/api/solution/paid/1', {  // 수정된 경로
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          axios.get('/api/solution/paid/0', {  // 수정된 경로
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        ]);
        console.log(paidResponse.data, 111);
        console.log(unpaidResponse.data, 222);
        this.paidItems = paidResponse.data;
        this.unpaidItems = unpaidResponse.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    checkUserAndFetchData() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          user.getIdToken(true).then((token) => {
            this.fetchData(token);
          }).catch((error) => {
            console.error('Error fetching token:', error);
            this.$router.push('/login'); // 로그인 페이지로 리디렉션
          });
        } else {
          console.error('No user signed in');
          this.$router.push('/login'); // 로그인 페이지로 리디렉션
        }
      });
    }
  }
};
</script>

<style scoped>
.elevation-1 {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

td[colspan="2"] {
  padding-right: 16px;
}

td:not([colspan="2"]) {
  padding-left: 16px;
}
</style>
