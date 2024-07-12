import { createApp } from 'vue'
import App from './App.vue'
import DatePicker from '../../dist/vue-calendar-3.js'
import '../../dist/main.css'

const app = createApp(App)

app.use(DatePicker)

app.mount('#app')
