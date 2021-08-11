<template>
  <van-uploader
    :after-read="afterRead"
    :before-delete="beforeDelete"
    :file-list="fileList"
    :accept="accept"
    :upload-icon="icon"
    :max-count="1">
    <template #preview-cover="{ file }">
      <div class="preview-cover van-ellipsis">{{ file && file.name }}</div>
    </template>
  </van-uploader>
</template>
<script>
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: [String, Object],
      default: null
    },
    canDelete: {
      type: Boolean,
      default: true
    },
    accept: {
      type: String,
      default: 'image/*'
    },
    icon: {
      type: String,
      default: 'photograph'
    }
  },
  data () {
    return {
      fileList: []
    }
  },
  watch: {
    value (val) {
      this.bindFileList(val)
    }
  },
  mounted () {
    this.bindFileList(this.value)
  },
  methods: {
    getNameFromURI (value) {
      const url = decodeURI(value)
      const index = url.lastIndexOf('/')
      return url.substr(index + 1)
    },
    bindFileList (value) {
      if (value) {
        // this.fileList.slice(0)
        const item = value instanceof Object ? value : {
          uid: 1,
          name: this.getNameFromURI(value),
          url: value
        }
        this.fileList.push(item)
      }
    },
    afterRead (file) {
      this.$emit('change', file)
    },
    beforeDelete () {
      this.fileList.splice(0)
      this.$emit('change', '')
    }
  }
}
</script>
<style>
  .preview-cover {
    position: absolute;
    bottom: 0;
    box-sizing: border-box;
    width: 100%;
    padding: 4px;
    color: #fff;
    font-size: 12px;
    text-align: center;
    background: rgba(0, 0, 0, 0.3);
  }
</style>
