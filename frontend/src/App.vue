<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  created() {
    this.$socket.on("logout", () => {
      alert("중복 로그인으로 로그아웃합니다.");
      this.$store.state.id = "";
      this.$store.state.token = "";
      this.$router.push("/login");
    });
  },
};
</script>

<style></style>
