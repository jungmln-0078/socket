<template>
  <div id="rooms">
    <button @click="refresh" v-show="!roompopup">새로고침</button>
    <div v-show="roompopup">
      <label>방 이름</label><input type="text" v-model="roominput.name" />
      <label>인원수</label
      ><select v-model="roominput.maxuser">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4" selected>4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
      </select>
    </div>
    <div
      v-show="!roompopup"
      id="room"
      v-for="(r, idx) in rooms"
      @click="
        () => {
          $router.push(`/chatroom/${r.id}`);
        }
      "
      :key="idx"
    >
      <h3>{{ r.name }}</h3>
      <span>{{ r.curuser + "/" + r.maxuser }}</span>
    </div>
    <button @click="createroom">방만들기</button
    ><button
      v-show="this.roompopup"
      @click="
        () => {
          this.roompopup = false;
        }
      "
    >
      취소
    </button>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Rooms",
  data() {
    return {
      rooms: [],
      roompopup: false,
      roominput: {
        name: "",
        maxuser: 4,
      },
    };
  },
  methods: {
    createroom() {
      if (!this.roompopup) {
        this.roompopup = !this.roompopup;
      } else {
        this.$socket.emit("room_create", this.roominput);
        this.$forceUpdate();
      }
    },
    refresh() {
      axios
        .get("http://localhost:5000/rooms", {
          headers: { "auth-token": this.$store.state.token },
        })
        .then((res) => {
          if (res.data == "로그인이 필요합니다.") {
            alert("로그인이 필요합니다.");
            this.$router.push("/login");
          }
          this.$store.state.rooms = res.data;
          this.rooms = res.data;
        });
    },
  },
  created() {
    this.$socket.on("room_create", (data) => {
      this.$router.push(`/chatroom/${data}`);
    });
  },
  mounted() {
    axios
      .get("http://localhost:5000/rooms", {
        headers: { "auth-token": this.$store.state.token },
      })
      .then((res) => {
        if (res.data == "로그인이 필요합니다.") {
          alert("로그인이 필요합니다.");
          this.$router.push("/login");
        }
        this.$store.state.rooms = res.data;
        this.rooms = res.data;
      });
  },
};
</script>

<style>
#rooms {
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -25%);
  width: 1200px;
  height: 400px;
  display: flexbox;
  justify-content: space-around;
  flex-direction: unset;
}
#room {
  display: flex;
  flex: 1;
  width: 250px;
  height: 100px;
  float: left;
  border: 1px solid black;
  border-collapse: collapse;
}
#room:hover {
  background-color: rgb(154, 188, 189);
  cursor: pointer;
}
</style>
