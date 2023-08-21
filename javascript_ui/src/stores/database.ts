// src/stores/pouchStore.ts
import { defineStore } from 'pinia';
import PouchDB from 'pouchdb-browser';
import { useDataUserStore } from './dataUser';
import {
  AlertDatabaseStructure,
  BaseDatabaseStructure,
  PreferencesDatabaseStructure,
  SensorDatabaseStructure,
  SurveyDatabaseStructure,
  WeatherDatabaseStructure,
} from 'src/typings/database-types';

export const useDatabaseStore = defineStore({
  id: 'database',
  state: () => ({
    db: null as null | InstanceType<typeof PouchDB>,
  }),
  actions: {
    /**
     * Function that:
     * 1. Checks if user ID exists
     * 2. If an existing database connection exists, closes it
     * 3. Sets up a database called user_${id}
     * 4. Sets up replication on a remote database called user_${id}
     */
    initializeDatabase() {
      const userDataStore = useDataUserStore();
      const databaseName = `user_${userDataStore.id}`;
      const databaseUrl =
        process.env.NODE_ENV === 'production'
          ? process.env.COUCH_DB_URL
          : 'http://localhost:5984';
      // 1. Checks if user ID exists
      if (!userDataStore.id) {
        console.error('No user ID provided to setup database');
        return;
      }
      // 2. If an existing database exists, closes it
      if (this.db) {
        this.db.close();
      }
      // 3. Sets up a database called user_${id}
      this.db = new PouchDB(databaseName);
      this.db.info().then(function (info) {
        console.log('Connected to local PouchDB instance:', info);
      });
      // 4. Sets up replication on a remote database
      if (this.db) {
        this.db.replicate.to(`${databaseUrl}/${databaseName}`, {
          live: true,
          retry: true,
        });
      }
    },

    /**
     * Function which will post data to the PouchDB database
     * 1. Check that everything is initialised and ready
     * 2. Construct the data which will be sent to the database
     * 3. Try to send the data to the database and catch any errors
     * @param data The data which will be added to the database
     */
    async postDocument(
      type: 'sensor' | 'weather' | 'preferences' | 'survey' | 'alert',
      data:
        | SensorDatabaseStructure
        | WeatherDatabaseStructure
        | PreferencesDatabaseStructure
        | SurveyDatabaseStructure
        | AlertDatabaseStructure
    ) {
      // 1. Check that everything is initialised and ready
      const userDataStore = useDataUserStore();
      if (!this.db || !userDataStore.id) {
        console.error('Trying to post data before database is initialized.');
        throw new Error('Trying to post data before database is initialized.');
      }

      // 2. Construct the data which will be sent to the database
      const baseData: BaseDatabaseStructure = {
        type: type,
        time: new Date(Date.now()),
        userId: userDataStore.id,
      };
      const sentData = { ...baseData, ...data };

      // 3. Try to send the data to the database and catch any errors
      try {
        const response = await this.db.post(sentData);
        if (!response.ok) {
          console.error('Database response indicates error has occurred');
          throw new Error('Database response indicates error has occurred');
        }
      } catch (error) {
        console.error('Failed to post document:', error);
        throw error;
      }
    },
  },
});
