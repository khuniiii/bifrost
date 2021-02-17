<template>
  <v-carousel
    cycle
    height="650"
    hide-delimiter-background
    show-arrows-on-hover
  >
    <v-carousel-item
      v-for="(slide, i) in slides"
      :key="i"
      :src="slide"
    >
    </v-carousel-item>
  </v-carousel>
</template>

<script>
  export default {
    data () {
      return {
        slides: [
          require('@/assets/images/page1.png'),
          require('@/assets/images/page2.png'),
          require('@/assets/images/page3.png'),
          require('@/assets/images/page4.png'),
        ],
      }
    },
  }
</script>