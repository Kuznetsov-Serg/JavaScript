//script.js

const { reformatStr } = require('./subscript.js');

//module.js
// import module from './module.js';  // ES-6
// const calc = module.calc;
const { calc } = require('./module.js');
console.log(calc(2, 3));


const pow = (a, n) => {
    // a –число
    // n – основание степени
    if (a == null || n == null) {
        return null;
    }
    let result = 1;
    for (let i = 0; i < n; i++) {
        result *= a;
    }
    return result;
  }
  
//   module.exports = {
//     pow: pow
//   }

const capitalizeStr = (str) => {
  if (!str) {
    return null;
  }

  if (str.includes('-')) {
    const arr = str.split('-');
    return arr.map(i => reformatStr(i)).join('-');
  }

  if (str.includes(' ')) {
    const arr = str.split(' ');
    return arr.map(i => reformatStr(i)).join(' ');
  }

  return reformatStr(str);
}

module.exports = {
  capitalizeStr,
  pow: pow
}
  