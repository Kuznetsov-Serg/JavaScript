Vue.component('goods-list', {
    props: ['goods', 'basket'],
    template: `
        <div class="goods-list">
            <h1>Каталог</h1>
            <p v-if="goods.length < 1">Нет данных</p> 
            <table v-else class="goods-item">
                <thead>
                    <tr>
                        <td class="table_head">Наименование</td>
                        <td class="table_head">Цена</td>
                        <td class="table_head"></td>
                    </tr>
                </thead>
                <tbody>
                    <goods-item v-for="good in goods" :good="good" v-on:addToBasket="addToBasket"></goods-item>     <!-- передадим в Child элемент "товар" -->
                </tbody>
            </table>
        </div>
    `,
    methods: {
        // Метод добавления товара в корзину (передан из  Child, пробрасываем дальше в основного Родителя)
        addToBasket(idProduct) {
            console.log('addToBasket in goods-list id= '+ idProduct);
            this.$emit('change_basket', 'add', idProduct);       // передадим в Родителя функцию добавления (add) товара в корзину
        }
    }
});