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
      <vanx-datetime-picker
        :type="type"
        :value="valueDatetime"
        @confirm="handleConfirm"
        @cancel="showPopup=false"
      />
    </van-popup>
  </div>
</template>
<script>
import VanxDatetimePicker from '../components/DatetimePicker'
import moment from 'moment'

export default {
  components: { VanxDatetimePicker },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: null
    },
    type: {
      type: String,
      required: true
    }
  },
  computed: {
    valueDisplay () {
      return this.formatDatetime(this.value)
    },
    valueDatetime () {
      let momentValue
      switch (this.type) {
        case 'date':
          momentValue = this.value && moment(this.value, 'YYYY-MM-DD')
          break
        case 'datetime':
          momentValue = this.value && moment(this.value, 'YYYY-MM-DD HH:mm:ss')
          break
        case 'time':
          momentValue = this.value && moment(this.value, 'HH:mm:ss')
          momentValue && momentValue.set({ 'year': 2020, 'month': 1, 'date': 1 })
          break
      }
      return momentValue ? momentValue.toDate() : new Date()
    }
  },
  data () {
    return {
      showPopup: false
    }
  },
  methods: {
    formatDatetime (value) {
      let pattern
      switch (this.type) {
        case 'date':
          pattern = 'YYYY-MM-DD'
          break
        case 'datetime':
          pattern = 'YYYY-MM-DD HH:mm:ss'
          break
        case 'time':
          pattern = 'HH:mm:ss'
          break
      }
      return value ? moment(value, pattern).format(pattern) : ''
    },
    handleConfirm (value) {
      this.showPopup = false
      this.$emit('change', this.formatDatetime(value))
    }
  }
}
</script>
