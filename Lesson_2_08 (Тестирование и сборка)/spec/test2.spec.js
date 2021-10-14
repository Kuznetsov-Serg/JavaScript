const { trimStringsInFlatObject } = require('../test/test2');

describe('Testing trimStringsInFlatObject() func', () => {
  it('should trim strings in flat object', () => {
    const testObj = {
      firstName: '  John  ',
      lastName: ' Snow ',
      age: 34,
      boolKey: true,
      arr: [1, 2, 3],
      object: {}
    };

    expect(trimStringsInFlatObject(testObj)).toEqual({
      firstName: 'John',
      lastName: 'Snow',
      age: 34,
      boolKey: true,
      arr: [1, 2, 3],
      object: {}
    })
  })
});