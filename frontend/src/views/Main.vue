<template>
  <div id="main">
    <h1>메인화면</h1>
    <div id="signBtn">
      <button @click="() => $router.push('/login')">로그인</button>
      <button @click="() => $router.push('/register')">회원가입</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Main",
};
</script>

<style scoped>
h1 {
  margin: 0 auto;
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translate(-25%, -50%);
}
#signBtn {
  margin: 0 auto;
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-35%, -50%);
}
#signBtn button {
  width: 80px;
  height: 60px;
  margin: 10px;
}
#signBtn button:hover {
  background-color: gray;
}
</style>
