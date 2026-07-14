import { createApp } from 'vue'

import { installAppProviders } from '@/app/providers'
import { applyTheme, readStoredTheme } from '@/shared/utils/theme'

import App from './App.vue'
import './style.css'

applyTheme(readStoredTheme())

const app = createApp(App)

installAppProviders(app)

app.mount('#app')
