<template>
  <div>
    <van-nav-bar title="编辑" left-arrow @click-left="goback(false)"/>
    <van-skeleton title :row="8" :loading="loading">
      <van-form colon @submit="handleSubmit">
        <van-cell-group v-for="fieldset in fieldsets" :key="fieldset[0]" :title="fieldset[0]">
          <div
            v-for="key in fieldset[1].fields"
            :key="key"
          >
            <van-field
              v-if="fieldInfos[key].input_type==='password'"
              colon
              :label="fieldInfos[key].label"
            >
              <template #input>
                <django-change-password-field :field-key="key" :meta="fieldInfos[key]"/>
              </template>
            </van-field>
            <django-field
              v-else
              v-model="source[key]"
              :rules="rules[key]"
              :name="key"
              :meta="fieldInfos[key]"
              :error-message="serverErrors[key]"
            />
          </div>
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit" :loading="submitting">提交</van-button>
        </div>
      </van-form>
    </van-skeleton>
  </div>
</template>
<script>
import * as resource from '@/components/Django/api/resource'
import DjangoField from '@/components/Django/fields/DjangoField'
import DjangoChangePasswordField from '@/components/Django/fields/DjangoChangePasswordField'
import * as submit from '@/components/Django/utils/submit'

export default {
  components: { DjangoField, DjangoChangePasswordField },
  data () {
    return {
      metaInfo: {},
      source: {},
      rules: {},
      serverErrors: {},
      loading: false,
      submitting: false
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
    makeRules (meta) {
      if (meta.input_type === 'password') {
        // 密码不在这里输入，另外弹窗修改，所以不需要验证
        return []
      }
      if (!meta.required) {
        return []
      }
      return [{ required: true, message: '请输入', trigger: 'blur' }]
    },
    goback (needRefresh) {
      this.source = {}
      this.serverErrors = {}
      this.$route.meta.needRefresh = needRefresh
      this.$router.go(-1)
    },
    echoError (err) {
      if (err.response) {
        const data = err.response.data
        if (Array.isArray(data)) {
          data.forEach(item => {
            this.$message.error(item)
          })
          return
        }
        for (const key in data) {
          this.serverErrors[key] = data[key][0]
        }
      }
    },
    async loadMeta () {
      this.loading = true
      const { app, model } = this.modelInfo
      this.metaInfo = await this.$store.dispatch('meta/getInfo', `${app}.${model}`)
      Object.keys(this.fieldInfos).forEach(key => {
        if (key === 'pk') { return true }
        const meta = this.fieldInfos[key]
        this.rules[key] = this.makeRules(meta)
      })
      this.loading = false
    },
    async fetchData () {
      this.loading = true
      const { app, model } = this.modelInfo
      this.source = await resource.get(app, model, this.id)
      this.loading = false
    },
    handleSubmit () {
      this.submitting = true
      const { app, model } = this.modelInfo
      const params = submit.buildParams(this.source, this.fieldInfos, true)
      this.serverErrors = {}
      resource.update(app, model, this.id, params).then(res => {
        this.$notify({ type: 'success', message: '更新成功', duration: 500 })
        this.goback(true)
      }).catch(err => {
        this.echoError(err)
      }).finally(() => {
        this.submitting = false
      })
    }
  }
}
</script>
