import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: {},
        pedido: [],
        isProdutoQuantidadeMax: false
    },
    mutations: {
        adicionarProdutoPedido(state, novoItemPedido) {
            const listItemPedidoExistente = state.pedido.filter(itemPedido => {
                return `${itemPedido.idProduto}` === `${novoItemPedido.itemPedido.idProduto}`;
            });

            if (listItemPedidoExistente.length > 0) {
                console.log("Possui produtos")
                const itemPedidoExistente = listItemPedidoExistente[0];
                const qtdProduto = itemPedidoExistente.quantidade + novoItemPedido.itemPedido.quantidade;
                if (qtdProduto > novoItemPedido.qtdProdutoMax) {
                    state.isProdutoQuantidadeMax = false;
                    return
                }
                state.pedido.forEach(itemPedido => {
                    if (`${itemPedido.idProduto}` === `${novoItemPedido.itemPedido.idProduto}`) {
                        itemPedido.quantidade = qtdProduto;
                    }
                })
                // state.pedido.push(novoItemPedido.itemPedido);
                localStorage.setItem('pedido', JSON.stringify(state.pedido));
                state.isProdutoQuantidadeMax = true;
                return
            }
            console.log("Não possui produtos")
            console.log(state.pedido);
            state.pedido.push(novoItemPedido.itemPedido)
            localStorage.setItem('pedido', JSON.stringify(state.pedido))
            state.isProdutoQuantidadeMax = true;
        },
    },

    actions: {
        adicionarProdutoPedido({ commit }, novoItemPedido) {
            return commit('adicionarProdutoPedido', novoItemPedido)
        }
    },
    modules: {}
})