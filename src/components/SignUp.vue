<template>
  <div class="sign-up">
    <p class="title">회원가입</p>
    <input v-model="email" type="text" placeholder="이메일을 입력하세요."><br>
    <input v-model="password" type="password" placeholder="비밀번호를 입력하세요"><br>
    <input v-model="confirmPassword" type="password" placeholder="비밀번호를 한 번 더 입력하세요"><br>
    <h3 class="subtitle">회사 정보</h3>
    <input v-model="companyName" type="text" placeholder="회사명을 입력하세요."><br>
    <div class="manager-info">
      <input v-model="managerName" type="text" placeholder="담당자 성함">
      <input v-model="managerContact" type="text" placeholder="담당자 연락처">
    </div>
    <input v-model="department" type="text" placeholder="부서명을 입력해주세요."><br>
    <input v-model="businessField" type="text" placeholder="사업분야"><br>

    <div class="export-status">
      <h4 class="subtitle">수출기업 여부</h4>
      <button @click="setExportStatus(true)">수출기업</button>
      <button @click="setExportStatus(false)">비수출기업</button>
    </div>
    <br>
    <button @click="signUp">
      회원가입
    </button>
    <span>또는 <router-link to="/login">로그인</router-link>으로 돌아가기</span>
  </div>
</template>

<script>
import axios from 'axios';
import firebase from 'firebase';

export default {
  name: 'SignUp',
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      managerName: '',
      managerContact: '',
      department: '',
      businessField: '',
      isExporter: false
    }
  },
  methods: {
    setExportStatus(status) {
      this.isExporter = status;
    },
    async signUp() {
      if (this.password !== this.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
      try {
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(this.email, this.password);
        const token = await userCredential.user.getIdToken();

        const userInfo = {
          companyName: this.companyName,
          managerName: this.managerName,
          managerPhone: this.managerContact,
          department: this.department,
          subjects: [this.businessField],
          isExport: this.isExporter ? 1 : 0
        };

        const response = await axios.post('http://localhost:8080/api/user/signUp', userInfo, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.returnCode === '200') {
          alert('회원가입 완료!');
          await this.$router.push('/login'); // 회원가입 완료 후 /login으로 리다이렉션
        } else {
          alert('회원가입 실패: ' + response.data.returnCode);
        }
      } catch (error) {
        alert('에러: ' + error.message);
      }
    }
  }
}

</script>

<style scoped>
.sign-up {
  width: 100%;
  max-width: 500px;
  background: #fff;
  padding: 20px;
  box-sizing: border-box;
  margin: 40px auto;
  border-radius: 8px;
}

.sign-up .title {
  font-size: 24px;
  color: #2926B4;
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
}

.sign-up .subtitle {
  font-size: 18px;
  color: #2926B4;
  margin-bottom: 10px;
}

.sign-up input[type="text"],
.sign-up input[type="password"],
.sign-up input[type="email"],
.sign-up button {
  width: calc(100% - 40px);
  padding: 15px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.sign-up button {
  background-color: #2926B4;
  color: white;
  border: none;
  font-size: 18px;
  font-weight: bold;
}

.sign-up span {
  font-size: 16px;
  color: #888;
  display: block;
  text-align: center;
  margin-top: 20px;
}

.sign-up router-link {
  color: #446CB3;
  text-decoration: none;
}

.sign-up router-link:hover {
  text-decoration: underline;
}

.sign-up .manager-info {
  display: flex;
  
  gap: 40px; /* Adjusted gap */
}

.sign-up .manager-info input {
  width: calc(50% - 40px); /* Reduced width */
}

.sign-up .export-status {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.sign-up .export-status h4 {
  margin: 0;
  margin-right: 10px;
}

.sign-up .export-status button {
  padding: 10px 20px;
  margin-right: 10px;
  font-size: 14px;
  width: auto;
}

.sign-up button:not(:focus) {
  opacity: 0.7;
}
</style>
