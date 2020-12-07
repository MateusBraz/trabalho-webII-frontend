import Vue from "vue"

export default new Vue({
    methods: {
        setIsProdutoAdicionado(valor) {
            this.$emit('isProdutoAdicionado', valor);
        },
        onIsProdutoAdicionado(callback) {
            this.$on('isProdutoAdicionado', callback);
        },
    }
})