<script>
import DjangoImageField from './DjangoImageField.vue'

export default {
  extends: DjangoImageField,
  props: Object.assign({}, DjangoImageField.props, {
    accept: {
      type: String,
      default: '*.*'
    },
    icon: {
      type: String,
      default: 'add-square'
    }
  })
}
</script>
