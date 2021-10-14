Vue.component('goods-item', {
    props: ['good'],
    template: `
        <tr class="goods-item">
            <td>{{good.product_name}}</td>
            <td>{{good.price}} руб.</td>
            <td><button class="button_active" :data-id="good.id" @click="addToBasket(good.id)">в корзину</button></td>
        </tr>  
    `,
    methods: {
        addToBasket(idProduct) {
            console.log('addToBasket in goods-item id = ' + idProduct);
            this.$emit('addToBasket', idProduct);       // передадим в Родителя функцию добавления товара в корзину
        }
    }
  
});