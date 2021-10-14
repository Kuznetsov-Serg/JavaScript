//script.spec.js

const script = require('../test/script');
const pow = script.pow;
const capitalizeStr = script.capitalizeStr;
// const { capitalizeStr } = require('../test/script');

describe('Функция pow()', () => {
    it('должна возвращать 9 при аргументах (3, 2)', () => {
      expect(pow(3, 2)).toBe(9);
    });
    it('должна возвращать null при аргументах (null, 2)', () => {
        expect(pow(null, 2)).toBeNull();
    });
});

describe('Testing script.js', () => {
  describe('testing capitalizeStr() func', () => {
    it('should return Qwerty when arg is qWeRtY', () => {
      expect(capitalizeStr('qWeRtY')).toBe('Qwerty');
    });

    it('should return Qwerty Qwerty when arg is qWeRtY qWeRtY', () => {
      expect(capitalizeStr('qWeRtY qWeRtY')).toBe('Qwerty Qwerty');
    });

    it('should return Qwerty-Qwerty when arg is qWeRtY-qWeRtY', () => {
      expect(capitalizeStr('qWeRtY-qWeRtY')).toBe('Qwerty-Qwerty');
    });

    it('should return null if not arg', () => {
      expect(capitalizeStr()).toBeNull();
    })
  })
});
  