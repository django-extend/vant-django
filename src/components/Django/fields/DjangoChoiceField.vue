<template>
  <div>
    <input
      class="van-field__control"
      type="text"
      placeholder="点击选择"
      readonly
      :value="valueDisplay"
      @click="showPopup=true"/>
    <van-popup v-model="showPopup" position="bottom">
      <van-picker
        show-toolbar
        :columns="choices"
        :default-index="choiceIndex"
        value-key="display_name"
        @confirm="handleConfirm"
        @cancel="showPopup=false"
      />
    </van-popup>
  </div>
</template>
<script>
export default {
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
    choiceIndex () {
      for (let i = 0; i < this.choices.length; i++) {
          const choice = this.choices[i]
          if (choice.value === this.value) {
            return i
          }
      }
      return -1
    },
    valueDisplay () {
      return this.choiceIndex >= 0 ? this.choices[this.choiceIndex].display_name : null
    }
  },
  data () {
    return {
      showPopup: false
    }
  },
  methods: {
    handleConfirm (value) {
      this.showPopup = false
      this.$emit('change', value.value)
    }
  }
}
</script>
