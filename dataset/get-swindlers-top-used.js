const fs = require('fs');
const path = require('path');

const swindlers = require('./strings/swindlers.json');
const { getTopUsed } = require('./get-top-used');

const whitelist = ['україн'];
const sorted = getTopUsed(swindlers, whitelist, ' ');
const sortedTwo = getTopUsed(swindlers, whitelist, ' ', (item2, index, self) => {
  if (index === swindlers.length - 1) {
    return item2;
  }

  return `${item2} ${self[index + 1]}`;
});

const result = {};
sorted.slice(0, 9).forEach((item) => {
  const [word, count] = item;
  result[word] = count;
});

sortedTwo.slice(0, 20).forEach((item) => {
  const [word, count] = item;
  result[word] = count;
});

console.info(sorted);
console.info(sortedTwo);

fs.writeFileSync(path.join(__dirname, './strings/swindlers_top_used.json'), JSON.stringify(result, null, 2));
