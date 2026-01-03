import { api } from './client';

export const subscribeToPush = (subscription) => {
  return api.post('/push/subscribe', subscription);
};

export const unsubscribeFromPush = (endpoint) => {
  return api.post('/push/unsubscribe', { endpoint });
};

export const unsubscribeFromAllPush = () => {
  return api.post('/push/unsubscribe-all');
};

export const getVapidPublicKey = () => {
  return api.get('/push/vapid-public-key');
};





