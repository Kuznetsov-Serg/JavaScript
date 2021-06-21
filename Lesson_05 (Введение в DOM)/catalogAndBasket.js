// Lesson_05 - Введение в DOM

/****************************************************************************
 *  2.	Сделать генерацию корзины динамической: 
 *      верстка корзины не должна находиться в HTML-структуре. 
 *      Там должен быть только div, в который будет вставляться корзина, сгенерированная на базе JS:
 *       2.1.	Пустая корзина должна выводить строку «Корзина пуста»;
 *       2.2.	Наполненная должна выводить «В корзине: n товаров на сумму m рублей».
 *  3.	* Сделать так, чтобы товары в каталоге выводились при помощи JS:
*       3.1.	Создать массив товаров (сущность Product);
*       3.2.	При загрузке страницы на базе данного массива генерировать вывод из него. 
            HTML-код должен содержать только div id=”catalog” без вложенного кода. Весь вид каталога генерируется JS.
 */


'use strict';

const catalog = [
    { id: 1, name: "NoteBook", measureUnit: 'шт', flagArh: false },
    { id: 2, name: "Monitor", measureUnit: 'шт', flagArh: false },
    { id: 3, name: "Mouse", measureUnit: 'шт', flagArh: true },
    { id: 4, name: "KeyBoard", measureUnit: 'шт', flagArh: false }
];

const price = [
    { id: 1, idProduct: 1, cost: 150, },
    { id: 2, idProduct: 2, cost: 250, },
    { id: 3, idProduct: 3, cost: 350, },
    { id: 4, idProduct: 4, cost: 400, }
];

const basket = [
    { id: 1, idPrice: 1, count: 3 },
    { id: 2, idPrice: 2, count: 2 },
    { id: 3, idPrice: 4, count: 4 }
];


// function getProductById(products, id) {
//     for (let val of products) {
//         if (id == val.id) return val;
//     }
// }

// Объект "Каталог"
const catalogObj = {
    item: [],

    init(catalog) {
        this.containerElement = document.getElementById('catalog_table');
        this.item = JSON.parse(JSON.stringify(catalog));        // глубокое клонирование
        this.render();
    },
    render() {
        for (let row of this.item) {
            this.containerElement.insertAdjacentHTML('beforeend', `<tr><td>${row.name}
                    </td><td>${row.measureUnit}</td><td>${row.flagArh ? '√' : ''}</td></tr>`);
        }
    },
    getElementById(id) {
        for (let val of this.item) {
            if (val.id == id) return val;
        }
    },
}


// Объект "Прайс"
const priceObj = {
    item: [],

    init(price, catalogObj) {
        for (let val of price) {
            const product = catalogObj.getElementById(val.idProduct);
            val.productName = product.name;
            this.item.push(val);
        }
    },
    getElementById(id) {
        for (let val of this.item) {
            if (val.id == id) return val;
        }
    },
}

// Объект "Корзина"
const basketObj = {
    item: [],
    priceObj,
    saveBasket: [],
    containerElement: null,
    footerStr: null,
    cartButton: null,

    init(basket, priceObj) {
        this.containerElement = document.getElementById('basket_table');
        this.footerStr = document.getElementById('basket_total');
        this.cartButton = document.querySelector('.my-btn');
        this.cartButton.addEventListener('click', this.delProduct.bind(this));  // Кнопка для работы с содержимым Корзины (bind для подстановки объекта)

        this.priceObj = priceObj;
        for (let val of basket) {
            const price = this.priceObj.getElementById(val.idPrice)
            val.productName = price.productName;
            val.cost = price.cost;
            this.item.push(val);
        }
        this.saveBasket = JSON.parse(JSON.stringify(this.item));    // сохраним на случай переЗаполнения корзины (глубокое клонирование)
        this.render();
    },
    getTotalSum() {
        return this.item.reduce(function (price, item) {
            return price + item.cost * item.count;
        }, 0);
    },
    getTotalCount() {
        return this.item.length;
    },

    render() {
        this.delBasketWindow();
        let trElem, cell, totalCount = 0;

        for (let row of this.item) {
            totalCount++;

            trElem = document.createElement('tr');
            this.containerElement.appendChild(trElem);

            appendTd(trElem, totalCount);
            appendTd(trElem, row.productName);
            appendTd(trElem, row.count);
            appendTd(trElem, row.cost);
            appendTd(trElem, row.count * row.cost);
        }
        if (totalCount != 0) {                          // Корзина НЕ пуста
            this.containerElement.style.display = "block";   // Покажем верх таблицы с заголовком
            this.footerStr.textContent = `В корзине: ${totalCount} товара(ов) на сумму ${this.getTotalSum()}`;
        }
        else {
            this.containerElement.style.display = "none";    // Уберем верх таблицы с заголовком
            this.footerStr.textContent = "Корзина пуста";
        }
    },
    // удалим нижнюю запись из корзины
    delProduct() {
        if (this.item.length == 0) {       // корзина пуста --> заполним ее 
            this.item = JSON.parse(JSON.stringify(this.saveBasket));    // вернем первоначальную корзину (глубокое клонирование)
            this.cartButton.textContent = 'Удалить последнюю позицию из Корзины';
        }
        else {
            this.item.pop();
            if (this.item.length == 0)
                this.cartButton.textContent = 'Заполнить корзину';
        }
        this.render();
    },
    // Удалим из таблицы "Корзина" все, кроме заголовка
    delBasketWindow() {
        const row = document.querySelector('#basket_table').querySelectorAll(`tr`);
        for (let i = 1; i < row.length; i++) {
            row[i].remove();
        }
    },
}

function appendTd(parent, val) {
    // let cell = document.createElement('td');
    // cell.textContent = val;
    // parent.appendChild(cell);

    parent.insertAdjacentHTML('beforeend', `<td>${val}</td>`);  // более краткий аналог
}

catalogObj.init(catalog);               // объект "Каталог"
priceObj.init(price, catalogObj);       // Объект "Прайс"
basketObj.init(basket, priceObj);       // объект "Корзина"