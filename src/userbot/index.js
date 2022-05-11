const { env } = require('typed-dotenv').config();

const { redisClient } = require('../db');
const auth = require('./auth');
const { UserbotStorage } = require('./storage.handler');
const updatesHandler = require('./updates.handler');
const { initTensor } = require('../tensor/tensor.service');

console.info('Start listener application');
auth().then(async (api) => {
  await redisClient.client.connect().then(() => console.info('Redis client successfully started'));
  const userbotStorage = new UserbotStorage();
  console.info('Application is listening new messages.');

  const tensorService = await initTensor();
  console.info('Tensor is ready.');

  const resolvedPeer = await api.call('contacts.search', {
    q: env.USERBOT_TRAING_CHAT_NAME,
  });

  const testChannel = resolvedPeer.chats[0];

  console.info('Test Channel Found: ', testChannel);

  const chatPeer = {
    _: 'inputPeerChannel',
    channel_id: testChannel.id,
    access_hash: testChannel.access_hash,
  };

  api.mtproto.updates.on('updates', (updateInfo) => updatesHandler(api, chatPeer, tensorService, updateInfo, userbotStorage));

  setInterval(async () => {
    try {
      await api.call('updates.getState');
    } catch (error) {
      console.error(JSON.stringify(error));
    }
  }, 15000);
});