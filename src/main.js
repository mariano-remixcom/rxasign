import App from './App.vue'
import es from 'moment/dist/locale/es'
import moment from 'moment/dist/moment'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from './router'

moment.locale('es', es)

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
