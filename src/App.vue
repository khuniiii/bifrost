<template>
  <v-app>
    <v-app-bar clipped-left app color="#9186ff" dark src="">
      <template v-slot:img="{ props }">
        <v-img v-bind="props"></v-img>
      </template>

      <v-toolbar-title @click="tabs = 0">BIFROST</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">
            <v-icon class="mr-1">mdi-account-circle</v-icon>
            <span v-if="$store.state.account" v-text="$store.state.account.name" />
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-if="$store.state.account && $store.state.account.id"
            @click="logout"
          >
            <v-icon color="red" class="mr-1">mdi-logout-variant</v-icon>
            로그아웃
          </v-list-item>
          <div v-else>
            <v-list-item @click="(type = 'Login'), (dialog = true)">
              <v-icon color="blue" class="mr-1">mdi-login-variant</v-icon>
              로그인
            </v-list-item>
            <v-list-item @click="(type = 'Register'), (dialog = true)">
              <v-icon color="green" class="mr-1">mdi-login-variant</v-icon>
              회원가입
            </v-list-item>
          </div>
        </v-list>
      </v-menu>

      <template v-slot:extension>
        <v-tabs align-with-title v-model="tabs">
          <v-tab><v-icon class="mr-1">mdi-home</v-icon> Home</v-tab>
          <v-tab><v-icon class="mr-1">mdi-check-bold</v-icon> 자가진단</v-tab>
          <v-tab><v-icon class="mr-1">mdi-music</v-icon> 노래신청</v-tab>
          <v-tab><v-icon class="mr-1">mdi-chat</v-icon> 채팅</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-dialog v-model="dialog" max-width="300">
      <v-card>
        <v-card-title class="headline">
          {{ type }}
        </v-card-title>

        <v-card-text v-if="type === 'Login'">
          <v-text-field autofocus v-model="id" type="number" :rules="[v => v > 0]" label="학번" required></v-text-field>
          <v-text-field v-model="pw" type="password" label="비밀번호" required></v-text-field>
        </v-card-text>

        <v-card-text v-if="type === 'Register'">
          <v-text-field autofocus v-model="grade" :rules="[v => v > 0]" type="number" label="학년" required></v-text-field>
          <v-text-field v-model="classroom" :rules="[v => v > 0]" type="number" label="반" required></v-text-field>
          <v-text-field v-model="number" :rules="[v => v > 0]" type="number" label="번호" required></v-text-field>
          <v-text-field v-model="name" type="text" label="이름" required></v-text-field>
          <v-text-field v-model="pw" type="password" label="비밀번호" required></v-text-field>
          <v-text-field v-model="email" :rules="v => /.+@.+/.test(v)" type="email" label="이메일" required></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-btn
            block
            color="#9186ff"
            dark
            @click="submit(), (dialog = false)"
          >
            {{ type }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-main>
      <Home v-if="tabs === 0" />
      <Check v-else-if="tabs === 1" />
      <Music v-else-if="tabs === 2" />
      <Chat v-else-if="tabs === 3" />
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
import Home from "./components/Home";
import Check from "./components/Check";
import Music from "./components/Music";
import Chat from "./components/Chat";

export default {
  name: "App",

  components: {
    Home,
    Check,
    Music,
    Chat,
  },

  created() {
    this.$store.state.account = {
      id: localStorage.getItem('id') ? Number(localStorage.getItem('id')) : null,
      name: localStorage.getItem('name') ? localStorage.getItem('name') : null
    }
  },

  methods: {
    logout() {
      this.$store.state.account = null
      localStorage.removeItem('id')
      localStorage.removeItem('name')
    },
    submit() {
      if (this.type === "Login") {
        axios
          .post("http://localhost:3000/account/login", {
            id: this.id,
            pw: this.pw,
          })
          .then((res) => {
            alert("로그인 성공");
            this.$store.state.account = res.data;
            localStorage.setItem('id', res.data.id);
            localStorage.setItem('name', res.data.name);
            axios.post("http://localhost:3000/check/validation", {
              id: this.$store.state.account.id
            })
            .then(() => {
              this.$store.state.today = true;
            })
          })
          .catch((e) => {
            alert(e);
          });
      } else if (this.type === "Register") {
        axios
          .post("http://localhost:3000/account/register", {
            id: Number(this.grade + this.classroom + (this.number < 10 ? '0' + this.number : this.number)),
            pw: this.pw,
            email: this.email,
            grade: this.grade,
            classroom: this.classroom,
            number: this.number,
            name: this.name,
          })
          .then(() => {
            alert("회원가입 성공");
          })
          .catch((e) => {
            alert(e);
          });
      }
    },
  },

  data: () => ({
    id: null,
    pw: null,
    email: null,
    grade: null,
    classroom: null,
    number: null,
    name: null,
    dialog: false,
    type: null,
    tabs: 0,
  }),
};
</script>
