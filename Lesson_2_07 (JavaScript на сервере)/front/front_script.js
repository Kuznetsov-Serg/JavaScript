/****************************************************************************
   Lesson_2_07 (JavaScript на сервере)
    1.	Привязать добавление товара в корзину к реальному API.
    2.	Добавить API для удаления товара из корзины.
    3.	*Добавить файл stats.json, в котором будет храниться статистика действий пользователя с корзиной. 
        В файле должны быть поля с названием действия (добавлено/удалено), названием товара, 
        с которым производилось действие и временем, когда оно было совершено.
 ****************************************************************************/



// дополнительные данные к списку товаров
const catalogAdd = [
    { id: 1, product_name: "Ноутбук крутой", price: 150, },
    { id: 2, product_name: "Monitor", price: 250 },
    { id: 3, product_name: "Мышка отличная", price: 350 },
    { id: 4, product_name: "KeyBoard", price: 400 }
];

const postResponse = async (url, data) => {
    return await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      },
    });
}
// Считать содержимое корзины
const fetchBasket = async () => {
    return await fetch(`/basket`)
        .then(resp => resp.json());
}

Vue.component('vue-search', {
    props: ['goods', 'filtered_goods'],
    data: () => ({ searchLine: ''}),
    template: `
        <div>
        <input type="text" v-model="searchLine" class="goods-search" v-on:input="show($event.target.value)"/>
        <button class="search-button" type="button" v-on:click=filterGoods>Искать</button>
        </div>
    `,
    methods: {
        show(event) {
            console.log(event);
            this.searchLine = event;
        },
        // Здесь будем фильтровать список товаров
        filterGoods () {
            console.log('Child вызывает filterGoods searchLine = '+ this.searchLine);   
            this.$emit('filter_goods', this.searchLine);
        },
    }
})


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

// Error
Vue.component('vue-error', {
    props: ['flag_error', 'error_description'],
    template: `
        <div v-if="flag_error" class="error">
            <h1>Ошибка!</h1>
            <p>{{error_description}}</p>
            <button class="button_active" v-on:click=closeError>❌ Закрыть</button>
        </div>
    `,
    methods: {
        closeError() {
            console.log('Закрыть ошибку')
            this.$emit('clear_error');       // передадим в Родителя команду закрыть ошибку
        }
    }
})


// создадим экземпляр класса Vue и привяжем к элементу #app
const app = new Vue({
    el: '#app',
    data: {
        goods: [],
        filteredGoods: [],
        basket: [],
        searchLine: '',
        isVisibleCart: true,
        API_URL : 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses',
        flagError: false,
        errorDescription: '',
    },

    methods: {
        sendError(errorMessage) {
            this.errorDescription = errorMessage;
            this.flagError = true;
            console.log('sendError '+errorMessage);
        },
        // Здесь будем фильтровать список товаров (вызывается из Child)
        filter_goods (searchLine) {
            console.log('вызов из Child родительского filter_goods ' + searchLine);
            regExp = new RegExp(searchLine, 'i');
            this.filteredGoods = this.goods.filter(good => regExp.test(good.product_name));
            if (this.filteredGoods.length == 0) {      
                this.sendError('При фильтрации, список товаров пуст!!!');
                console.log(this.errorDescription);
            }
        },
        // Видимость корзины
        changeVisibleBasket() {
            this.isVisibleCart ? this.isVisibleCart = false: this.isVisibleCart = true;
        },
        // Убрать сообщение об ошибке
        clear_error() {
            this.flagError = false;
            this.errorDescription = '';
        },  
        // Метод работы с корзиной
        change_basket(typeOp, idProduct) {
            console.log(`typeOp = ${typeOp} in main id= ${idProduct}`);
            const goodItem = this.goods.find((item) => idProduct === item.id);      // ищем товар в каталоге
            if (typeOp == 'add')
                postResponse('/addToBasket', goodItem)
                    .then((result) => fetchBasket())
                    .then((result) => this.basket = result);
            else if (typeOp == 'reduce')
                postResponse('/reduceFromBasket', goodItem)
                    .then((result) => fetchBasket())
                    .then((result) => this.basket = result);
            else if (typeOp == 'del')
                postResponse('/delFromBasket', goodItem)
                    .then((result) => fetchBasket())
                    .then((result) => this.basket = result);
        },
    },
    mounted: async function fetchGoods() {
        return await fetch(`/catalog`)
            .then(resp => resp.json())
            .then((goods) => { if (goods.length<4) this.sendError('С сервера получен список менее 4-х элементов!!! (мы дополним...)'); return goods;})
            .then((goods) => this.goods = [...goods, ...catalogAdd])
            .then((goods) => this.filteredGoods = goods);
    },
    beforeMount: async function fetchBasket() {
        return await fetch(`/basket`)
            .then(resp => resp.json())
            .then((goods) => this.basket = goods);
    },
});
  