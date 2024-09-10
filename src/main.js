import App from './App.vue'
import Vuelidate from '@vuelidate/core'
import es from 'moment/dist/locale/es'
import moment from 'moment/dist/moment'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from './router'

moment.updateLocale('es', es)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Vuelidate)

app.mount('#app')
