// Lesson_01 - Современный JavaScript

/****************************************************************************
    1.	Добавьте стили для верхнего меню, товара, списка товаров и кнопки вызова корзины.
    2.	Добавьте значения по умолчанию для аргументов функции. Как можно упростить или сократить запись функций?
    3.	* Сейчас после каждого товара на странице выводится запятая. Из-за чего это происходит? Как это исправить?
 */

const goods = [
    { title: 'Shirt', price: 150 },
    { title: 'Socks', price: 50 },
    { title: 'Jacket', price: 350 },
    { title: 'Shoes', price: 250 },
  ];
  
// (title, price) меняем, т.к. передаем объект и добавляем занчение "по умолчанию"
// также, учитывая то, что функция только возвращает значение, убираем фигурные скобки {} и return
const renderGoodsItem = ({title='', price=0}) =>               
    `<div class="goods-item"><h3>${title}</h3><p>${price}</p></div>`;

  
const renderGoodsList = list => {                               // (list) параметр один, скобки можем убрать
    let goodsList = list.map(item => renderGoodsItem(item));    // (item.title, item.price) заменим на сам объект
    // console.log(goodsList.join('<br>'))
    document.querySelector('.goods-list').innerHTML = goodsList.join('');   // .join('') - избавимся от запятой, разделяющей элементы списка
}
  
renderGoodsList(goods);
  
