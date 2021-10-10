/****************************************************************************
   Lesson_2_06 (Компоненты Vue.js)
    1.	Вынести поиск в отдельный компонент.
    2.	Вынести корзину в отдельный компонент.
    3.	*Создать компонент с сообщением об ошибке. Компонент должен отображаться, когда не удаётся выполнить запрос к серверу.
 ****************************************************************************/


// дополнительные данные к списку товаров
const catalogAdd = [
    { id_product: 1, product_name: "Ноутбук крутой", price: 150, },
    { id_product: 2, product_name: "Monitor", price: 250 },
    { id_product: 3, product_name: "Мышка отличная", price: 350 },
    { id_product: 4, product_name: "KeyBoard", price: 400 }
];

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
            // Впрямую не меняет FilteredGoods - ругается на изменение данных Родителя
            // regExp = new RegExp(this.searchLine, 'i');
            // this.filtered_goods = this.goods.filter(good => regExp.test(good.product_name));
            //  console.log('filteredGoods :' + this.filtered_goods);
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
        // Метод добавления товара в корзину (передан из  Child)
        addToBasket(idProduct) {
            console.log('addToBasket in parent id= '+ idProduct);
            var basketItem = this.basket.find((item) => idProduct === item.id_product); // ищем в корзине такой-же товар
            if (basketItem) {           // нашли
                basketItem.count++;     // увеличиваем количество товара в корзине
                this.$forceUpdate();    // Принудительно render, т.к. vue реактивен и не увидит изменений Заметьте, что мы используем $ в качестве префикса
            }
            else {
                const catalogItem = this.goods.find((item) => idProduct === item.id_product);   // ищем товар в каталоге
                basketItem = JSON.parse(JSON.stringify(catalogItem));                           // делаем клонирование в корзину
                basketItem.count = 1;  
                this.basket.push(basketItem);
            }
        }
    }
});

Vue.component('goods-item', {
    props: ['good'],
    template: `
        <tr class="goods-item">
            <td>{{good.product_name}}</td>
            <td>{{good.price}} руб.</td>
            <td><button class="button_active" :data-id="good.id_product" @click="addToBasket(good.id_product)">в корзину</button></td>
        </tr>  
    `,
    methods: {
        addToBasket(idProduct) {
            this.$emit('addToBasket', idProduct);       // передадим в Родителя функцию добавления товара в корзину
            console.log('addToBasket in child id = ' + idProduct);
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
        // Метод добавления товара в корзину
        addToBasket(idProduct) {
            console.log('addToBasket id='+idProduct)
            var basketItem = this.basket.find((item) => idProduct === item.id_product); // ищем в корзине товар
            basketItem.count++;     // увеличиваем количество товара в корзине
            // this.$forceUpdate();    // Принудительно render, т.к. vue реактивен и не увидит изменений Заметьте, что мы используем $ в качестве префикса
        },

        // уменьшение остатка товара в корзине
        reduceFromBasket(idProduct) {
            console.log('reduceFromBasket id='+idProduct)
            for (let index = 0; index < this.basket.length; index++) {
                if (this.basket[index].id_product === idProduct) {
                    if (this.basket[index].count < 2)           // после уменьшения количества останется 0 товаров
                        this.basket.splice(index, 1);           // удалим элемент
                    else
                        this.basket[index].count -= 1;          // уменьшим количество товара
                    break;
                }
            }
        },

        // удаление товара из корзины
        delFromBasket(idProduct) {
            console.log('reduceFromBasket id='+idProduct)
            for (let index = 0; index < this.basket.length; index++) {
                if (this.basket[index].id_product === idProduct) {
                    this.basket.splice(index, 1);         // удалим элемент
                    break;
                }
            }
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
                <button class="button_active" :data-id="item.id_product" v-on:click="addToBasket(item.id_product)">➕</button>
                <button class="button_active" :data-id="item.id_product" v-on:click="reduceFromBasket(item.id_product)">➖</button>
                <button class="button_active" :data-id="item.id_product" v-on:click="delFromBasket(item.id_product)">❌</button>
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
            // this.flag_error = false;
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
        // получение списка товаров с сервера ( sendError для проброски функции об ошибке)
        makeGETRequest(url, sendError) {                        
            return new Promise((resolve) => {
                let xhr;
                if (window.XMLHttpRequest) {                    // Chrome, Mozilla, Opera, Safari
                    xhr = new XMLHttpRequest();
                } else if (window.ActiveXObject) {              // Internet Explorer
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                }
                xhr.onreadystatechange = function () {          // Этот код выполнится после получения ответа
                    if (xhr.readyState === 4) 
                        if (xhr.status == 200)                  // проверяем состояние запроса и числовой код состояния HTTP ответа)
                            resolve(JSON.parse(xhr.responseText));
                        else {
                            sendError(`Ошибка получения данных с сервера: ${xhr.responseText}`);
                            resolve([]);
                        }
                };
                xhr.open('GET', url, true);     // Первый параметр - тип запроса, Второй - адрес ресурса, третий - указатель асинхронности  
                xhr.send();                     // Отправить запрос 
            });    
        },
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
                // this.errorDescription = 'При фильтрации, список товаров пуст!!!'
                // this.flagError = true;
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
        }
    },
    mounted() {
        this.makeGETRequest(`${this.API_URL}/catalogData.json`, this.sendError)
            .then((goods) => { if (goods.length<4) this.sendError('С сервера получен список менее 4-х элементов!!! (мы дополним...)'); return goods;})
            .then((goods) => this.goods = [...goods, ...catalogAdd])
            .then((goods) => this.filteredGoods = goods);
    },
  });
  