import App from './App.vue'
import Vuelidate from '@vuelidate/core'
import es from 'moment/dist/locale/es'
import moment from 'moment/dist/moment'
import { createApp } from 'vue'
import { router } from './router'
import { setupApiInterceptors } from './services/api'

moment.updateLocale('es', es)

const app = createApp(App)

app.use(router)
app.use(Vuelidate)

setupApiInterceptors()

app.mount('#app')
