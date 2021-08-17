<template>
  <div>
    <van-nav-bar
      v-if="actionMode"
      fixed
      left-text="完成"
      @click-left="handleActionClose"
      @click-right="handleActionExecute"
    >
      <template #title>
        已选择({{ selectKeys.length }}/{{ $refs.list.totalCount }})
      </template>
      <template #right>
        <span :style="{color: selectKeys.length > 0 ? '#1989fa' : 'grey' }">{{ currentAction.name }}</span>
      </template>
    </van-nav-bar>
    <van-nav-bar
      v-else
      :title="title"
      fixed
      left-arrow
      @click-left="$router.push('/')"
    >
      <template #right>
        <van-icon v-if="auth('view') && canShowFilter" name="filter-o" :color="showFilter?'#ee0a24':'#646566'" size="20" @click="showFilter=!showFilter"/>
        <van-popover
          v-model="showPopoverAction"
          :actions="actions ? actions.items : []"
          @select="handleAction"
          placement="bottom-end"
          trigger="click"
          style="padding-top: 5px"
        >
          <template #reference>
            <van-icon name="more-o" color="#646566" style="padding-left:10px" size="20"/>
          </template>
        </van-popover>
        <van-icon
          v-if="auth('add')"
          name="add-o"
          color="#646566"
          style="padding-left:10px"
          size="20"
          @click="handleAdd"/>
      </template>
    </van-nav-bar>
    <div class="filter-container" style="padding-top: 46px;">
      <template v-if="filters && showFilter">
        <van-search
          v-if="filters.searchFields.length > 0"
          v-model="queryParam.search"
          :placeholder="formatPlaceholder(filters.searchFields)"
          @search="refreshData"
          @clear="refreshData"
        />
        <vanx-filter
          v-for="filter in filters.listFilter"
          :key="filter.key"
          :choices="makeChoices(filter)"
          v-model="queryParam[filter.key]"
          @change="refreshData"
        />
      </template>
    </div>
    <vanx-list
      ref="list"
      v-if="!loading && auth('view')"
      row-key="pk"
      :columns="columns"
      :data="fetchData"
      :selectable="actionMode"
      :deletable="auth('delete')"
      @click="handleClickRow"
      @select="handleSelect"
      @delete="handleDeleteRow">
      <template
        v-for="column in columns"
        :slot="column.dataIndex"
        slot-scope="{text}"
      >
        <django-value :key="column.dataIndex" :value="text" :meta="getMeta(column.dataIndex)"/>
      </template>
    </vanx-list>
    <van-popup v-model="submitting" :style="{ height: '100px', width: '100px'}"><van-loading class="center" /></van-popup>
  </div>
</template>
<script>
import * as resource from '@/components/Django/api/resource'
import VanxFilter from '@/components/vantx/Filter'
import VanxList from '@/components/vantx/List'
import DjangoValue from '@/components/Django/fields/DjangoValue'

export default {
  components: { VanxFilter, VanxList, DjangoValue },
  data () {
    return {
      metaInfo: null,
      queryParam: {},
      columns: [],
      actions: null,
      loading: false,
      showFilter: false,
      backupShowFilter: false,
      showPopoverAction: false,
      currentAction: null,
      selectKeys: [],
      submitting: false,
      permission: null
    }
  },
  created () {
    this.loadMeta()
    const permissionId = this.$route.meta.permission
    this.permission = this.$store.state.user.roles.permissions.find(item => {
        return item.permissionId === permissionId
    }).actionList
  },
  computed: {
    title () {
      return this.$route.meta.title
    },
    actionMode () {
      return this.currentAction !== null
    },
    filters () {
      return this.metaInfo && this.metaInfo.filters
    },
    canShowFilter () {
      return this.filters && (this.filters.searchFields.length > 0 || this.filters.listFilter.length > 0)
    }
  },
  beforeRouteEnter (to, from, next) {
    // 编辑/新增页面返回，传递是否需要刷新页面的参数
    to.meta.needRefresh = from.meta.needRefresh
    next()
  },
  activated () {
    if (this.$route.meta.needRefresh) {
      this.refreshData()
    }
  },
  methods: {
    auth (action) {
      return this.permission.indexOf(action) !== -1
    },
    getMeta (key) {
      return this.metaInfo ? this.metaInfo.actions.POST[key] : null
    },
    makeChoices (filter) {
      const choices = [
        ['', `全部${filter.label}`]
      ]
      choices.push(...filter.choices)
      return choices
    },
    formatPlaceholder (source) {
      return source.map(item => {
        return item.label
      }).join('/')
    },
    refreshData () {
      if (!this.auth('view')) {
        return
      }
      this.$refs.list && this.$refs.list.refresh()
    },
    getActionTo (item, action) {
      const name = this.$route.name
      return {
        name: `${name}.${action}`,
        params: {
          id: item.pk
        }
      }
    },
    getModelInfo () {
      const [app, model] = this.$route.name.split('.')
      return {
        app: app,
        model: model
      }
    },
    async loadMeta () {
      this.loading = true
      this.metaInfo = await this.$store.dispatch('meta/getInfo', this.$route.name)
      this.filters.listFilter.forEach(filter => {
          this.queryParam[filter.key] = ''
      })
      this.loading = false
    },
    fetchData (parameter) {
      const { app, model } = this.getModelInfo()
      const noEmptyParams = Object.fromEntries(Object.entries(this.queryParam).filter(([key, value]) => value !== ''))
      const requestParameters = Object.assign({}, noEmptyParams, parameter)
      return resource.list(app, model, requestParameters).then(res => {
        this.columns = res.columns
        res.actions.items.forEach(action => {
          action.text = `${action.name}...`
        })
        this.actions = res.actions
        return res.result
      })
    },
    handleAdd () {
      const name = this.$route.name
      this.$router.push({ name: `${name}.add` })
    },
    handleClickRow (row) {
      const action = this.auth('change') ? 'edit' : 'view'
      this.$router.push(this.getActionTo(row, action))
    },
    handleDeleteRow (row) {
      const { app, model } = this.getModelInfo()
      resource.del(app, model, row.pk).then(res => {
        this.$notify({ type: 'success', message: '记录已删除', duration: 500 })
        this.refreshData()
      })
    },
    handleAction (action) {
      this.backupShowFilter = this.showFilter
      this.showFilter = false
      this.currentAction = action
    },
    handleActionClose () {
      this.showFilter = this.backupShowFilter
      this.currentAction = null
    },
    async handleActionExecute () {
      if (this.selectKeys.length === 0) {
        return
      }
      this.submitting = true
      const { app, model } = this.getModelInfo()
      const params = {
        ids: this.selectKeys
      }
      const res = await resource.bulkAction(app, model, this.currentAction.action, params)
      this.submitting = false
      res.message.forEach(item => {
          let name
          switch (item.level) {
            case 20:
              name = 'primary'
              break
            case 25:
              name = 'success'
              break
            case 30:
              name = 'warning'
              break
            case 40:
              name = 'danger'
              break
            default:
              name = 'success'
              break
          }
          this.$notify({ type: name, message: item.message, duration: 500 })
      })
      this.handleActionClose()
      this.refreshData()
    },
    handleSelect (keys) {
      this.selectKeys = keys
    }
  }
}
</script>
<style scoped>
.center {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 30%;
    height: 30%;
    margin: auto;
}
</style>
