<template>
  <van-form class="login-form" @submit="handleLogin">
    <van-cell-group inset>
      <van-field
        v-model="username"
        left-icon="friends"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="password"
        left-icon="lock"
        type="password"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-cell-group>
  </van-form>
</template>
<script>
export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    handleLogin () {
      const params = {
        username: this.username,
        password: this.password
      }
      this.$store.dispatch('user/login', params).then(res => {
        this.$notify({ type: 'success', message: '登录成功' })
        this.$router.push({ path: this.redirect || '/' }).catch(() => { })
      })
      .finally(() => {
      })
    }
  }
}
</script>
<style scoped>
.login-form {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  margin: auto;
}
</style>
