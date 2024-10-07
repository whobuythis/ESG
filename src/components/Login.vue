<template>
  <v-container fluid>
    <v-row>
      <v-col cols="6" class="left-section">
        <v-img :src="require('@/assets/esglogo.svg')" alt="ESG Solutions Logo" class="logo"></v-img>
      </v-col>
      <v-col cols="6" class="right-section">
        <div class="login-form">
          <h1>로그인</h1>
          <v-text-field
            v-model="email"
            prepend-inner-icon="mdi-account-circle"
            label="이메일을 입력해주세요."
            outlined
            dense
          ></v-text-field>
          <v-text-field
            v-model="password"
            prepend-inner-icon="mdi-lock"
            label="비밀번호를 입력해주세요."
            type="password"
            outlined
            dense
          ></v-text-field>
          <v-btn color="#2926B4" block @click="login" dark>로그인</v-btn>
          <p>
            계정이 없으신가요?
            <router-link to="/signup">회원가입</router-link>
          </p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    login() {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then((userCredential) => {
          userCredential.user.getIdToken().then((token) => {
            console.log('Firebase ID Token:', token); // 콘솔에 토큰 출력
            alert('로그인 완료!');
            localStorage.setItem('isLoggedIn', 'true');
            this.$router.push('/'); // 대시보드나 홈 페이지로 리디렉션
          });
        })
        .catch((err) => {
          alert('에러 : ' + err.message);
        });
    },
    checkUserStatus() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          console.log('User is signed in:', user);
          // 이미 로그인된 사용자의 상태를 처리
        } else {
          console.log('No user is signed in');
        }
      });
    }
  },
  created() {
    this.checkUserStatus();
  }
};
</script>


<style scoped>
.left-section {
  background-color: #2926B4;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.right-section {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
}

.logo {
  width: 60%;
}

.login-form {
  width: 80%;
  max-width: 400px;
  text-align: center;
}

.login-form h1 {
  margin-bottom: 30px;
  color: #2926B4;
}

.login-form p {
  margin-top: 20px;
}
</style>
