const trimStringsInFlatObject = (object) => {
  const result = object;
  Object.keys(result).map(key => {
    if (typeof result[key] === 'string') {
      result[key] = result[key].trim();
    }
  });
  return result;
}

module.exports = {
  trimStringsInFlatObject
}