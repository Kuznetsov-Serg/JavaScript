Vue.component('basket-list', {
    props: ['basket'],
    template: `
        <div class="basket-list">
            <h1>Корзина</h1>
            <p v-if="basket.length < 1">Нет данных</p> 
            <table v-else class="basket-item">
                <thead>
                    <tr>
                        <td class="table_head">Наименование</td>
                        <td class="table_head">Цена</td>
                        <td class="table_head">Количество</td>
                        <td class="table_head">Сумма</td>
                        <td class="table_head"></td>
                    </tr>
                </thead>   
                <tbody>
                    <basket-item v-for="item in basket" :item="item" 
                        v-on:addToBasket="addToBasket" 
                        v-on:reduceFromBasket="reduceFromBasket" 
                        v-on:delFromBasket="delFromBasket"
                        ></basket-item>    
                </tbody>
                <tfoot>
                    <tr>
                        <td class="table_foot">Итого</td>
                        <td class="table_foot"></td>
                        <td class="table_foot">{{getCountTotal}} шт.</td>
                        <td class="table_foot">{{getPriceTotal}} руб.</td>
                        <td class="table_foot"></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    `,
    methods: {
        // Метод добавления товара в корзину (передан из  Child, пробрасываем дальше в основного Родителя)
        addToBasket(idProduct) {
            console.log('addToBasket in basket-list id= '+ idProduct);
            this.$emit('change_basket', 'add', idProduct);       // передадим в Родителя функцию (add) товара в корзину
        },
        // уменьшение остатка товара в корзине
        reduceFromBasket(idProduct) {
            console.log('reduceFromBasket in basket-list id='+idProduct)
            this.$emit('change_basket', 'reduce', idProduct);       // передадим в Родителя функцию (reduce) товара в корзину
        },

        // удаление товара из корзины
        delFromBasket(idProduct) {
            console.log('delFromBasket in basket-list id='+idProduct)
            this.$emit('change_basket', 'del', idProduct);       // передадим в Родителя функцию (del) товара в корзину
        },
    },
    computed: {
        getPriceTotal () {
            return this.basket.reduce(function (price, item) { return price + item.price * item.count; }, 0);  
        },
        getCountTotal () {
            return this.basket.reduce(function (count, item) { return count + item.count; }, 0); 
        },
        getPositionTotal() {
            return this.basket.length;
        },
        isBasketEmpty () {
            return this.basket.length ? false: true;
        },
        upperCaseName() {
          return this.name.toUpperCase();
        },
    },
});