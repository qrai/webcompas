import { createApp } from 'vue'
import App from './App.vue'

// Routing
import { createRouter, createWebHashHistory} from 'vue-router'

import BuilderPage from './views/BuilderPage'

const routes = [
	{ path: '/', component: BuilderPage },
]
const router = createRouter({
	history: createWebHashHistory(),
	routes, 
})

createApp(App).use(router).mount('#app')