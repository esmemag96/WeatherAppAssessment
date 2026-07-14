import { createApp } from 'vue'

import { installAppProviders } from '@/app/providers'
import { applyTheme, readStoredTheme } from '@/shared/utils/theme'

import App from './App.vue'
import './style.css'
import './shared/components/engineering-review/artifacts-theme.css'
import './shared/components/engineering-review/engineering-review-theme.css'

applyTheme(readStoredTheme())

const app = createApp(App)

installAppProviders(app)

app.mount('#app')
