<template>
  <van-pull-refresh v-model="refreshing" @refresh="handleRefresh">
    <van-list
      v-model="loading"
      :immediate-check="false"
      :finished="finished"
      finished-text="没有更多了"
      @load="handleLoadMore"
    >
      <!-- <van-nav-bar
        v-if="selectable"
        fixed
        style="position: sticky;"
      >
        <template #left>
          <van-checkbox v-model="localSelectAll" @change="handleSelectAll">
            {{ localSelectAll ? '取消全选' : '全选' }}
          </van-checkbox>
        </template>
        <template #right v-if="!localSelectAll">
          {{ selectCount }} / {{ pageInfo && pageInfo.totalCount }}
        </template>
      </van-nav-bar> -->
      <van-swipe-cell v-for="(item, index) in localData" :key="item[rowKey]" :disabled="selectable">
        <van-cell :is-link="!selectable" @click="handleClick(item, index)">
          <template #title>
            <slot :name="columns[0].dataIndex" :text="item[columns[0].dataIndex]" :record="item" :index="0">
              {{ item[columns[0].dataIndex] }}
            </slot>
          </template>
          <template #label>
            <div v-for="(column,i) in columns" :key="column.dataIndex" v-show="i>0">
              <span v-if="column.title">{{ column.title }}: </span>
              <slot :name="column.dataIndex" :text="item[column.dataIndex]" :record="item" :index="index">
                {{ item[column.dataIndex] }}
              </slot>
            </div>
          </template>
          <template #icon v-if="selectable">
            <van-checkbox style="padding-right: 15px" v-model="localSelection[index].selected"/>
          </template>
        </van-cell>
        <template #right v-if="deletable">
          <van-button square text="删除" type="danger" style="height: 100%;" @click="$emit('delete', item)"/>
        </template>
      </van-swipe-cell>
    </van-list>
  </van-pull-refresh>
</template>
<script>
/*
整合的列表控件 vanx-list
功能：下拉刷新+上拉刷新+右滑删除+多选（全选的交互不好，不支持）
注意：list对于尾部cell的屏幕位置计算不够准确，分页建议pageSize>20，否则下拉刷新会有概率触发首页和第二页两次请求
*/

export default {
  name: 'VanxList',
  props: {
    data: {
      type: Function,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    rowKey: {
      type: String,
      required: true
    },
    selectable: {
      type: Boolean,
      default: false
    },
    deletable: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    finished () {
      return this.pageInfo ? this.pageInfo.pageNo >= this.pageInfo.totalPage : false
    },
    totalCount () {
      return this.pageInfo ? this.pageInfo.totalCount : 0
    }
  },
  data () {
    return {
      pageInfo: null,
      localData: [],
      localSelection: [],
      loading: false,
      refreshing: false
    }
  },
  watch: {
    selectable (val) {
      if (!val) {
        this.clearSelection(false)
      }
    }
  },
  mounted () {
    this.fetchData(false)
  },
  methods: {
    async fetchData (more) {
      const params = {}
      more && this.pageInfo && (params.pageNo = this.pageInfo.pageNo + 1)
      const result = await this.data(params)
      this.refreshing = false
      result.data.forEach(item => {
        this.localData.push(item)
        this.localSelection.push({ key: item[this.rowKey], selected: false })
      })
      const { pageNo, pageSize, totalCount, totalPage } = result
      this.pageInfo = {
        pageNo: pageNo,
        pageSize: pageSize,
        totalCount: totalCount,
        totalPage: totalPage
      }
      this.loading = false
    },
    dispathSelectEvent () {
      const keys = []
      this.localSelection.forEach((item, index) => {
        if (!item.selected) {
          return true
        }
        keys.push(item.key)
      })
      this.$emit('select', keys)
    },
    clearSelection (del) {
      let sended = false
      this.localSelection.forEach(item => {
        if (item.selected && !sended) {
          // 如果有选中行为，则需要通知父组件选中已清除
          this.$emit('select', [])
          sended = true
        }
        item.selected = false
      })
      if (del) {
        this.localSelection = []
      }
    },
    handleSelect () {
      this.dispathSelectEvent()
    },
    handleClick (item, index) {
      if (this.selectable) {
        this.localSelection[index].selected = !this.localSelection[index].selected
        this.dispathSelectEvent()
      } else {
        this.$emit('click', item)
      }
    },
    handleLoadMore () {
      this.fetchData(true)
    },
    handleRefresh () {
      this.refresh()
    },
    refresh () {
      this.pageInfo = null
      this.clearSelection(true)
      this.localData = []
      this.loading = true
      this.fetchData(false)
    }
  }
}
</script>
