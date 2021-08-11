<template>
  <div>
    <van-nav-bar :title="$route.meta.title" fixed style="position: sticky;" @click-left="showSetting=true">
      <template #left>
        <van-icon name="wap-nav" color="grey"/>
      </template>
    </van-nav-bar>
    <van-cell-group v-for="(menu, index) in menus" :key="index" :title="menu.label">
      <van-cell
        v-for="(child, child_index) in menu.children"
        :key="child_index"
        :title="child.label"
        is-link
        :to="child.path"
      >
      </van-cell>
    </van-cell-group>
    <van-popup v-model="showSetting" position="left" :style="{ width: '70%', height: '100%' }" closeable close-icon-position="top-left">
      <div style="padding-top:28px"/>
      <van-cell-group>
        <template #title>
          <h1>
            <span>{{ $store.state.user.info.username }}</span>
          </h1>
        </template>
        <van-cell title="退出" icon="log_out" icon-prefix="iconfont" @click="handleLogout"/>
      </van-cell-group>
    </van-popup>
  </div>
</template>
<script>
export default {
  data () {
    return {
      menus: [],
      showSetting: false
    }
  },
  created () {
    this.bindMenu()
  },
  methods: {
    bindMenu () {
      const menus = []
      const routers = this.$store.state.permission.addRoutes
      routers.forEach(router => {
        if (router.hidden || router.path === this.$route.path) {
          return true
        }
        const menu = {
          label: (router.meta && router.meta.title) || router.name,
          children: []
        }
        if (router.children && router.children.length > 0) {
          router.children.forEach(child => {
            if (child.hidden) {
              return true
            }
            menu.children.push({
              label: (child.meta && child.meta.title) || child.name,
              path: child.path
            })
          })
        } else {
          menu.children.push({
              label: menu.label,
              path: router.path
          })
        }
        menus.push(menu)
      })
      this.menus = menus
    },
    handleLogout () {
      this.showSetting = false
      this.$store.dispatch('user/resetToken').then(() => {
          location.reload()
      })
    }
  }
}
</script>
