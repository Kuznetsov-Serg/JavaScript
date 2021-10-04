/****************************************************************************
    Lesson_2_05 (Фреймворк Vue.js)
    1.	Добавить методы и обработчики событий для поля поиска. 
        Создать в объекте данных поле searchLine и привязать к нему содержимое поля ввода. 
        На кнопку «Искать» добавить обработчик клика, вызывающий метод FilterGoods.
    2.	Добавить корзину. В html-шаблон добавить разметку корзины. Добавить в объект данных поле isVisibleCart, управляющее видимостью корзины.
    3.	*Добавлять в .goods-list заглушку с текстом «Нет данных» в случае, если список товаров пуст.
 ****************************************************************************/


// дополнительные данные к списку товаров
const catalogAdd = [
    { id_product: 1, product_name: "Ноутбук крутой", price: 150, },
    { id_product: 2, product_name: "Monitor", price: 250 },
    { id_product: 3, product_name: "Мышка отличная", price: 350 },
    { id_product: 4, product_name: "KeyBoard", price: 400 }
];


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
    },

    methods: {
        makeGETRequest(url) {
            return new Promise((resolve) => {
                let xhr;
                if (window.XMLHttpRequest) {                    // Chrome, Mozilla, Opera, Safari
                    xhr = new XMLHttpRequest();
                } else if (window.ActiveXObject) {              // Internet Explorer
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                }
                xhr.onreadystatechange = function () {          // Этот код выполнится после получения ответа
                    if (xhr.readyState === 4) {
                        resolve(JSON.parse(xhr.responseText));
                    }
                }
                xhr.open('GET', url, true);     // Первый параметр - тип запроса, Второй - адрес ресурса, третий - указатель асинхронности  
                xhr.send();                     // Отправить запрос 
            });    
        },

        makeGETRequest1(url, callback) {
            var xhr;
            if (window.XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            } else if (window.ActiveXObject) { 
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    callback(JSON.parse(xhr.responseText));
                }
            }
            xhr.open('GET', url, true);
            xhr.send();
        },
        // Здесь будем фильтровать список товаров
        filterGoods () {
            regExp = new RegExp(this.searchLine, 'i');
            this.filteredGoods = this.goods.filter(good => regExp.test(good.product_name));
        },

        // Видимость корзины
        changeVisibleBasket() {
            this.isVisibleCart ? this.isVisibleCart = false: this.isVisibleCart = true;
        },

        // Метод добавления товара в корзину
        addToBasket(idProduct) {
            console.log('addToBasket id='+idProduct)
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

        show(event) {
            console.log(event);
        },
    },
    mounted() {
        this.makeGETRequest(`${this.API_URL}/catalogData.json`)
            .then((goods) => this.goods = [...goods, ...catalogAdd])
            .then((goods) => this.filteredGoods = goods);

        // this.makeGETRequest(`${this.API_URL}/catalogData.json`, (goods) => {
        //     this.goods = [...goods, ...catalogAdd];
        //     this.filteredGoods = this.goods;
        //     // console.log('mounted: '+this.filteredGoods)
        // });
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
  