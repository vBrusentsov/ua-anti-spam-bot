const { urlRegexp } = require('ukrainian-ml-optimizer');

const { DynamicStorageService } = require('../src/services/dynamic-storage.service');
const { SwindlersUrlsService } = require('../src/services/swindlers-urls.service');
const { SwindlersCardsService } = require('../src/services/swindlers-cards.service');
const { swindlersGoogleService } = require('../src/services/swindlers-google.service');
const { dataset } = require('./dataset');

const dynamicStorageService = new DynamicStorageService(swindlersGoogleService, dataset);
const swindlersUrlsService = new SwindlersUrlsService(dynamicStorageService, 0.6);
const swindlersCardsService = new SwindlersCardsService(dynamicStorageService);

const notSwindlers = [
  '@alinaaaawwaa',
  '@all',
  '@geLIKhr25',
  '@GLORY_TO_UKRAINE_22',
  'https://redcross.org.ua/)',
  'https://www.nrc.no/countries/europe/ukraine/',
];

const mentionRegexp = /\B@\w+/g;

/**
 * @template T
 * @param {T} array
 *
 * @returns {T}
 * */
function removeDuplicates(array) {
  return [...new Set(array)];
}

/**
 * @param {string[]} swindlers
 * @param {string[]} swindlersBots
 * @param {string[]} swindlersCards
 * */
const autoSwindlers = async (swindlers, swindlersBots, swindlersCards) => {
  function findSwindlersByPattern(items, pattern) {
    return removeDuplicates([...items, ...swindlers.map((message) => message.match(pattern) || []).flat()]).filter(
      (item) => !notSwindlers.includes(item),
    );
  }

  await dynamicStorageService.init();
  const [savedSwindlerDomains, savedSwindlersUrls] = await Promise.all([
    swindlersGoogleService.getDomains(),
    swindlersGoogleService.getSites(),
  ]);

  const notMatchedDomains = [];
  const swindlersUrls = removeDuplicates([
    ...savedSwindlersUrls,
    ...swindlers.map((message) => swindlersUrlsService.parseUrls(message)).flat(),
  ])
    .filter((url) => {
      const isSwindler = swindlersUrlsService.isSpamUrl(`${url}/`);

      if (!isSwindler.isSpam) {
        notMatchedDomains.push(url);
      }

      return isSwindler;
    })
    .sort();

  const swindlersDomains = removeDuplicates([
    ...savedSwindlerDomains,
    ...swindlersUrls.map((url) => swindlersUrlsService.getUrlDomain(url)),
  ])
    .sort()
    .filter((item) => item !== 't.me');

  const newSwindlersBots = findSwindlersByPattern(swindlersBots, mentionRegexp);
  const newSwindlersCards = removeDuplicates([...swindlersCards, swindlers.map((item) => swindlersCardsService.parseCards(item)).flat()]);

  const notMatchedUrls = swindlersUrls
    .filter((item) => urlRegexp.test(item))
    .filter((item) => !swindlersUrlsService.swindlersRegex.test(item));

  console.info('notMatchedUrls\n');
  console.info(notMatchedUrls.join('\n'));
  console.info('notMatchedDomains\n');
  console.info(notMatchedDomains.join('\n'));

  await swindlersGoogleService.updateBots(newSwindlersBots);
  await swindlersGoogleService.updateDomains(swindlersDomains);
  await swindlersGoogleService.updateSites(swindlersUrls);
  await swindlersGoogleService.updateCards(newSwindlersCards);

  process.exit(0);
};

module.exports = {
  autoSwindlers,
};
