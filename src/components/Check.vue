<template>
  <v-container fluid>
    <v-alert
      class="mx-auto text-center"
      prominent
      v-if="!$store.state.account.id"
      dense
      type="info"
    >
      <strong>로그인</strong>을 먼저 <strong>완료</strong>해주세요!
    </v-alert>

    <v-alert
      class="mx-auto text-center"
      prominent
      v-else-if="$store.state.today"
      dense
      type="success"
    >
      오늘의 <strong>자가진단</strong>을 <strong>완료</strong>하였습니다!
    </v-alert>

    <v-card class="mx-auto my-3" max-width="600" :disabled="!$store.state.account.id || $store.state.today">
      <v-card-title>
        1. 학생 본인이 37.5℃ 이상 발열 또는 발열감이 있나요?
      </v-card-title>
      <v-card-subtitle>
        단, 기저질환 등으로 코로나19와 관계없이 평소에 발열 증상이 계속되는
        경우는 제외
      </v-card-subtitle>
      <v-card-text>
        <v-radio-group v-model="first">
          <v-radio label="예"></v-radio>
          <v-radio label="아니요"></v-radio>
        </v-radio-group>
      </v-card-text>
    </v-card>
    <v-card class="mx-auto my-3" max-width="600" :disabled="!$store.state.account.id || $store.state.today">
      <v-card-title>
        2. 학생에게 코로나19가 의심되는 아래의 임상증상*이 있나요?
      </v-card-title>
      <v-card-subtitle
        v-html="
          '*(주요 임상증상) 기침, 호흡곤란, 오한, 근육통, 두통, 인후통, 후각·미각 소실 또는 폐렴<br />단, 기저질환 등으로 코로나19와 관계없이 평소에 다음 증상이 계속되는 경우는 제외'
        "
      />
      <v-card-text>
        <v-radio-group v-model="second">
          <v-radio label="예"></v-radio>
          <v-radio label="아니요"></v-radio>
        </v-radio-group>
      </v-card-text>
    </v-card>
    <v-card class="mx-auto my-3" max-width="600" :disabled="!$store.state.account.id || $store.state.today">
      <v-card-title>
        3. 학생 본인 또는 동거인이 방역당국에 의해 현재 자가격리가 이루어지고
        있나요?
      </v-card-title>
      <v-card-subtitle
        v-html="
          '※ <방역당국 지침> 최근 14일 이내 해외 입국자, 확진자와 접촉자 등은 자가격리 조치<br />단, 직업특성상 잦은 해외 입·출국으로 의심증상이 없는 경우 자가격리 면제'
        "
      />
      <v-card-text>
        <v-radio-group v-model="third">
          <v-radio label="예"></v-radio>
          <v-radio label="아니요"></v-radio>
        </v-radio-group>
      </v-card-text>
    </v-card>
    <v-card
      class="mx-auto my-3 pa-5 text-center"
      color="#9186ff"
      dark
      max-width="600"
      @click="submit"
      :disabled="!$store.state.account.id || $store.state.today"
    >
      제출 / Submit
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    first: 1,
    second: 1,
    third: 1,
  }),

  mounted() {
    axios.post("http://localhost:3000/check/validation", {
      id: this.$store.state.account.id
    })
      .then(() => {
        this.$store.state.today = true;
      })
  },

  methods: {
    submit() {
        axios
          .post("http://localhost:3000/check/submit", {
            id: this.$store.state.account.id,
            first: !this.first,
            second: !this.second,
            third: !this.third,
          })
          .then(() => {
            alert("자가진단 완료");
            this.$store.state.today = true;
          })
          .catch((e) => {
            alert(e);
          });
    },
  },
};
</script>
