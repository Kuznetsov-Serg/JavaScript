import { reformatStr } from './submodule-es6';

export default capitalizeStr = (str) => {
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
