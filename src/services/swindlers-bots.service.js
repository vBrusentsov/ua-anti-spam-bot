const FuzzySet = require('fuzzyset');

class SwindlersBotsService {
  /**
   * @param {DynamicStorageService} dynamicStorageService
   * @param {number} [rate]
   * */
  constructor(dynamicStorageService, rate = 0.9) {
    this.dynamicStorageService = dynamicStorageService;
    this.rate = rate;
    this.initFuzzySet();
    this.mentionRegexp = /\B@\w+/g;
    this.urlRegexp =
      /(https?:\/\/(?:www\.|(?!www))?[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|(https?:\/\/(?:www\.|(?!www)))?[a-zA-Z0-9-]+\.[^\s]{2,}|www\.?[a-zA-Z0-9]+\.[^\s]{2,})/g;
    this.telegramDomainRegexp = /^(https?:\/\/)?(www\.)?t\.me\/(.{1,256})/g;
    this.exceptionMentions = [
      '@46311',
      '@Diia_help_bot',
      '@Dopomoga_vzpbot',
      '@EKamenskoetopchip_bot',
      '@dytyna_ne_sama_bot',
      '@stop_russian_war_bot',
      '@ukraine_avanger_bot',
      '@Ebenz_lpg_bot',
      '@Odinfo_bot',
      '@all',
      '@botsbaseru',
      '@realukraine_bot',
    ];

    this.dynamicStorageService.fetchEmmiter.on('fetch', () => {
      this.initFuzzySet();
    });
  }

  /**
   * @param {string} message - raw message from user to parse
   */
  processMessage(message) {
    const mentions = this.parseMentions(message);
    if (mentions) {
      let lastResult = null;
      const foundSwindlerMention = mentions.some((value) => {
        lastResult = this.isSpamBot(value);
        return lastResult.isSpam;
      });

      if (foundSwindlerMention) {
        const { isSpam, rate, nearestName, currentName } = lastResult;
        return { isSpam, rate, nearestName, currentName };
      }
    }

    return null;
  }

  /**
   * @description
   * Create and saves FuzzySet based on latest data from dynamic storage
   * */
  initFuzzySet() {
    this.swindlersBotsFuzzySet = FuzzySet(this.dynamicStorageService.swindlerBots);
  }

  /**
   * @param {string} message - raw message from user to parse
   *
   * @returns {string[]}
   */
  parseMentions(message) {
    const directMentions = message.match(this.mentionRegexp) || [];
    const linkMentions = (message.match(this.urlRegexp) || [])
      .filter((url) => url.split('/').includes('t.me'))
      .map((url) => url.split('/').splice(-1)[0])
      .map((mention) => (mention[mention.length - 1] === '.' ? `@${mention.slice(0, -1)}` : `@${mention}`));

    return this.removeDuplicates([...directMentions, ...linkMentions]).filter((item) => !this.exceptionMentions.includes(item));
  }

  /**
   * @param {string} name
   * @param {number} [customRate]
   */
  isSpamBot(name, customRate) {
    const [[rate, nearestName]] = this.swindlersBotsFuzzySet.get(name) || [[0]];
    return {
      isSpam: rate > (customRate || this.rate),
      rate,
      nearestName,
      currentName: name,
    };
  }

  // TODO refactor to move in own util when TS is available
  removeDuplicates(array) {
    return [...new Set(array)];
  }
}

module.exports = {
  SwindlersBotsService,
};