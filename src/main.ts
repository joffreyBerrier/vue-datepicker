import './styles.css'
import DatePicker from './components/DatePicker.vue'

import type { App } from 'vue'

export default {
  install: (app: App) => {
    app.component('DatePicker', DatePicker)
  }
}

export { DatePicker }
