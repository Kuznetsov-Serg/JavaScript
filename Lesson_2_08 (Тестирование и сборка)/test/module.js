//module.js
// import submodule from './submodule.js'; // ES6
// const subcalc = submodule.subcalc;
const { subcalc } = require('./submodule.js');

const calc = (a, b) => {
    return subcalc(a) + subcalc(b);
}

module.exports = {
    calc
}
// ES-6
// export default {
//     calc: calc
// };
