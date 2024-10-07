# frontend

# 백엔드 API 데이터 호출
script 태그안에 .get()  ()안에 백엔드 api 데이터 주소 값을 넣어주면 데이터 표시 가능.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
# Response.vue 파일 설명
Spring boot 연동 및 api 호출 테스트를 위한 페이지(컴포넌트)임.
script에 fetchData()가 axios를 활용한 spring boot 연동호출 함수이다.

# firebase 오류 사항
현재 버전 8.10.0 임. github에서 클론이나 수동으로 zip파일 다운로드해서 run dev시 오류 발생해서 "8.10.0"으로 다운그레이드 함.
최신 버전으로 설치시 
npm uninstall firebase
npm install firebase 

# axios 설치 
axios 현재 버전은 오류 발생
npm install axios @0.25.0 --save
axios 0.25.0 버전 사용해야 오류발생이 없음.
보안 문제 발생시 axios 버전 업데이트 예정.

# 포트 변경
/config/index.js 에서 dev: { ...port: ... } 에 원하는 구동 port 변경 가능 
현재 8070로 설정

# npm run dev 후 login, signup, response 들어가는 방법

https://localhost:8070 으로 접속되었을때 주소창에 8070옆에 (로그인으로 가고싶으면) /login 입력해주고 enter시 접속 가능
이 외 회원가입이나 response도 동일하게 /signup /response 입력해서 접속하면 됨.

