import { dbConnection } from './mongoConnection.js';

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

// We are adding all collection here
export const users = getCollectionFn('users');
export const reviews = getCollectionFn('reviews');
export const categories = getCollectionFn('categories');
export const businesses = getCollectionFn('businesses');
export const comments = getCollectionFn('comments');