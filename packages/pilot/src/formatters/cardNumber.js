export default (number = '') => number
  .toString()
  .padEnd(12, '*')
  .replace(/([\S\s]{4})/g, '$1 ')
