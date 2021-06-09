// Lesson_02 - Основные операторы JavaScript


// **************************************************************************
// 1.	Дан код:
// Почему код даёт именно такие результаты?

// var a = 1, b = 1, c, d;
// c = ++a; alert(c);              // 2 - сначала инкремент a (a=1) на 1 (a=2), потом присвоение нового значения c (c=2)
// d = b++; alert(d);              // 1 - сначала d присвоение значения b (d=1), потом инкремент b на 1 (b=2)
// c = (2 + ++a); alert(c);        // 5 - инкремент a на 1 (a=3), потом присвоение с суммы (с=2+3=5)
// d = (2 + b++); alert(d);        // 4 - сначала, вычисление суммы и присвоение ее d (d=2+b=2+2=4), потом инкремент b (b=3)
// alert(a);                       // 3 - см. выше
// alert(b);                       // 3 - см. выше


// **************************************************************************
// 2.	Чему будет равен x в примере ниже?

// var a = 2;
// var x = 1 + (a *= 2);   // х=(1+(2*2))=5
// console.log(x)

/****************************************************************************
3.	Объявить две целочисленные переменные a и b и задать им произвольные начальные значения.
    Затем написать скрипт, который работает по следующему принципу:
    –	если a и b положительные, вывести их разность;
    –	если а и b отрицательные, вывести их произведение;
    –	если а и b разных знаков, вывести их сумму; ноль можно считать положительным числом.
*/

/**
 * 
 * @param {Number} a 
 * @param {Number} b 
 * @returns {Number}
 */
function calculateTwoNumbers(a, b) {
    if (a > 0 && b > 0) return a - b;
    if (a < 0 && b < 0) return a * b;
    return a + b;
}

let arr = [[10, 20], [-10, -30], [10, -10]];
for (let i = 0; i < arr.length; i++)
    console.log(`Если a = ${arr[i][0]}, b = ${arr[i][1]}, функция вернет ${calculateTwoNumbers(arr[i][0], arr[i][1])}`);


/****************************************************************************
4.	Присвоить переменной а значение в промежутке [0..15]. 
    С помощью оператора switch организовать вывод чисел от a до 15.
*/

function listNum(paramIn) {
    let num = paramIn, result = '';

    switch (num) {
        case 0: result += ' ' + num++;
        case 1: result += ' ' + num++;
        case 2: result += ' ' + num++;
        case 3: result += ' ' + num++;
        case 4: result += ' ' + num++;
        case 5: result += ' ' + num++;
        case 6: result += ' ' + num++;
        case 7: result += ' ' + num++;
        case 8: result += ' ' + num++;
        case 9: result += ' ' + num++;
        case 10: result += ' ' + num++;
        case 11: result += ' ' + num++;
        case 12: result += ' ' + num++;
        case 13: result += ' ' + num++;
        case 14: result += ' ' + num++;
        case 15: result += ' ' + num++;
            break;
        default: return console.log(`Для значения ${paramIn}, результат неопределен`);
    }
    return console.log(`Для значения ${paramIn}, результат работы функции: ${result}`);
}

listNum(0);
listNum(10);
listNum(16);


/****************************************************************************
5.	Реализовать основные 4 арифметические операции в виде функций с двумя параметрами.
    Обязательно использовать оператор return.
*/

function sumF(a, b) {
    return a + b;
}
function subF(a, b) {
    return a - b;
}
function multF(a, b) {
    return a * b;
}
function divF(a, b) {
    return a / b;
}


/****************************************************************************
6.	Реализовать функцию с тремя параметрами:
function mathOperation(arg1, arg2, operation),
где arg1, arg2 – значения аргументов, operation – строка с названием операции.
В зависимости от переданного значения операции выполнить одну из арифметических операций
(использовать функции из пункта 5) и вернуть полученное значение (использовать switch).
*/

function mathOperation(arg1, arg2, operation) {
    switch (operation) {
        case 'sum': return sumF(arg1, arg2);
        case 'sub': return subF(arg1, arg2);
        case 'mult': return multF(arg1, arg2);
        case 'div': return divF(arg1, arg2);
        default: console.log(`Неверный тип операции  ${operation}`); return null;
    }
}

arr = [['sum', 10, 20], ['sub', 200, 40], ['mult', -10, -30], ['div', 10, 5], ['abrakadabra', 10, 30]];
for (let i = 0; i < arr.length; i++)
    console.log(`Операция (${arr[i][0]}), при аргументах arg1 = ${arr[i][1]} и arg2 = ${arr[i][2]}, функция вернет ${mathOperation(arr[i][1], arr[i][2], arr[i][0])}`);

/****************************************************************************
7.	*Сравнить null и 0. Попробуйте объяснить результат.
https://habr.com/ru/company/ruvds/blog/337732/

null > 0;   // false
null < 0;   // false
null == 0;  // false
null >= 0;  // true

Резюме:
        Будьте осторожны при использовании операторов сравнений вроде > и < с переменными,
        которые могут принимать значения null/undefined.
        Хорошей идеей будет сделать отдельную проверку на null/undefined.
*/

/****************************************************************************
8.	*С помощью рекурсии организовать функцию возведения числа в степень.
    Формат: function power(val, pow), где val – заданное число, pow – степень.
*/

function power(val, pow) {
    if (pow == 0) return 1;
    if (pow % 1 != 0) {
        console.log(`Функция не предусматривает расчет дробных степеней ${pow}`);
        return null;
    }
    if (pow < 0)
        return 1 / power(val, -pow);
    else
        return val * power(val, pow - 1);
}

arr = [[2, 5], [5, 2], [33, 0], [10, -2], [7, 3.5]];
for (let i = 0; i < arr.length; i++)
    console.log(`Число (${arr[i][0]}) в степени (${arr[i][1]}), функция вернет ${power(arr[i][0], arr[i][1])}`);
