// Lesson_03 - Циклы, массивы, структуры данных


/**************************************************************************
    1.	С помощью цикла while вывести все простые числа в промежутке от 0 до 100.
*/
function simpleNum(maxNum = 100) {
    let i = 2, j, result = '';
    while (i <= maxNum) {
        for (j = i - 1; j > 1; j--)
            if (i % j == 0) break;
        if (j == 1) result += i + ' ';
        i++;
    }
    return result;
}

let maxNum = 100;
console.log(`Список простых чисел в интервале от 0 до ${maxNum}:\n${simpleNum(maxNum)}\n`)


/**************************************************************************
    2.  С этого урока начинаем работать с функционалом интернет-магазина.
        Предположим, есть сущность корзины. Нужно реализовать функционал подсчета
        стоимости корзины в зависимости от находящихся в ней товаров.
        Товары в корзине хранятся в массиве. Задачи:
            a) Организовать такой массив для хранения товаров в корзине;
            b) Организовать функцию countBasketPrice, которая будет считать стоимость корзины.
*/

function getCostById(arrPrice, id) {
    for (let i = 0; i < arrPrice.length; i++)
        if (arrPrice[i][0] == id) return arrPrice[i][2];
    return null;
}

function getNameById(arrPrice, id) {
    for (let i = 0; i < arrPrice.length; i++)
        if (arrPrice[i][0] == id) return arrPrice[i][1];

    return null;
}

function printBasket(arrBasket = [], arrPrice) {
    if (arrBasket.length == 0) return 'Корзина пуста'
    let result = '';
    for (let i = 0; i < arrBasket.length; i++)
        result += (i + 1) + ') ' + getNameById(arrPrice, arrBasket[i][0]) + ' (' + arrBasket[i][1] + ') by Cost: ' + getCostById(arrPrice, arrBasket[i][0]) + '\n';
    return result;
}

function countBasketPrice(arrBasket = [], arrPrice) {
    if (arrBasket.length == 0) return null;
    let result = 0;
    for (let i = 0; i < arrBasket.length; i++)
        result += getCostById(arrPrice, arrBasket[i][0]) * arrBasket[i][1];
    return result;
}

// ID, Name, Cost
let arrPrice = [[1, 'apple', 123.5],
[2, 'pear', 120],
[3, 'potato', 67.90],
[4, 'pork meat', 390.99],
[5, 'beef meat', 780],
[6, 'chicken meat', 167]];

// ID, amount
let arrBasket = [[1, 10], [2, 17], [3, 4], [5, 2]];

console.log('Содержимое:\n' + printBasket(arrBasket, arrPrice));
console.log('Общая стоимость: ' + countBasketPrice(arrBasket, arrPrice));



/**************************************************************************
3.	*Вывести с помощью цикла for числа от 0 до 9, не используя тело цикла. Выглядеть это должно так:
    for(…){// здесь пусто}
*/

for (let i = 0; i <= 9; console.log(i++));


/**************************************************************************
4.	*Нарисовать пирамиду с помощью console.log, как показано на рисунке, только у вашей пирамиды должно быть 20 рядов, а не 5:
    x
    xx
    xxx
    xxxx
    xxxxx
*/
for (let i = 1; i <= 20; console.log("*".repeat(i++)));
