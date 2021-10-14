//calc.spec.js

const script = require('../calc_app/calc_main');
const calc = script.calc;

describe('Функция calc()', () => {
    it("должна возвращать 30 при аргументах ('plus', 10, 20)", () => {
      expect(calc('plus', 10, 20)).toBe(30);
    });
    it("должна возвращать 80 при аргументах ('minus', 100, 20)", () => {
      expect(calc('minus', 100, 20)).toBe(80);
    });
    it("должна возвращать 80 при аргументах ('multiply', 100, 20)", () => {
      expect(calc('multiply', 100, 20)).toBe(2000);
    });
    it("должна возвращать 5 при аргументах ('divide', 100, 20)", () => {
      expect(calc('divide', 100, 20)).toBe(5);
    });
    it("должна возвращать null при аргументах ('', 100, 20)", () => {
      expect(calc('', 100, 20)).toBeNull();
    });
    it("должна возвращать null при аргументах ('minus', 100, null)", () => {
      expect(calc('minus', 100, null)).toBeNull();
    }); 
    it("должна возвращать null при аргументах ('minus', 100, '20')", () => {
      expect(calc('minus', 100, '20')).toBeNull();
    }); 
    it("должна возвращать null при аргументах ('minus', '100', 20)", () => {
      expect(calc('minus', '100', 20)).toBeNull();
    }); 
});

  