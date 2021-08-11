<template>
  <div>
    <van-nav-bar title="新增" left-arrow @click-left="goback(false)">
    </van-nav-bar>
    <van-form colon ref="form" @submit="handleSubmit">
      <van-cell-group v-for="fieldset in fieldsets" :key="fieldset[0]" :title="fieldset[0]">
        <django-field
          v-for="key in fieldset[1].fields"
          :key="key"
          v-model="source[key]"
          :rules="rules[key]"
          :name="key"
          :meta="fieldInfos[key]"
          :error-message="serverErrors[key]"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit" :loading="submitting">提交</van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import * as resource from '@/components/Django/api/resource'
import DjangoField from '@/components/Django/fields/DjangoField'
import * as submit from '@/components/Django/utils/submit'

export default {
  components: { DjangoField },
  data () {
    return {
      metaInfo: {},
      fieldInfos: {},
      source: {},
      rules: {},
      fieldsets: [],
      serverErrors: {},
      submitting: false
    }
  },
  created () {
    this.loadMeta()
  },
  computed: {
    modelInfo () {
      const [app, model] = this.$route.name.split('.')
      return {
        app: app,
        model: model
      }
    }
  },
  methods: {
    makeRules (meta) {
      if (!meta.required) {
        return []
      }
      return [{ required: true, message: '请输入', trigger: 'blur' }]
    },
    goback (needRefresh = false) {
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
      this.fieldInfos = Object.assign({}, this.metaInfo.actions.POST)
      Object.keys(this.fieldInfos).forEach(key => {
        if (key === 'pk') { return true }
        const meta = this.fieldInfos[key]
        this.rules[key] = this.makeRules(meta)
      })
      let sourceFieldsets = this.metaInfo.addFieldsets
      if (sourceFieldsets.length === 0) {
        sourceFieldsets = this.metaInfo.fieldsets
      }
      const fieldsets = []
      sourceFieldsets.forEach(item => {
        const fields = []
        item[1].fields.forEach(name => {
          fields.push(name)
          const meta = this.fieldInfos[name]
          this.rules[name] = this.makeRules(meta)
          if (meta.input_type === 'password') {
            const key = `_check_${name}`
            const checkMeta = Object.assign({}, meta)
            checkMeta.label = `${meta.label}(重复)`
            this.fieldInfos[key] = checkMeta
            const func = (value, rule) => {
                const dst = this.source[name]
                return dst === value
            }
            const rules = this.makeRules(checkMeta)
            rules.push({ validator: func, message: '密码输入不一致' })
            this.rules[key] = rules
            fields.push(key)
          }
        })
        fieldsets.push([item[0], { fields: fields }])
      })
      this.fieldsets = fieldsets
    },
    handleSubmit () {
      this.submitting = true
      const { app, model } = this.modelInfo
      const params = submit.buildParams(this.source, this.fieldInfos, false)
      this.serverErrors = {}
      resource.add(app, model, params).then(res => {
        this.$notify({ type: 'success', message: '添加成功', duration: 500 })
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
