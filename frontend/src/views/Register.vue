<template>
  <div id="register">
    <h1>회원가입</h1>
    <p><label>ID</label>&nbsp;<input type="text" v-model="id" /></p>
    <p>
      <label>비밀번호</label>&nbsp;<input type="password" v-model="password" />
    </p>
    <p style="text-align: right"><button @click="register">가입하기</button></p>
    <hr />
    <p style="text-align: right">
      <span>이미 계정이 있다면</span>&nbsp;<button
        @click="() => $router.push('/login')"
      >
        로그인
      </button>
    </p>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Register",
  data() {
    return {
      id: "",
      password: "",
    };
  },
  methods: {
    register() {
      if (!this.id) {
        alert("아이디를 입력하세요");
        return;
      } else if (!this.password) {
        alert("비밀번호를 입력하세요");
        return;
      }
      axios
        .post("http://localhost:5000/register", {
          id: this.id,
          password: this.password,
        })
        .then((res) => {
          if (res.data.token) {
            this.$store.state.token = res.data.token;
            this.$store.state.id = res.data.id;
            this.$socket.emit("login", { id: this.$store.state.id });
            this.$router.push("/roomlist");
          } else {
            alert(res.data);
          }
        })
        .catch(() => {
          alert("회원가입 중 오류가 발생했습니다.");
        });
    },
  },
};
</script>

<style scoped>
#register {
  width: 500px;
  height: 600px;
  position: absolute;
  margin: 0 auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
p {
  font-size: 20px;
}
input {
  font-size: 20px;
}
button {
  width: 75px;
  height: 50px;
}
button:hover {
  background-color: gray;
}
</style>
