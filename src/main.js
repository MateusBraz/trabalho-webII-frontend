import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import './plugins/axios'

Vue.config.productionTip = false

new Vue({
    router,
    store,
    created() {
        const userString = localStorage.getItem('user')
        if (userString) {
            const userData = JSON.parse(userString)
            this.$store.user = userData
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