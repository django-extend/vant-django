<template>
  <div>
    <input
      class="van-field__control"
      type="text"
      placeholder="点击修改"
      readonly
      @click="showPopup=true"/>
    <van-popup v-model="showPopup" position="bottom" @close="handleClosePopup">
      <van-nav-bar :title="`编辑 ${meta.label}`" @click-right="showPopup=false">
        <template #right>
          <van-icon name="cross" size="20" color="#c8c9cc"></van-icon>
        </template>
      </van-nav-bar>
      <van-form colon ref="form" @submit="handleSubmit">
        <van-field
          :label="meta.label"
          type="password"
          v-model="password"
          :rules="rules.password"
        />
        <van-field
          :label="`${meta.label} (重复)`"
          type="password"
          v-model="passwordConfirm"
          :rules="rules.passwordConfirm"
        />
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit" :loading="submitting">提交</van-button>
        </div>
      </van-form>
    </van-popup>
  </div>
</template>
<script>
import * as resource from '@/components/Django/api/resource'

export default {
  props: {
    meta: {
      type: Object,
      required: true
    },
    fieldKey: {
      type: String,
      required: true
    }
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
    }
  },
  data () {
    return {
      showPopup: false,
      submitting: false,
      password: '',
      passwordConfirm: '',
      rules: {
        password: [{ required: true, message: '请输入', trigger: 'blur' }],
        passwordConfirm: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator: this.validatePasswordConfirm, message: '密码输入不一致' }
        ]
      }
    }
  },
  methods: {
    validatePasswordConfirm (val) {
      return this.password === val
    },
    handleClosePopup () {
      this.$refs.form.resetValidation()
      this.password = this.passwordConfirm = ''
    },
    async handleSubmit () {
      this.submitting = true
      const params = {}
      params[this.fieldKey] = this.password
      const { app, model } = this.modelInfo
      await resource.update(app, model, this.id, params)
      this.submitting = false
      this.showPopup = false
      this.$notify({ type: 'success', message: `${this.meta.label}更新成功`, duration: 500 })
    }
  }
}
</script>
