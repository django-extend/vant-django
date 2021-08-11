<template>
  <van-tabs :active="active" @change="handleChange">
    <van-tab v-for="choice in choices" :key="choice[0]" :title="choice[1]"/>
  </van-tabs>
</template>
<script>
export default {
  name: 'VanxFilter',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: [String, Number],
      default: null
    },
    choices: {
      type: Array,
      required: true
    }
  },
  computed: {
    active () {
      for (let i = 0; i < this.choices.length; i++) {
        if (this.choices[i][0] === this.value) {
          return i
        }
      }
      return 0
    }
  },
  methods: {
    handleChange (val) {
      this.$emit('change', this.choices[val][0])
    }
  }
}
</script>
