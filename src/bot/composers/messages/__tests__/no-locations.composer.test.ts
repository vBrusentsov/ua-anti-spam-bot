import { hydrateReply } from '@grammyjs/parse-mode';
import { Bot } from 'grammy';
import type { PartialDeep } from 'type-fest';

import type { OutgoingRequests } from '../../../../testing';
import { MessagePrivateMockUpdate, prepareBotForTesting } from '../../../../testing';
import type { ChatSessionData, GrammyContext } from '../../../../types';
import { logContextMiddleware, parseLocations, parseText, stateMiddleware } from '../../../middleware';
import { getNoLocationsComposer } from '../no-locations.composer';

let outgoingRequests: OutgoingRequests;
const { noLocationsComposer } = getNoLocationsComposer();
const bot = new Bot<GrammyContext>('mock');

const chatSession = {
  chatSettings: {
    enableDeleteLocations: false,
  },
} as PartialDeep<ChatSessionData> as ChatSessionData;

describe('noLocationsComposer', () => {
  beforeAll(async () => {
    bot.use(hydrateReply);

    bot.use(stateMiddleware);
    bot.use(parseText);
    bot.use(parseLocations);
    bot.use(logContextMiddleware);
    // Register mock chat session
    bot.use((context, next) => {
      context.chatSession = chatSession;
      return next();
    });

    bot.use(noLocationsComposer);

    outgoingRequests = await prepareBotForTesting<GrammyContext>(bot);
  }, 5000);

  describe('enabled feature', () => {
    beforeAll(() => {
      chatSession.chatSettings.enableDeleteLocations = true;
    });

    beforeEach(() => {
      outgoingRequests.clear();
    });

    it('should delete location in any case', async () => {
      const update = new MessagePrivateMockUpdate('Тут ТеРемкИ без сВітла').build();
      await bot.handleUpdate(update);

      const [deleteMessageRequest, sendMessageRequest] = outgoingRequests.getTwoLast<'deleteMessage', 'sendMessage'>();

      expect(outgoingRequests.length).toEqual(2);
      expect(deleteMessageRequest?.method).toEqual('deleteMessage');
      expect(sendMessageRequest?.method).toEqual('sendMessage');
    });

    it('should not delete message without a location', async () => {
      const update = new MessagePrivateMockUpdate(
        'Інтерактивна мапа дозволяє швидко і зручно дізнатися погоду в містах України. На ній відображаються погодні умови в найбільших містах України з можливістю перегляду прогнозу погоди на тиждень. Щоб дізнатися докладний прогноз погоди в вашому місті досить натиснути на назву населеного пункту на мапі.',
      ).build();
      await bot.handleUpdate(update);

      expect(outgoingRequests.length).toEqual(0);
    });
  });

  describe('disabled feature', () => {
    beforeAll(() => {
      chatSession.chatSettings.enableDeleteLocations = false;
    });

    beforeEach(() => {
      outgoingRequests.clear();
    });

    it('should delete location in any case', async () => {
      const update = new MessagePrivateMockUpdate('Тут ТеРемкИ без сВітла').build();
      await bot.handleUpdate(update);

      expect(outgoingRequests.length).toEqual(0);
    });

    it('should not delete message without a location', async () => {
      const update = new MessagePrivateMockUpdate(
        'Інтерактивна мапа дозволяє швидко і зручно дізнатися погоду в містах України. На ній відображаються погодні умови в найбільших містах України з можливістю перегляду прогнозу погоди на тиждень. Щоб дізнатися докладний прогноз погоди в вашому місті досить натиснути на назву населеного пункту на мапі.',
      ).build();
      await bot.handleUpdate(update);

      expect(outgoingRequests.length).toEqual(0);
    });
  });
});
