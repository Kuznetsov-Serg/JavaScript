/****************************************************************************
    Lesson_02 (ООП в JavaScript)

    1.	Добавьте пустые классы для Корзины товаров и Элемента корзины товаров. Продумайте, какие методы понадобятся для работы с этими сущностями.
    2.	Добавьте для GoodsList метод, определяющий суммарную стоимость всех товаров.
    3.	* Некая сеть фастфуда предлагает несколько видов гамбургеров:
        a.	Маленький (50 рублей, 20 калорий).
        b.	Большой (100 рублей, 40 калорий).
        Гамбургер может быть с одним из нескольких видов начинок (обязательно):
            a.	С сыром (+10 рублей, +20 калорий).
            b.	С салатом (+20 рублей, +5 калорий).
            c.	С картофелем (+15 рублей, +10 калорий).
        Дополнительно гамбургер можно посыпать приправой (+15 рублей, +0 калорий) и полить майонезом (+20 рублей, +5 калорий). 
        Напишите программу, рассчитывающую стоимость и калорийность гамбургера. Можно использовать примерную архитектуру класса со следующей страницы, но можно использовать и свою.

 */

const goods = [
    { title: 'Shirt', price: 150 },
    { title: 'Socks', price: 50 },
    { title: 'Jacket', price: 350 },
    { title: 'Shoes', price: 250 },
  ];


class GoodsItem {
    constructor(title, price=0, count=0) {
        this.title = title;
        this.price = price;
        this.count = count;
        }
    render() {
        return `<div class="goods-item"><h3>${this.title}</h3><p>${this.price}</p><p>${this.count}</p></div>`;
    }
}

class GoodsList {
    constructor() {
        this.goods = [];
    }
    fetchGoods() {
        this.goods = [
            { title: 'Shirt', price: 150, count: 10 },
            { title: 'Socks', price: 50, count: 20 },
            { title: 'Jacket', price: 350, count: 13 },
            { title: 'Shoes', price: 250, count: 11 },
        ];
    }
    render() {
        let listHtml = '';
        this.goods.forEach(good => {
          const goodItem = new GoodsItem(good.title, good.price, good.count);
          listHtml += goodItem.render();
        });
        document.querySelector('.goods-list').innerHTML = listHtml;
        this.renderTotal();
    }
    renderTotal() {
         document.querySelector('.goods-total').innerHTML = `<h>Общее количество товаров ${this.getTotalCount()} (позиций ${this.getTotalPosition()}), на сумму ${this.getTotalSum()}</h>`;
    }
    
    getTotalPosition() {
        return this.goods.length;
    }
    getTotalCount() {
        return this.goods.reduce(function (count, item) {
            return count + item.count;
        }, 0);
    }
    getTotalSum() {
        return this.goods.reduce(function (price, item) {
            return price + item.price * item.count;
        }, 0);
    }
}
  

class BasketItem {
    constructor(title, price=0, count=0) {
        this.title = title;
        this.price = price;
        this.count = count;
        }
    render() {
        return `<div class="goods-item"><h3>${this.title}</h3><p>${this.price}</p></div>`;
    }
}

class BasketList {
    constructor() {
        this.goods = [];
    }
    fetchGoods() {
        this.goods = [
          { title: 'Shirt', price: 150 },
          { title: 'Socks', price: 50 },
          { title: 'Jacket', price: 350 },
          { title: 'Shoes', price: 250 },
        ];
    }
    render() {
        this.goods.forEach(good => {
          const goodItem = new GoodsItem(good.title, good.price, good.count);
          listHtml += goodItem.render();
        });
        document.querySelector('.goods-list').innerHTML = listHtml;
    }
    
    getTotalCount() {
        return this.list.reduce(function (count, item) {
            return count + item.count;
        }, 0);
    }
    getTotalSum() {
        return this.list.reduce(function (price, item) {
            return price + item.price * item.count;
        }, 0);
    }
}

//  ГАМБУРГЕР

const hamburgerList = [
    { title: 'Маленький гамбургер', price: 50, calories: 20 },
    { title: 'Большой гамбургер', price: 100, calories: 40 },
]

const stuffingList = [
    { title: 'с сыром', price: 10, calories: 20 },
    { title: 'с салатом', price: 20, calories: 5 },
    { title: 'с картофелем', price: 15, calories: 10 },
]

const seasoningList = [
    { title: 'приправа', price: 15, calories: 0 },
    { title: 'майонез', price: 20, calories: 5 },
]

// Общий класс для элемента
class BaseItem {
    constructor({title, price=0, calories=0}){
        this.title = title;
        this.price = price;
        this.calories = calories;
    }
    render(catalogTable) {
        catalogTable.insertAdjacentHTML('beforeend', 
            `<tr class='product'}>
            <td>${this.title}</td>
            <td>${this.price} руб.</td>
            <td>${this.calories} кал.</td>
            </tr>`);
    }
}

// Общий класс для списка элементов
class BaseList {
    constructor(arr) {
        this.list = [];
        this.fetchList(arr)
    }
    // Заполнение списка объектов класса
    fetchList(arr=[]) {
        for (let el of arr) {
            this.list.push(new BaseItem(el))
        }
    }
    // добавить объект в список
    addItem (item) {
        this.list.push(item)
    }
    // Вернет случайно-выбранный элемент списка объектов
    getRandomItem () {
        return this.list[Math.floor(Math.random()*this.list.length)];
    }
    // удаление объекта сначала или с конца списка
    delItem (isPop=True) {
        if (this.list.length) {     // если есть что удалять
            if (isPop)
                this.list.pop()     // удалим элемент из конца
            else
                this.list.shift()   // удалим элемент из начала
            return true;        
        } 
        else return false;      
    }
    // удаление объекта по наименованию
    delItemByTitleOrItem(title=null) {
        if (item==null)
            return this.delItem();
        if (!(typeof title === "string" || title instanceof String))    //  передан объект (не строка), возьмем наименование
            title = title.title;
        for (let index = 0; index < this.list.length; index++) {
            if (this.list[index].title == title) {
                this.list.splice(index, 1);         // удалим элемент
                return true;
            }
        }
        return false;       // не нашли, что удалить
    }
    getPriceTotal () {
        return this.list.reduce(function (price, item) { return price + item.price; }, 0);  
    }
    getCaloriesTotal () {
        return this.list.reduce(function (calories, item) { return calories + item.calories; }, 0); 
    }
    render (catalogTable, title='') {
        // this.catalogBlock.innerHTML = '';
        if (this.list.length==0)
            return
        if (title!='')              // печать заголовка, если передан
            catalogTable.insertAdjacentHTML('beforeend', `<tr class='product'}><td><u>${title}</u></td><td></td><td></td></tr>`);  
        this.list.forEach(item => { item.render(catalogTable); });
    }
}

// Класс - Гамбургер
class Hamburger {
    constructor(base=null, stuffings=null, seasonings=null) {
        if (base!=null)                             // основа                              
            this.base = base;
        else {
            let tmp = new BaseList(hamburgerList);
            this.base = tmp.getRandomItem();        // Если основа не была передана при инициации класса, выберем ее случайным образом
        }
        if (stuffings!=null)                        // начинка (должна быть одна или несколько)
            this.stuffings = stuffings;
        else {
            let tmp = new BaseList(stuffingList);
            this.stuffings = new BaseList();
            for (let i = 0, amount = Math.floor(Math.random()*3); i <= amount; i++){    // добавим 1-3 начинки (хотя говорилось об одном виде начинки)
                this.stuffings.addItem(tmp.getRandomItem());
            }
        }
        if (seasonings!=null)                       // приправа (может отсутствовать)
            this.seasonings = seasonings
        else {
            let tmp = new BaseList(seasoningList);
            this.seasonings = new BaseList();
            for (let i = 0, amount = Math.floor(Math.random()*2); i < amount; i++){    // добавим 0-1 приправу
                this.seasonings.addItem(tmp.getRandomItem());
            }
        }
     }
    addTopping(topping=null) {    // Добавить начинку 
        if (topping==null) {                        // если начинку не передали
            let tmp = new BaseList(stuffingList);
            topping =  tmp.getRandomItem();         // возьмем произвольную начинку
        } 
    }
    removeTopping(topping) { // Убрать начинку 
        this.stuffings.delItemByTitle(topping)
    }
    getToppings(topping) {   // Получить список добавок (приправ)
        return this.seasonings;
    }
    getBase() {              // Узнать тип гамбургера 
        return this.base;
    }
    getStuffing() {          // Узнать начинку гамбургера 
        return this.stuffings;
    }
    calculatePrice() {       // Узнать цену 
        let priceTotal = this.base.price;
        priceTotal += this.stuffings.getPriceTotal();     // добавим калькуляцию по начинке
        priceTotal += this.seasonings.getPriceTotal();    // добавим калькуляцию по приправе   
        return priceTotal;
    }
    calculateCalories() {    // Узнать калорийность 
        let caloriesTotal = this.base.calories;
        caloriesTotal += this.stuffings.getCaloriesTotal();     // добавим калькуляцию по начинке
        caloriesTotal += this.seasonings.getCaloriesTotal();    // добавим калькуляцию по приправе   
        return caloriesTotal;
    }
    render(catalogBlockId='hamburger') {
        this.catalogBlock = document.getElementById(catalogBlockId);    
        this.catalogTable = document.createElement('table');
        this.catalogBlock.appendChild(this.catalogTable);   
        this.renderTableHead();
        this.base.render(this.catalogTable);
        this.stuffings.render(this.catalogTable, 'начинка');
        this.seasonings.render(this.catalogTable, 'приправы');
        this.renderTableFooter();
    }
     /**
     * создание заголовка таблицы
     */
    renderTableHead() {
        this.catalogTable.innerHTML = '';
        this.catalogTable.insertAdjacentHTML('beforeend',
            `<tr>
            <td class="table_head">Наименование</td>
            <td class="table_head">Цена</td>
            <td class="table_head">Калорийность</td>
            </tr>`);
    }
    /**
     * создание итога таблицы
     */
     renderTableFooter() {
        this.catalogTable.insertAdjacentHTML('beforeend',
            `<tr>
            <td class="table_head">Итого</td>
            <td class="table_head">${this.calculatePrice()}</td>
            <td class="table_head">${this.calculateCalories()}</td>
            </tr>`);
    }
}
  


// (title, price) меняем, т.к. передаем объект и добавляем занчение "по умолчанию"
// также, учитывая то, что функция только возвращает значение, убираем фигурные скобки {} и return
const renderGoodsItem = ({title='', price=0}) =>               
    `<div class="goods-item"><h3>${title}</h3><p>${price}</p></div>`;

  
const renderGoodsList = list => {                               // (list) параметр один, скобки можем убрать
    let goodsList = list.map(item => renderGoodsItem(item));    // (item.title, item.price) заменим на сам объект
    // console.log(goodsList.join('<br>'))
    document.querySelector('.goods-list').innerHTML = goodsList.join('');   // .join('') - избавимся от запятой, разделяющей элементы списка
}
  

// renderGoodsList(goods);

const catlog = new GoodsList();     // создадим экземпляр класса
catlog.fetchGoods();                // заполним списком товаров
catlog.render();                    // выведем на экран состав и итоговую запись 


// ГАМБУРГЕР

const hamburger = new Hamburger();  // создадим экземпляр класса
hamburger.render('hamburger');      // выведем на экран состав и итоги (генерится случайно, можно обновлять экран и убедиться в корректности работы)


  
