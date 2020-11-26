import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
// import store from '../store'
// import Login from '../views/login/Login.vue'
Vue.use(VueRouter)

const routes = [{
        path: '/',
        component: () =>
            import ( /* webpackChunkName: "Home" */ "../views/Home.vue"),
        meta: { requiresAuth: true }
    },
    // {
    //     path: '/about',
    //     name: 'About',
    //     // route level code-splitting
    //     // this generates a separate chunk (about.[hash].js) for this route
    //     // which is lazy-loaded when the route is visited.
    //     component: () =>
    //         import ( /* webpackChunkName: "about" */ '../views/About.vue')
    // },
    {
        path: '/login',
        name: 'login',
        component: () =>
            import ( /* webpackChunkName: "Login" */ "../views/login/Login.vue")
    },
    {
        path: "/usuario/cadastrar",
        name: "cadastrarUsuario",
        component: () =>
            import ( /* webpackChunkName: "User" */ "../views/usuario/Cadastro.vue"),
        meta: { requiresAuth: true }
    },
    {
        path: "/usuario/listar",
        name: "listarUsuario",
        component: () =>
            import ( /* webpackChunkName: "User" */ "../views/usuario/Lista.vue"),
        meta: { requiresAuth: true }
    },
    {
        path: "/pessoa/cadastrar",
        name: "cadastrarPessoa",
        component: () =>
            import ( /* webpackChunkName: "User" */ "../views/pessoa/Cadastro.vue"),
        meta: { requiresAuth: true }
    },
    {
        path: "/pessoa/listar",
        name: "listarPessoa",
        component: () =>
            import ( /* webpackChunkName: "User" */ "../views/pessoa/Lista.vue"),
        meta: { requiresAuth: true }
    },
    {
        path: "/produto/cadastrar",
        name: "cadastrarProduto",
        component: () =>
            import ( /* webpackChunkName: "User" */ "../views/produto/Cadastro.vue"),
        meta: { requiresAuth: true }
    },
    {
        path: "/produto/listar",
        name: "listarProduto",
        component: () =>
            import ( /* webpackChunkName: "User" */ "../views/produto/Lista.vue"),
        meta: { requiresAuth: true }
    },
    {
        path: "/Pedido/cadastrar",
        name: "cadastrarPedido",
        component: () =>
            import ( /* webpackChunkName: "User" */ "../views/pedido/Cadastro.vue"),
        meta: { requiresAuth: true }
    },
    {
        path: "/Pedido/listar",
        name: "listarPedido",
        component: () =>
            import ( /* webpackChunkName: "User" */ "../views/pedido/Lista.vue"),
        meta: { requiresAuth: true }
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})


router.beforeEach((to, from, next) => {
    const loggedIn = localStorage.getItem('user')
    if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
        next({ name: "login" })
    }
    next();
});


export default router

// router.beforeEach((to, from, next) => {
//     if (to.matched.some(record => record.meta.requiresAuth)) {
//         // this route requires auth, check if logged in
//         // if not, redirect to login page.
//         if (!auth.loggedIn()) {
//             next({
//                 path: '/login',
//                 query: { redirect: to.fullPath }
//             })
//         } else {
//             next()
//         }
//     } else {
//         next() // make sure to always call next()!
//     }
// })