//calc_main.js
const { calcPlus } = require('./calc_plus');
const { calcMinus } = require('./calc_minus');
const { calcMultiply } = require('./calc_multiply');
const { calcDivide } = require('./calc_divide');


const calc = (typeOp, arg1, arg2) => {
    // typeOp – тип операции
    // arg1, arg2 – аргументы
    if (arg1 == null || arg2 == null || typeof(arg1) != 'number' || typeof(arg2) != 'number') {
        return null;
    }
    if (typeOp == 'plus')
        return calcPlus(arg1, arg2);
    else if (typeOp == 'minus')
        return calcMinus(arg1, arg2);
    else if (typeOp == 'multiply')
        return calcMultiply(arg1, arg2);
    else if (typeOp == 'divide')
        return calcDivide(arg1, arg2);
    else
        return null;
  }
  
// console.log(calc('plus', 10,20));
// console.log(calc('minus', 100,20));
// console.log(calc('multiply', 100,20));
// console.log(calc('divide', 100,20));

module.exports = {
  calc,
}