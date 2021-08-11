<template>
  <div>
    <van-nav-bar title="查看" left-arrow @click-left="goback"/>
    <van-skeleton title :row="8" :loading="loading">
      <van-cell-group v-for="fieldset in fieldsets" :key="fieldset[0]" :title="fieldset[0]">
        <van-cell
          v-for="key in fieldset[1].fields"
          :key="key"
          :title="fieldInfos[key].label"
          v-show="fieldInfos[key].input_type !== 'password'"
        >
          <template #default>
            <django-value :value="source[key]" :meta="fieldInfos[key]"/>
          </template>
        </van-cell>
      </van-cell-group>
    </van-skeleton>
  </div>
</template>
<script>
import * as resource from '@/components/Django/api/resource'
import DjangoValue from '@/components/Django/fields/DjangoValue'
export default {
  components: { DjangoValue },
  data () {
    return {
      metaInfo: {},
      source: {},
      loading: false
    }
  },
  created () {
    this.loadMeta()
  },
  activated () {
    this.fetchData()
  },
  computed: {
    modelInfo () {
      const [app, model] = this.$route.name.split('.')
      return {
        app: app,
        model: model
      }
    },
    id () {
      return this.$route.params.id
    },
    fieldsets () {
      return this.metaInfo.fieldsets
    },
    fieldInfos () {
      return this.metaInfo.actions.POST
    }
  },
  methods: {
    goback () {
      this.source = {}
      this.serverErrors = {}
      this.$router.go(-1)
    },
    async loadMeta () {
      this.loading = true
      const { app, model } = this.modelInfo
      this.metaInfo = await this.$store.dispatch('meta/getInfo', `${app}.${model}`)
      this.loading = false
    },
    async fetchData () {
      this.loading = true
      const { app, model } = this.modelInfo
      this.source = await resource.getView(app, model, this.id)
      this.loading = false
    }
  }
}
</script>
