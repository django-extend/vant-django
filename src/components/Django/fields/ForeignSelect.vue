<template>
  <div>
    <input
      class="van-field__control"
      type="text"
      placeholder="点击选择"
      readonly
      :value="valueObject && valueObject.label"
      @click="showPopup=true"/>
    <van-popup v-model="showPopup" position="bottom">
      <van-picker
        show-toolbar
        value-key="label"
        :columns="choices"
        :loading="loading"
        :default-index="defaultIndex"
        @change="handleChange"
        @confirm="handleConform"
        @cancel="showPopup=false">
        <template #title>
          <van-search v-if="lazy" v-model="searchKeyword" style="max-width:200px" placeholder="请输入搜索关键词" @input="handleSearch"/>
        </template>
      </van-picker>
    </van-popup>
  </div>
</template>
<script>
import * as resource from '../api/resource'
const DEFAULT_PAGESIZE = 10

export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: [String, Number],
      default: undefined
    },
    relation: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      showPopup: false,
      loading: false,
      valueObject: null,
      choices: [],
      pageInfo: {},
      defaultIndex: 0,
      searchKeyword: ''
    }
  },
  computed: {
    lazy () {
      return this.relation.lazy
    }
  },
  watch: {
    showPopup (val) {
      if (val) {
        this.loadData()
      } else {
        this.resetData()
      }
    }
  },
  mounted () {
    if (this.value) {
      this.loadObject()
    }
  },
  methods: {
    resetData (resetKeyword) {
      this.pageInfo = {}
      this.choices = []
      this.defaultIndex = 0
      resetKeyword && (this.searchKeyword = '')
    },
    bindIndex () {
      for (let i = 0; i < this.choices.length; i++) {
        if (this.choices[i].key === this.value) {
          this.defaultIndex = i
          break
        }
      }
    },
    async loadObject () {
      const res = await resource.getStr(this.relation.app, this.relation.model, this.value)
      this.valueObject = {
        key: this.value,
        label: res.str
      }
    },
    async loadData () {
      this.loading = true
      const pageSize = this.lazy ? DEFAULT_PAGESIZE : -1
      const res = await resource.listAutoComplete(this.relation.app, this.relation.model, { pageSize: pageSize })
      const data = res.result.data
      this.choices = data
      this.bindIndex()
      this.pageInfo = res.result
      this.loading = false
    },
    async doAutoCompleteLoad (needBindIndex) {
      if (this.loading) {
        return
      }
      if (this.pageInfo.totalPage && this.pageInfo.pageNo >= this.pageInfo.totalPage) {
        return
      }
      const params = {
        pageSize: DEFAULT_PAGESIZE,
        search: this.searchKeyword
      }
      if (this.pageInfo.pageNo) {
        params.pageNo = this.pageInfo.pageNo + 1
      }
      this.loading = true
      const res = await resource.listAutoComplete(this.relation.app, this.relation.model, params)
      this.choices.push(...res.result.data)
      needBindIndex && this.bindIndex()
      this.pageInfo = res.result
      this.loading = false
    },
    handleChange (picker) {
      const currentIndex = picker.getIndexes()[0]
      if (currentIndex === this.choices.length - 1) {
        // 选中最后一列
        this.doAutoCompleteLoad(false)
        this.defaultIndex = currentIndex
      }
    },
    handleConform (val) {
      this.$emit('change', val.key)
      this.valueObject = val
      this.showPopup = false
    },
    handleSearch () {
      this.resetData(false)
      this.doAutoCompleteLoad(true)
    }
  }
}
</script>
