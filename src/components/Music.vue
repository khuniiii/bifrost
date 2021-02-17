<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="desserts"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>노래신청</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="#9186ff" dark class="mb-2" v-bind="attrs" v-on="on" :disabled="!$store.state.account">
                신청
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.title"
                        label="제목"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.artist"
                        label="가수"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.url"
                        label="URL"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="close">
                  취소
                </v-btn>
                <v-btn color="#9186ff" dark @click="save">
                  확인
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline">삭제하시겠습니까?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="closeDelete"
                  >취소</v-btn
                >
                <v-btn color="#9186ff" dark @click="deleteItemConfirm"
                  >확인</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)" v-if="$store.state.account && item.id === $store.state.account.id">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)" v-if="$store.state.account && item.id === $store.state.account.id">
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="#9186ff" dark @click="initialize">
          불러오기
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "제목", value: "title" },
      { text: "가수", value: "artist" },
      { text: "URL", value: "url" },
      { text: "신청자", value: "name" },
      { text: "날짜", value: "createdAt" },
      { text: "수정/삭제", value: "actions", sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      title: "",
      artist: "",
      url: "",
    },
    defaultItem: {
      title: "",
      artist: "",
      url: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "신청" : "수정";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    async initialize() {
      await axios.get('http://localhost:3000/music/list')
      .then(async (res) => {
        res.data.forEach(async e => {
          await axios.post('http://localhost:3000/account/user', {
            id: e.id
          })
          .then((res) => {
            this.$set(e, 'name', res.data.name)
          })
        })
        this.desserts = res.data;
      })
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      axios.post('http://localhost:3000/music/delete', {
          _id: this.editedItem._id,
        })
        .then(() => {
          this.initialize()
        })
        .catch((e) => {
          console.error(e)
        })
      this.desserts.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      if (this.editedIndex > -1) {
        await axios.post('http://localhost:3000/music/edit', {
          _id: this.editedItem._id,
          id: this.$store.state.account.id,
          title: this.editedItem.title,
          url: this.editedItem.url,
          artist: this.editedItem.artist,
        })
        .then(() => {
          this.initialize()
        })
        .catch((e) => {
          console.error(e)
        })
      } else {
        await axios.post('http://localhost:3000/music/submit', {
          id: this.$store.state.account.id,
          title: this.editedItem.title,
          url: this.editedItem.url,
          artist: this.editedItem.artist,
        })
        .then(() => {
          this.initialize()
        })
        .catch((e) => {
          console.error(e)
        })
      }
      this.close();
    },
  },
};
</script>
