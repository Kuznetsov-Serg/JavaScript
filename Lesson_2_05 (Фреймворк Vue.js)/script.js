/****************************************************************************
    Lesson_2_05 (Фреймворк Vue.js)
    1.	Добавить методы и обработчики событий для поля поиска. 
        Создать в объекте данных поле searchLine и привязать к нему содержимое поля ввода. 
        На кнопку «Искать» добавить обработчик клика, вызывающий метод FilterGoods.
    2.	Добавить корзину. В html-шаблон добавить разметку корзины. Добавить в объект данных поле isVisibleCart, управляющее видимостью корзины.
    3.	*Добавлять в .goods-list заглушку с текстом «Нет данных» в случае, если список товаров пуст.
 ****************************************************************************/


const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

// Общий класс для элемента
class BaseItem {
    constructor({id_product, product_name, price=0, count=0}){
        this.id_product = id_product;
        this.product_name = product_name;
        this.price = parseFloat(price);
        this.count = parseInt(count);
    }
    render(catalogTable, titleButton=null) {
        let cellAdd = '';
        if (titleButton)
            cellAdd = `<td><button class="button_active" data-id="${this.id_product}">${titleButton}</button></td>`;
        catalogTable.insertAdjacentHTML('beforeend', 
            `<tr class='product'}>
            <td>${this.product_name}</td>
            <td>${this.price} руб.</td>
            <td>${this.count} шт.</td>
            <td>${this.price * this.count} руб.</td>
            ${cellAdd}
            </tr>`); 
    }
}

// Общий класс для списка элементов
class BaseList {
    constructor(arr) {
        this.goods = [];
        this.regExp = new RegExp('', 'i');
        this.filteredGoods = [];
        this.fetchList(arr);
        this.titleButton = null;
    }
    // Заполнение списка объектов класса
    fetchList(arr=[]) {
        if (arr.length) {
            this.goods = [];
            for (let el of arr) {
                this.goods.push(new BaseItem(el))
            }
        }    
        this.filterGoods();
    }
    filterGoods(regExp='') {
        // Здесь будем фильтровать список товаров
        if (regExp) this.regExp = new RegExp(value, 'i');
        this.filteredGoods = this.goods.filter(good => this.regExp.test(good.product_name));
        // this.render();
    }
    // добавить объект в список
    addItem (product) {
        if (product) {
            const findInList = this.goods.find((item) => product.id_product === item.id_product);
            if (findInList) {
                findInList.count++;
            } else {
                product.count = 1
                // console.log('addItem')
                // console.log(product);
                this.goods.push(product);
            }
            this.render();
        } else {
            alert('Ошибка добавления!');
        }

        // console.log('до: '+item+'/n'+this.goods)
        // this.goods.push(item)
        // console.log('после: '+item+'/n'+this.goods)
    }
    // Вернет случайно-выбранный элемент списка объектов
    getRandomItem () {
        return this.goods[Math.floor(Math.random()*this.goods.length)];
    }
    // Вернет элемент списка объектов по ИД
    getItemById (idProduct) {
        return this.goods.find((product) => product.id_product === idProduct);
        // for (el of this.goods) 
        //     if (el.id_product == id)
        //         return el;
    }
    // уменьшение остатка по ИД
    reduceCountById(idProduct=null) {
        if (idProduct===null) return false;
            
        let product = this.getItemById(idProduct);
        // console.log('reduceCountById');
        // console.log(product);
        // console.log(this.goods);
        if (!product) return false;

        if (product.count < 2)
            this.delItemById(idProduct);
        else
            product.count -= 1;
        this.render();
        return true;
    }
    // удаление объекта сначала или с конца списка
    delItem (isPop=true) {
        if (!this.goods.length) return false;               // нечего удалять    
        isPop ? this.goods.pop() : this.goods.shift();      // удалим элемент из конца или начала
        this.render();
        return true;        
    }
    // удаление объекта по ИД
    delItemById(idProduct=null) {
        if (idProduct===null)
            return this.delItem();
        for (let index = 0; index < this.goods.length; index++) {
            if (this.goods[index].id_product === idProduct) {
                this.goods.splice(index, 1);            // удалим элемент
                this.render();
                return true;
            }
        }
        return false;       // не нашли, что удалить
    }
    // удаление объекта по наименованию
    delItemByNameOrItem(product_name=null) {
        if (item==null)
            return this.delItem();
        if (!(typeof product_name === "string" || product_name instanceof String))    //  передан объект (не строка), возьмем наименование
            product_name = product_name.product_name;
        for (let index = 0; index < this.goods.length; index++) {
            if (this.goods[index].product_name === product_name) {
                this.goods.splice(index, 1);         // удалим элемент
                return true;
            }
        }
        return false;       // не нашли, что удалить
    }
    getPriceTotal () {
        return this.goods.reduce(function (price, item) { return price + item.price * item.count; }, 0);  
    }
    getCountTotal () {
        return this.goods.reduce(function (count, item) { return count + item.count; }, 0); 
    }
    getPositionTotal() {
        return this.goods.length;
    }
    render(catalogBlockId=null, titleButton=null) {
        if (catalogBlockId)
            this.catalogBlock = document.getElementById(catalogBlockId);   
        if (!this.catalogBlock)         // некуда рендерить
            return;
        if (titleButton)
            this.titleButton = titleButton;
        this.filterGoods();
        this.catalogBlock.innerHTML = '';                       // очистим содержимое блока 
        this.catalogTable = document.createElement('table');    // создадим таблицу
        this.catalogBlock.appendChild(this.catalogTable, this.titleButton);   // спозиционируем ее положение 
        this.renderTableHead();         // Заголовок
        this.renderTableBody();         // тело
        this.renderTableFooter();       // итоговая строка
    }
    renderTableBody() {
        // this.catalogBlock.innerHTML = '';
        if (this.filteredGoods.length==0)
            return
        this.filteredGoods.forEach(item => { item.render(this.catalogTable, this.titleButton); });
    }
    /**
     * создание заголовка таблицы
     */
    renderTableHead() {
        this.catalogTable.innerHTML = '';
        let cellAdd = '';
        if (this.titleButton) 
            cellAdd = `<td class="table_head"></td>`;
        this.catalogTable.insertAdjacentHTML('beforeend',
            `<tr>
            <td class="table_head">Наименование</td>
            <td class="table_head">Цена</td>
            <td class="table_head">Количество</td>
            <td class="table_head">Сумма</td>
            ${cellAdd}
            </tr>`);
    }
    /**
     * создание итога таблицы
     */
     renderTableFooter() {
        let cellAdd = '';
        if (this.titleButton) 
            cellAdd = `<td class="table_head"></td>`;
        this.catalogTable.insertAdjacentHTML('beforeend',
            `<tr>
            <td class="table_head">Итого</td>
            <td class="table_head"></td>
            <td class="table_head">${this.getCountTotal()} шт.</td>
            <td class="table_head">${this.getPriceTotal()} руб.</td>
            ${cellAdd}
            </tr>`);
    }
}

class GoodsItem {
    constructor({id_product, product_name, price=0, count=0}) {
        this.id_product = id_product;
        this.product_name = product_name;
        this.price = price;
        this.count = count;
        }
    render() {
        return `<div class="goods-item"><h3>${this.product_name}</h3><p>${this.price}</p><p>${this.count}</p></div>`;
    }
    
}

class GoodsList extends BaseList {
    // constructor(arr) {      // расшироим базовый класс
    //     super(arr);         // не забудем передать параметр в родителя
    //     this.goods = [];
    //     this.regExp = null;
    // }
        
    fetchGoods(){       // ES2015
        return makeGETRequest(`${API_URL}/catalogData.json`)
    }
    // async fetchGoods() {      // ES2017
    //     return await fetch(`${API_URL}/catalogData.json`).then(resp => resp.json());
    // }

}
  

class BasketList extends BaseList{
    fetchGoods(){       // ES2015
        return makeGETRequest(`${API_URL}/getBasket.json`)
    }
    /**
    * Добавляем обработку событий 
    */
    addEventHandlers(catalogGoods=null) {
        if (catalogGoods) this.catalogGoods = catalogGoods;   // экземпляр класса продуктов 
        if (!this.catalogGoods) 
            console.log('addEventHandlers/catalogGoods is undefined!!!')
        else
            this.catalogGoods.catalogBlock.addEventListener('click', event => this.addToBasket(event));                           
        this.catalogGoods.catalogBlock.addEventListener('click', event => this.addToBasket(event));
        this.catalogBlock.addEventListener('click', event => this.delFromBasket(event));
    }
    /**
     * Метод добавления в корзину
     */
    addToBasket(event) {
        if (!event.target.classList.contains('button_active')) return;
        const idProduct = +event.target.dataset.id;
        const productToAdd = this.catalogGoods.getItemById(idProduct);
        this.addItem(productToAdd);
    }
     /**
     * Метод удаления из корзины одной позиции
     */
    delFromBasket(event) {
        if (!event.target.classList.contains('button_active')) return;
        // console.log('delFromBasket');
        const idProduct = +event.target.dataset.id;
        // console.log(idProduct)
        // this.delItemById(idProduct);
        this.reduceCountById(idProduct);
    }
}


const makeGETRequest = (url) => {
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
}

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
    },

    methods: {
        makeGETRequest(url, callback) {
            const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';
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
        FilterGoods () {
            regExp = new RegExp(this.searchLine, 'i');
            this.filteredGoods = this.goods.filter(good => regExp.test(good.product_name));
        },

        // Видимость корзины
        ChangeVisibleBasket() {
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
        this.makeGETRequest(`${API_URL}/catalogData.json`, (goods) => {
            this.goods = [...goods, ...catalogAdd];
            this.filteredGoods = this.goods;
            // console.log('mounted: '+this.filteredGoods)
        });
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
  


// // каталог
// const goodsListInstance = new GoodsList();                  // создадим экземпляр класса
// goodsListInstance.fetchGoods()                              // получим список товаров
//     .then((data) => goodsListInstance.fetchList([...data, ...catalogAdd]))     // поместим товары в класс и добавим туда еще локальныей список (для количества)
//     // .then((data) => goodsListInstance.fetchList(data))      // поместим товары в класс
//     .then((data) => goodsListInstance.render('catalog_1', 'в корзину')); // выведем на экран состав и итоговую запись 

// // Корзина
// const basketListInstance = new BasketList();                // создадим экземпляр класса
// basketListInstance.fetchGoods()                             // получим список товаров
//     .then((data) => basketListInstance.fetchList(data))     // поместим товары в класс
//     .then((data) => basketListInstance.render('basket_1','уменьшить на ед.'))   // выведем на экран состав и итоговую запись 
//     .then((data) => basketListInstance.addEventHandlers(goodsListInstance));    // Добавим обработчики помещения в корзину и удаления

