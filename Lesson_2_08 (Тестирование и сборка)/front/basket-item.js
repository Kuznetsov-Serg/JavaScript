Vue.component('basket-item', {
    props: ['item'],
    template: `
        <tr class="basket-item">
            <td>{{item.product_name}}</td>
            <td>{{item.price}} руб.</td>
            <td>{{item.count}} шт.</td>
            <td>{{item.price * item.count}} руб.</td>
            <td>
                <button class="button_active" :data-id="item.id" v-on:click="addToBasket(item.id)">➕</button>
                <button class="button_active" :data-id="item.id" v-on:click="reduceFromBasket(item.id)">➖</button>
                <button class="button_active" :data-id="item.id" v-on:click="delFromBasket(item.id)">❌</button>
            </td>
        </tr>
    `,
    methods: {
        addToBasket(idProduct) {
            this.$emit('addToBasket', idProduct);       // передадим в Родителя функцию добавления товара в корзину
            console.log('addToBasket in child id = ' + idProduct);
        },
        reduceFromBasket(idProduct) {
            this.$emit('reduceFromBasket', idProduct);       // передадим в Родителя функцию добавления товара в корзину
            console.log('reduceFromBasket in child id = ' + idProduct);
        },
        delFromBasket(idProduct) {
            this.$emit('delFromBasket', idProduct);       // передадим в Родителя функцию добавления товара в корзину
            console.log('delFromBasket in child id = ' + idProduct);
        },
    }
  
});