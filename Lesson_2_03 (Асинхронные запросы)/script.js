/****************************************************************************
    Lesson_2_03 (Асинхронные запросы)
    1.	Переделайте makeGETRequest() так, чтобы она использовала промисы.
    2.	Добавьте в соответствующие классы методы добавления товара в корзину, удаления товара из корзины и получения списка товаров корзины.
    3.	3* Переделайте GoodsList так, чтобы fetchGoods() возвращал промис, а render() вызывался в обработчике этого промиса.
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
        this.list = [];
        this.fetchList(arr);
        this.titleButton = null;
    }
    // Заполнение списка объектов класса
    fetchList(arr=[]) {
        if (arr.length) {
            this.list = [];
            for (let el of arr) {
                this.list.push(new BaseItem(el))
            }
        }    
    }
    // добавить объект в список
    addItem (product) {
        if (product) {
            const findInList = this.list.find((item) => product.id_product === item.id_product);
            if (findInList) {
                findInList.count++;
            } else {
                product.count = 1
                console.log('addItem')
                console.log(product);
                this.list.push(product);
            }
            this.render();
        } else {
            alert('Ошибка добавления!');
        }

        // console.log('до: '+item+'/n'+this.list)
        // this.list.push(item)
        // console.log('после: '+item+'/n'+this.list)
    }
    // Вернет случайно-выбранный элемент списка объектов
    getRandomItem () {
        return this.list[Math.floor(Math.random()*this.list.length)];
    }
    // Вернет элемент списка объектов по ИД
    getItemById (idProduct) {
        return this.list.find((product) => product.id_product == idProduct);
        // for (el of this.list) 
        //     if (el.id_product == id)
        //         return el;
    }
    // уменьшение остатка по ИД
    reduceCountById(idProduct=null) {
        if (idProduct==null) return false;
            
        let product = this.getItemById(idProduct);
        console.log('reduceCountById');
        console.log(product);
        console.log(this.list);
        if (!product) return false;

        if (product.count < 2)
            this.delItemById(idProduct);
        else
            product.count -= 1;
        this.render();
        return true;
    }
    // удаление объекта сначала или с конца списка
    delItem (isPop=True) {
        if (this.list.length) {     // если есть что удалять
            if (isPop)
                this.list.pop()     // удалим элемент из конца
            else
                this.list.shift()   // удалим элемент из начала
            this.render();
            return true;        
        } 
        else return false;      
    }
    // удаление объекта по ИД
    delItemById(idProduct=null) {
        if (idProduct==null)
            return this.delItem();
        for (let index = 0; index < this.list.length; index++) {
            if (this.list[index].id_product == idProduct) {
                this.list.splice(index, 1);         // удалим элемент
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
        for (let index = 0; index < this.list.length; index++) {
            if (this.list[index].product_name == product_name) {
                this.list.splice(index, 1);         // удалим элемент
                return true;
            }
        }
        return false;       // не нашли, что удалить
    }
    getPriceTotal () {
        return this.list.reduce(function (price, item) { return price + item.price * item.count; }, 0);  
    }
    getCountTotal () {
        return this.list.reduce(function (count, item) { return count + item.count; }, 0); 
    }
    getPositionTotal() {
        return this.goods.length;
    }
    render(catalogBlockId=null, titleButton=null) {
        if (catalogBlockId)
            this.catalogBlock = document.getElementById(catalogBlockId);   
        if (titleButton)
            this.titleButton = titleButton;
        this.catalogBlock.innerHTML = '';                       // очистим содержимое блока 
        this.catalogTable = document.createElement('table');    // создадим таблицу
        this.catalogBlock.appendChild(this.catalogTable, this.titleButton);   // спозиционируем ее положение 
        this.renderTableHead();         // Заголовок
        this.renderTableBody();         // тело
        this.renderTableFooter();       // итоговая строка
    }
    renderTableBody() {
        // this.catalogBlock.innerHTML = '';
        if (this.list.length==0)
            return
        this.list.forEach(item => { item.render(this.catalogTable, this.titleButton); });
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
    // async fetchGoods() {      // ES2017
    //     return await fetch(`${API_URL}/catalogData.json`).then(resp => resp.json());
    // }
    
    fetchGoods(){       // ES2015
        return makeGETRequest(`${API_URL}/catalogData.json`)
    }

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

// каталог
const goodsListInstance = new GoodsList();                  // создадим экземпляр класса
goodsListInstance.fetchGoods()                              // получим список товаров
    .then((data) => goodsListInstance.fetchList(data))      // поместим товары в класс
    .then((data) => goodsListInstance.render('catalog_1', 'в корзину')); // выведем на экран состав и итоговую запись 

// Корзина
const basketListInstance = new BasketList();                // создадим экземпляр класса
basketListInstance.fetchGoods()                             // получим список товаров
    .then((data) => basketListInstance.fetchList(data))     // поместим товары в класс
    .then((data) => basketListInstance.render('basket_1','уменьшить на ед.'))  // выведем на экран состав и итоговую запись 
    .then((data) => basketListInstance.addEventHandlers(goodsListInstance));  // Добавим обработчики помещения в корзину и удаления

