import { openDB } from 'idb';

const version = 1;
const initdb = async () =>
// new database called 'jate' using version 1
  openDB('jate', version, {
    // add the schema if it isn't already initiated
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      // create an object store for the data, with a key called 'id' that is automatically incremented
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// replaces current content using put, not adding a new value, so only use the first id
export const putDb = async (content) => {
  console.log('PUT in the database');

  const jateDb = await openDB('jate', version);

  const tx = jateDb.transaction('jate', 'readwrite');

  const store = tx.objectStore('jate');

  const request = store.put({id: 1, content: content});

  const result = await request;
  console.log('Content saved to the database', result);
};
// only using the first spot in the database, so just need to get the first id
export const getDb = async () => {
  console.log('GET from the database');

  // Create a connection to the jate database and version we want to use.
  const jateDb = await openDB('jate', version);

  // Create a new transaction and specify the database and data privileges.
  const tx = jateDb.transaction('jate', 'readonly');

  // Open up the desired object store.
  const store = tx.objectStore('jate');

  // Use the .get() method to get the data with id 1, or undefined if it doesn't exist
  const request = store.get(1);

  // Get confirmation of the request.
  const result = await request;
  console.log('result.value', result);
  return result;
};

initdb();
