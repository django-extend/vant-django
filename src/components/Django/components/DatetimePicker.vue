<template>
  <div>
    <van-nav-bar v-show="showToolbar" @click-left="handleCancel" @click-right="handleConfirm">
      <template #left>
        <span style="color:#969799;">取消</span>
      </template>
      <template #right>
        <span style="color: #576b95;">确认</span>
      </template>
    </van-nav-bar>
    <van-row>
      <van-col :span="spanDate" v-show="showDate">
        <van-datetime-picker :value="value" :show-toolbar="false" type="date" class="date" @change="handleChangeDate"/>
      </van-col>
      <van-col :span="spanTime" v-show="showTime">
        <van-picker :columns="timeColumns" @change="handleChangeTime"/>
      </van-col>
    </van-row>
  </div>
</template>
<script>
export default {
  name: 'VanxDatetimePicker',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    type: {
      type: String,
      default: 'datetime'
    },
    value: {
      type: Date,
      default () { return new Date() }
    },
    showToolbar: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      currentDate: new Date(),
      timeColumns: [
        {
          values: this.range(0, 23),
          defaultIndex: -1
        },
        {
          values: this.range(0, 59),
          defaultIndex: -1
        },
        {
          values: this.range(0, 59),
          defaultIndex: -1
        }
      ]
    }
  },
  computed: {
    showDate () {
      return this.type !== 'time'
    },
    showTime () {
      return this.type !== 'date'
    },
    spanDate () {
      switch (this.type) {
        case 'time':
          return 0
        case 'date':
          return 24
        default:
          return 14
      }
    },
    spanTime () {
      switch (this.type) {
        case 'time':
          return 24
        case 'date':
          return 0
        default:
          return 10
      }
    },
    hourColumns () { return this.timeColumns[0] },
    minuteColumns () { return this.timeColumns[1] },
    secondColumns () { return this.timeColumns[2] }
    // title () {
    //   const year = this.currentDate.getFullYear()
    //   const month = this.currentDate.getMonth()
    //   const day = this.currentDate.getDay()
    //   const hour = this.hourColumns.values[this.hourColumns.defaultIndex]
    //   const minute = this.minuteColumns.values[this.minuteColumns.defaultIndex]
    //   const second = this.secondColumns.values[this.secondColumns.defaultIndex]
    //   switch (this.type) {
    //     case 'datetime':
    //       return `${year}`
    //   }
    // }
  },
  mounted () {
    this.value && (this.currentDate = this.value)
    this.hourColumns.defaultIndex = this.hourColumns.values.indexOf(this.formatString(this.currentDate.getHours()))
    this.minuteColumns.defaultIndex = this.minuteColumns.values.indexOf(this.formatString(this.currentDate.getMinutes()))
    this.secondColumns.defaultIndex = this.secondColumns.values.indexOf(this.formatString(this.currentDate.getSeconds()))
  },
  methods: {
    formatString (val) {
      // 前补0
      return val.toString().padStart(2, 0)
    },
    range (start, end) {
      if (start === end) {
        return [start]
      }
      return [this.formatString(start), ...this.range(start + 1, end)]
    },
    handleChangeDate (picker) {
      const values = picker.getValues()
      const year = parseInt(values[0])
      const month = parseInt(values[1]) - 1 // 1月=0
      const day = parseInt(values[2])
      this.currentDate.setFullYear(year, month, day)
      this.$emit('change', this.currentDate)
    },
    handleChangeTime (picker, values) {
      this.currentDate.setHours(parseInt(values[0]))
      this.currentDate.setMinutes(parseInt(values[1]))
      this.currentDate.setSeconds(parseInt(values[2]))
      this.$emit('change', this.currentDate)
    },
    handleCancel () {
      this.$emit('cancel')
    },
    handleConfirm () {
      this.$emit('confirm', this.currentDate)
    }
  }
}
</script>
<style scoped>
.date {
  border-right: 1px solid rgb(233, 233, 233);
}
</style>
