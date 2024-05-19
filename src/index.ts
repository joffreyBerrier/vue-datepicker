import type { App } from 'vue'
import DatePicker from './components/DatePicker.vue'

export { DatePicker }

export default {
  install(app: App) {
    app.component('DatePicker', DatePicker)
  }
}
