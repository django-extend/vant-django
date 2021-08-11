import RouteView from '@/layouts/RouteView'

const components = {
  defaults: {
    'menu': RouteView,
    'dashboard': () => import('@/views/Dashboard'),
    'django': () => import('@/components/Django'),
    '_edit': () => import('@/components/Django/form/EditForm'),
    '_add': () => import('@/components/Django/form/AddForm'),
    '_view': () => import('@/components/Django/form/ViewForm')
  },
  custom: {

  },
  get (key) {
    return this.custom[key] || this.defaults[key]
  }
}
export default components
