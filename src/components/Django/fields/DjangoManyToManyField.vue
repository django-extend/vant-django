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
      <van-nav-bar @click-left="showPopup=false" @click-right="handleConfirm">
        <template #left>
          <span style="color:#969799;">取消</span>
        </template>
        <template #right>
          <span style="color: #576b95;">确认</span>
        </template>
      </van-nav-bar>
      <van-tree-select
        :items="items"
        :active-id.sync="activeIds"
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
      type: Array,
      default: null
    },
    choices: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      activeIds: [],
      items: [],
      showPopup: false
    }
  },
  computed: {
    valueDisplay () {
      const ar = []
      this.value && this.value.forEach(id => {
        const label = this.getChoiceLabel(id)
        label && (ar.push(label))
      })
      return ar.join(',')
    }
  },
  watch: {
    value (val) {
      this.bind()
    }
  },
  mounted () {
    this.bind()
  },
  methods: {
    bind () {
      this.value && (this.activeIds = this.value.map(item => { return item.toString() }))
      const children = []
      Object.entries(this.choices).forEach(item => {
        children.push({ id: item[0], text: item[1] })
      })
      this.items = [{
        title: '',
        children: children
      }]
    },
    getChoiceLabel (id) {
      let rs
      Object.entries(this.choices).forEach(choice => {
        if (choice[0] === id.toString()) {
          rs = choice[1]
          return false
        }
      })
      return rs
    },
    handleConfirm () {
      this.$emit('change', this.activeIds)
      this.showPopup = false
    }
  }
}
</script>
<style scoped>
.van-tree-select__nav {
  display: none;
}
.van-tree-select__item {
  text-align: center;
}
</style>
