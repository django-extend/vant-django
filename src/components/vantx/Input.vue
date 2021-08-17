<template>
  <textarea
    v-if="type==='textarea'"
    class="van-field__control"
    :value="value"
    :placeholder="placeholder"
    @input="handleChange"
  />
  <input
    v-else
    class="van-field__control"
    :value="value"
    :type="inputType"
    :placeholder="placeholder"
    :maxlength="maxlength"
    @input="handleChange"
  />
</template>
<script>
export default {
  name: 'VanxInput',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: [String, Number],
      default: null
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    maxlength: {
      type: Number,
      default: null
    }
  },
  computed: {
    inputType () {
      return this.type
    }
  },
  methods: {
    handleChange (e) {
      this.$emit('change', e.target.value)
    }
  }
}
</script>
