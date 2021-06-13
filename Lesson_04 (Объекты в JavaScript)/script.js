// Lesson_04 - Объекты в JavaScript


/**************************************************************************
    2.	Продолжить работу с интернет-магазином:
    2.1	В прошлом домашнем задании вы реализовали корзину на базе массивов. 
        Какими объектами можно заменить их элементы?
    2.2	Реализуйте такие объекты.
    2.3	Перенести функционал подсчета корзины на объектно-ориентированную базу.
    3.	* Подумать над глобальными сущностями. 
        К примеру, сущность «Продукт» в интернет-магазине актуальна не только для корзины, но и для каталога. 
        Стремиться нужно к тому, чтобы объект «Продукт» имел единую структуру для различных модулей сайта, 
        но в разных местах давал возможность вызывать разные методы.
*/

'use strict';

const basket = {
    sum: 0,     // свойство, чтоб было к чему обращаться
    products: [],  // отдельное свойство где будут лежать товары
    sumBasket: function () {
        this.sum = this.products.reduce(function (totalPrice, cartItem) {
            return totalPrice + cartItem.count * cartItem.price;
        }, 0);
        return this.sum;
    }
};

const smartphone = { price: 320, count: 2 };
const refrigerator = { price: 840, count: 1 };
const television = { price: 550, count: 3 };

basket.products = [smartphone, refrigerator, television];

basket.sumBasket();

console.log(`Стоимость товаров в "простой" корзине составляет: ${basket.sum} денег...\n`)


/**************************************************************************
    3.	* Подумать над глобальными сущностями. 
        К примеру, сущность «Продукт» в интернет-магазине актуальна не только для корзины, но и для каталога. 
        Стремиться нужно к тому, чтобы объект «Продукт» имел единую структуру для различных модулей сайта, 
        но в разных местах давал возможность вызывать разные методы.
*/

// Вариант 1 (классы)

class Product {
    constructor(name) {
        this.name = name;
        this.id = 0;
        this.measureUnit = 'шт';
        this.flagArh = false;
    }
}

// class Price extends Product {  // нет смысла делать наследование/прототипирование
class Price {
    constructor(name) {
        this.name = name;
        this.id = 0;
        this.flagArh = false;
        this.products = {};     // колллекция (Id строки прайса, Id-товара, цена за ед.)
    }
}

class Basket {
    constructor(id) {
        this.id = id;
        this.products = {};     // колекция (id-строки из прайса, количество)
    }
}


// Вариант 2 (объекты)

function product(name) {
    this.name = name;
    this.measureUnit = 'шт';
}

var product1 = new product('smartphone');
var product2 = new product('refrigerator');
var product3 = new product('television');
// console.log('product1: ' + product1.name + ' измеряется в: ' + product1.measureUnit);

function priceStr(product, cost) {
    // product.call(this);                  // выдает ошибку, а должно включать наследование
    this.product = product;
    this.nameProduct = product.name;        // можем обойти, но коряво
    this.cost = cost;
}
// priceStr.prototype = product;

var priceStr1 = new priceStr(product1, 320);
var priceStr2 = new priceStr(product2, 840);
var priceStr3 = new priceStr(product3, 550);
// console.log('priceStr1: ' + priceStr1.product.name + ' цена: ' + priceStr1.cost);
// console.log('priceStr1: ' + priceStr1.nameProduct + ' цена: ' + priceStr1.cost);

function price(priceStr) {
    this.dateBegin = Date.now();
    this.priceStr = priceStr;
}

var myPrice = new price([priceStr1, priceStr2, priceStr3]);
// console.log('Price:')
// for (const val of myPrice.priceStr) console.log(val.product.name + ' цена: ' + val.cost);

function basketStr(priceStr, amount) {
    this.priceStr = priceStr;
    this.nameProduct = priceStr.nameProduct;
    this.cost = priceStr.cost;
    this.amount = amount;
}
basketStr.prototype = product;

var basketStr1 = new basketStr(priceStr1, 2);
var basketStr2 = new basketStr(priceStr2, 1);
var basketStr3 = new basketStr(priceStr3, 3);
// console.log(basketStr1.priceStr.product.name + '--' + basketStr1.priceStr.cost + '--' + basketStr1.amount)

function basket1(products) {
    this.sum = 0;               // свойство, чтоб было к чему обращаться
    this.products = products;   // отдельное свойство где будут лежать товары
    this.sumBasket = function () {
        this.sum = this.products.reduce(function (totalPrice, cartItem) {
            return totalPrice + cartItem.amount * cartItem.cost;
        }, 0);
        return this.sum;
    }
}

var myBasket = new basket1([basketStr1, basketStr2, basketStr3]);
console.log('Содержимое корзины (наименование--цена--количество):')
for (const val of myBasket.products) console.log(val.nameProduct + '--' + val.cost + '--' + val.amount);


myBasket.sumBasket();
console.log(`Стоимость товаров в корзине составляет: ${myBasket.sum} денег...`)
