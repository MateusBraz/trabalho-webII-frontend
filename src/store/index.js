import Vue from 'vue'
import Vuex from 'vuex'
import barramento from '@/barramento'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: {},
    },
    mutations: {
        adicionarProdutoPedido(state, novoItemPedido) {
            var pedido = [];
            if (JSON.parse(localStorage.getItem("pedido")) != null) {
                pedido = JSON.parse(localStorage.getItem("pedido"));
                const listItemPedidoExistente = pedido.filter(itemPedido => {
                    return itemPedido.idProduto === novoItemPedido.itemPedido.idProduto;
                });

                if (listItemPedidoExistente.length > 0) {
                    const itemPedidoExistente = listItemPedidoExistente[0];
                    const qtdProduto = itemPedidoExistente.quantidade + novoItemPedido.itemPedido.quantidade;
                    if (qtdProduto > novoItemPedido.qtdProdutoMax) {
                        barramento.setIsProdutoAdicionado(false);
                    } else {
                        pedido.forEach(itemPedido => {
                                if (itemPedido.idProduto === novoItemPedido.itemPedido.idProduto) {
                                    itemPedido.quantidade = qtdProduto;
                                }
                            })
                            // state.pedido.push(novoItemPedido.itemPedido);
                        localStorage.setItem('pedido', JSON.stringify(pedido));
                        barramento.setIsProdutoAdicionado(true);
                    }
                } else {
                    pedido.push(novoItemPedido.itemPedido);
                    localStorage.setItem('pedido', JSON.stringify(pedido));
                    barramento.setIsProdutoAdicionado(true);
                }
            } else {
                pedido.push(novoItemPedido.itemPedido);
                localStorage.setItem('pedido', JSON.stringify(pedido));
                barramento.setIsProdutoAdicionado(true);
            }
        },
        deletarItemPedido(state, itemPedido) {
            var pedido = JSON.parse(localStorage.getItem("pedido"));
            const index = pedido.findIndex(item => item.idProduto === itemPedido.idProduto);
            pedido.splice(index, 1);
            localStorage.setItem('pedido', JSON.stringify(pedido));
        }
    },

    actions: {
        adicionarProdutoPedido({ commit }, novoItemPedido) {
            commit('adicionarProdutoPedido', novoItemPedido)
        },
        deletarItemPedido({ commit }, itemPedido) {
            commit('deletarItemPedido', itemPedido)
        }
    },

    modules: {}
})