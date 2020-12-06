import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import './plugins/axios'
import VueMask from 'v-mask'

Vue.use(VueMask)

Vue.config.productionTip = false

Vue.filter('currency', value => {
    return 'R$' + value.toLocaleString()
})

Vue.filter('data', value => {
    return 'R$' + value.toLocaleString()
})

new Vue({
    router,
    store,
    created() {
        const userString = localStorage.getItem('user')
        if (userString) {
            const userData = JSON.parse(userString)
            this.$store.user = userData
            const pedidoString = localStorage.getItem('pedido')
            if (pedidoString) {
                const pedidoData = JSON.parse(pedidoString)
                this.$store.pedido = Array.from(pedidoData)
            }
        }
        this.$http.interceptors.response.use(
            response => response,
            error => {
                if (error.response.status === 401) {
                    this.$router.push({ name: "login" })
                }
                return Promise.reject(error)
            }
        )
    },
    vuetify,
    render: h => h(App)
}).$mount('#app')