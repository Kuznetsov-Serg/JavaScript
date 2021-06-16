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

const products = [
    { id: 1, name: "NoteBook", measureUnit: 'шт', flagArh: false },
    { id: 2, name: "Monitor", measureUnit: 'шт', flagArh: false },
    { id: 3, name: "Mouse", measureUnit: 'шт', flagArh: true },
    { id: 4, name: "KeyBoard", measureUnit: 'шт', flagArh: false }
]

const price = [
    { id: 1, idProduct: 1, cost: 150, },
    { id: 2, idProduct: 2, cost: 250, },
    { id: 3, idProduct: 3, cost: 350, },
    { id: 4, idProduct: 4, cost: 400, }
]

let basket = [];

function initBasket() {
    basket = [
        { id: 1, idPrice: 1, count: 3 },
        { id: 2, idPrice: 2, count: 2 },
        { id: 3, idPrice: 4, count: 4 }
    ]
}

function initCellsCatalog() {
    let containerElement = document.getElementById('catalog_table');
    let trElem, cell;

    for (let row of products) {
        // trElem = document.createElement('tr');
        // containerElement.appendChild(trElem);

        // appendTd(trElem, row.name);
        // appendTd(trElem, row.measureUnit);
        // appendTd(trElem, (row.flagArh ? '√' : ''));

        // Более краткая запись: 
        containerElement.insertAdjacentHTML('beforeend', `<tr><td>${row.name}
                </td><td>${row.measureUnit}</td><td>${row.flagArh ? '√' : ''}</td></tr>`);
    }
}

function appendTd(parent, val) {
    // let cell = document.createElement('td');
    // cell.textContent = val;
    // parent.appendChild(cell);

    parent.insertAdjacentHTML('beforeend', `<td>${val}</td>`);  // более краткий аналог
}

function initCellsBasket() {
    let containerElement = document.getElementById('basket_table');
    let trElem, cell, totalSum = 0, totalCount = 0;

    for (let row of basket) {
        const priceStr = getPriseById(price, row.idPrice);
        const productStr = getProductById(products, priceStr.idProduct)
        totalCount++;
        totalSum += row.count * priceStr.cost;

        trElem = document.createElement('tr');
        containerElement.appendChild(trElem);

        appendTd(trElem, totalCount);
        appendTd(trElem, productStr.name);
        appendTd(trElem, row.count);
        appendTd(trElem, priceStr.cost);
        appendTd(trElem, row.count * priceStr.cost);
    }
    let footerStr = document.getElementById('basket_total');
    if (totalCount != 0) {                          // Корзина НЕ пуста
        containerElement.style.display = "block";   // Покажем верх таблицы с заголовком
        footerStr.textContent = `В корзине: ${totalCount} товара(ов) на сумму ${totalSum} рублей`;
    }
    else {
        containerElement.style.display = "none";    // Уберем верх таблицы с заголовком
        footerStr.textContent = "Корзина пуста";
    }
}

function getPriseById(price, id) {
    for (let val of price) {
        if (val.id == id) return val;
    }
}

function getProductById(product, id) {
    for (let val of product) {
        if (val.id == id) return val;
    }
}

// Удалим из таблицы "Корзина" все, кроме заголовка
function delBasket() {
    const row = document.querySelector('#basket_table').querySelectorAll(`tr`);
    for (let i = 1; i < row.length; i++) {
        row[i].remove();
    }
}

// удалим нижнюю запись из корзины
function delProductFromBasket() {
    delBasket();
    if (basket.length == 0) {       // корзина пуста --> заполним ее 
        initBasket();
        btn.textContent = 'Удалить последнюю позицию из Корзины';
    }
    else {
        basket.pop();
        if (basket.length == 0) btn.textContent = 'Заполнить корзину';
    }
    initCellsBasket();
}

initBasket();
initCellsCatalog();
initCellsBasket();
const btn = document.querySelector('.my-btn');
btn.addEventListener('click', delProductFromBasket);



