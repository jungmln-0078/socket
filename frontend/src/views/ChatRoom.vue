<template>
  <div class="chat">
    <h1>채팅방</h1>
    <p>방이름 : {{ room.name }}</p>
    <span v-html="msgHistory" />
    <div id="msgInput">
      <input type="text" v-model="message" />
      <button @click="sendMessage">전송</button>
      <button @click="leaveRoom">방 나가기</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ChatRoom",
  created() {
    this.$socket.on("chat", (returnMsg) => {
      this.msgHistory += `<p>${returnMsg.talker} : ${returnMsg.message}</p>`;
    });
    this.$socket.on("system", (returnMsg) => {
      this.msgHistory += `<p>${returnMsg}</p>`;
    });
    this.$socket.on("join_reject", async (msg) => {
      if (this.$store.state.token) {
        this.joinerr = true;
        await this.$router.replace("/roomlist");
        alert(msg);
      }
    });
  },
  mounted() {
    if (this.$route.params.id) {
      this.$socket.emit("room_join", {
        id: this.$route.params.id,
        userid: this.$store.state.id,
      });
      axios
        .get(`http://localhost:5000/rooms/${this.$route.params.id}`, {
          headers: { "auth-token": this.$store.state.token },
        })
        .then((res) => {
          if (res.data == "로그인이 필요합니다.") {
            alert("로그인이 필요합니다.");
            this.$router.replace("/login");
          }
          this.room = res.data;
        });
    }
  },
  destroyed() {
    if (!this.joinerr) {
      this.$socket.emit("room_leave", {
        id: this.room.id,
        userid: this.$store.state.id,
      });
    }
  },
  data() {
    return {
      message: "",
      msgHistory: "",
      room: {},
      joinerr: false,
    };
  },
  methods: {
    sendMessage() {
      if (!this.$store.state.token) {
        alert("로그인이 필요합니다");
        this.$router.replace("/login");
        return;
      }
      if (!this.message) return;
      this.$socket.emit("chat", {
        talker: this.$store.state.id,
        message: this.message,
        room: this.room.id,
      });
      this.message = "";
    },
    leaveRoom() {
      this.$router.replace("/roomlist");
    },
  },
};
</script>
<style scoped>
button:hover {
  background-color: gray;
}
</style>
