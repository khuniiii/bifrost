<template>
  <div>
    <v-navigation-drawer clipped permanent app>
    <v-list-item-group v-model="model" :mandatory="model">
      <v-list-item active-class="green lighten-3 white--text" v-for="item in items" :key="item.title" two-line @click="pick(item.id)" v-show="$store.state.account.id && item.id !== $store.state.account.id">
        <v-list-item-avatar>
          <v-avatar color="#f7cac9" style="font-size: 13px">{{ item.id }}</v-avatar>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ item.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ messages[item.id] ? messages[item.id][messages[item.id].length - 1] ? messages[item.id][messages[item.id].length - 1].message : null : null }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      </v-list-item-group>
    </v-navigation-drawer>
    <v-container fluid>
      <div v-for="e in messages[this.resId]" :key="e.key" :class="e.reqId === $store.state.account.id ? 'd-flex flex-row-reverse' : ''">
        <v-btn class="my-1 mx-3" :color="e.reqId === $store.state.account.id ? '#9186ff' : ''" :dark="e.reqId === $store.state.account.id">
          {{ e.message }}
        </v-btn>
      </div>
      <v-btn text disabled />
    </v-container>
    <v-footer app inset>
      <v-text-field v-model="message" outlined hide-details color="#9186ff" class="mx-3" @keyup.enter="submit" />
      <v-btn x-large dark color="#9186ff" class="mx-3" @click="submit">Submit</v-btn>
    </v-footer>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      messages: [],
      message: null,
      items: null,
      resId: null,
      model: null,
    };
  },

  mounted() {
    axios.get('http://localhost:3000/chat/user')
      .then((res) => {
        this.items = res.data
        res.data.forEach(e => {
          axios.post('http://localhost:3000/chat/list', { i: this.$store.state.account.id, u: e.id })
          .then((res) => {
            this.$set(this.messages, e.id, res.data)
          })
        })
      })
      this.$socket.on(String(this.$store.state.account.id), (data) => {
        if (!this.messages[data.reqId]) this.$set(this.messages, data.reqId, [])
        this.messages[data.reqId].push({ message: data.message, reqId: data.reqId, resId: data.resId })
        window.scroll(0, document.body.scrollHeight)
      })
  },

  watch: {
    '$store.state.account.id': function () {
      axios.get('http://localhost:3000/chat/user')
      .then((res) => {
        this.items = res.data
        res.data.forEach(e => {
          axios.post('http://localhost:3000/chat/list', { i: this.$store.state.account.id, u: e.id })
          .then((res) => {
            this.$set(this.messages, e.id, res.data)
          })
        })
      })
    }
  },

  methods: {
    pick(resId) {
      this.resId = resId
    },
    async submit() {
      await axios.post('http://localhost:3000/chat/create', { message: this.message, resId: this.resId, reqId: this.$store.state.account.id })
      .then(() => {
        if (!this.messages[this.resId]) this.$set(this.messages, this.resId, [])
        this.messages[this.resId].push({ message: this.message, resId: this.resId, reqId: this.$store.state.account.id })
      })
      window.scrollTo(0, document.body.scrollHeight)
      this.$socket.emit('message', {message: this.message, resId: this.resId, reqId: this.$store.state.account.id})
      this.message = null
    },
  },
};
</script>
