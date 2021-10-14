/****************************************************************************
Lesson_2_08 (Тестирование и сборка)
https://ru.hexlet.io/courses/programming-basics/lessons/modules/theory_unit
https://metanit.com/web/vuejs/7.1.php
1.	Вынести компоненты интернет-магазина в отдельные модули и настроить сборку.
2.	Найти в официальной документации способ автоматически перезапускать webpack при изменении файла. 
    Изменить скрипт build, добавив туда этот способ. Подсказка: при запуске нужно использовать определённый флаг.
3.	*Написать приложение-калькулятор, используя подход BDD. 
    Приложение должно состоять из четырёх методов для сложения, вычитания, умножения и деления. 
    Каждый метод принимает на вход два аргумента и выполняет действие. 
    При написании тестов учесть случаи, когда на вход подаются не числа, а строки, null или undefined.
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

// Блок импорта компонент
import './vue-search';
import './vue-error';
import './goods-list';
import './goods-item';
import './basket-list';
import './basket-item';

// создадим экземпляр класса Vue и привяжем к элементу #app
const app = new Vue({
    el: '#app',
    data: {
        goods: [],
        filteredGoods: [],
        basket: [],
        searchLine: '',
        isVisibleCart: true,
        // API_URL : 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses',
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
            this.filteredGoods = searchLine ?
                this.goods.filter(product => product.product_name.toLowerCase().includes(searchLine.toLowerCase())) :
                this.goods;
            // Пришлось закомментировать, т.к. при импорте модулей начинает ругаться: "regExp is not defined"
            // regExp = new RegExp(searchLine, 'i');
            // this.filteredGoods = this.goods.filter(good => regExp.test(good.product_name));
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
  