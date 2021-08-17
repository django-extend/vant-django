<template>
  <div>
    <van-field
      colon
      :label="meta.label"
      :value="valueDisplay"
      :name="name"
      :error-message="errorMessage"
      :rules="rules"
    >
      <template v-if="meta.type==='integer'" #input>
        <van-stepper
          :input-width="100"
          :value="value"
          :min="Number.MIN_SAFE_INTEGER"
          :default-value="0"
          @input="handleChange"/>
      </template>
      <template v-else-if="meta.type==='decimal'" #input>
        <van-stepper
          :input-width="100"
          :value="value"
          :step="getDecimalStep(meta.decimal_places)"
          :default-value="0"
          :decimal-length="meta.decimal_places"
          @input="handleChange"/>
      </template>
      <template v-else-if="meta.type==='choice'" #input>
        <django-choice-field :value="value" :choices="meta.choices" @change="handleChange"/>
      </template>
      <template v-else-if="meta.type==='boolean'" #input>
        <van-switch :value="value" :size="20" @change="handleChange"/>
      </template>
      <template v-else-if="meta.type==='date'" #input>
        <django-datetime-field :value="value" type="date" @change="handleChange"/>
      </template>
      <template v-else-if="meta.type==='datetime'" #input>
        <django-datetime-field :value="value" type="datetime" @change="handleChange"/>
      </template>
      <template v-else-if="meta.type==='time'" #input>
        <django-datetime-field :value="value" type="time" @change="handleChange"/>
      </template>
      <template v-else-if="meta.type==='image upload'" #input>
        <django-image-field :value="value" :can-delete="!meta.required" @change="handleChange" />
      </template>
      <template v-else-if="meta.type==='file upload'" #input>
        <django-file-field :value="value" :can-delete="!meta.required" @change="handleChange" />
      </template>
      <template v-else-if="meta.type==='field' && meta.field_type==='ManyToOne'" #input>
        <foreign-select :value="value" :relation="meta.relation" @change="handleChange"/>
      </template>
      <template v-else-if="meta.type==='field' && meta.field_type==='ManyToMany'" #input>
        <django-many-to-many-field :value="value" :choices="meta.choices" @change="handleChange"/>
      </template>
      <template v-else-if="meta.input_type==='textarea'" #input>
        <vanx-input :value="value" type="textarea" @change="handleChange"/>
      </template>
      <template v-else-if="meta.input_type==='password'" #input>
        <vanx-input :value="value" type="password" @change="handleChange"/>
      </template>
      <template v-else #input>
        <vanx-input :maxlength="meta.max_length" :value="value" @change="handleChange"/>
      </template>
    </van-field>
  </div>
</template>
<script>
import VanxInput from '@/components/vantx/Input'
import DjangoChoiceField from './DjangoChoiceField'
import DjangoDatetimeField from './DjangoDatetimeField'
import DjangoImageField from './DjangoImageField'
import DjangoFileField from './DjangoFileField'
import ForeignSelect from './ForeignSelect'
import DjangoManyToManyField from './DjangoManyToManyField'

export default {
  components: {
    VanxInput,
    DjangoChoiceField,
    DjangoDatetimeField,
    DjangoImageField,
    DjangoFileField,
    ForeignSelect,
    DjangoManyToManyField
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: [String, Number, Boolean, Array, Object],
      default: null
    },
    meta: {
      type: Object,
      required: true
    },
    rules: {
      type: Array,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    errorMessage: {
      type: String,
      default: ''
    }
  },
  computed: {
    valueDisplay () {
      return this.value ? this.value.toString() : ''
    }
  },
  methods: {
    getDecimalStep (precision) {
      let rs = 1
      for (let i = 0; i < precision; i++) {
        rs /= 10
      }
      return rs
    },
    handleChange (value) {
      this.$emit('change', value)
    }
  }
}
</script>
