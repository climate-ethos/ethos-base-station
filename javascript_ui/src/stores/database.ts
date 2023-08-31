// src/stores/database.ts
import { defineStore } from 'pinia';
import { usernameToDbName } from 'src/helpers/database';
import PouchDB from 'pouchdb-browser';
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
    // Database variable
    db: null as null | InstanceType<typeof PouchDB>,
    // The status of the remote CouchDB instance
    replicationStatus: 'initial' as
      | 'initial'
      | 'active'
      | 'paused'
      | 'denied'
      | 'complete'
      | 'error',
  }),
  actions: {
    /**
     * Function that:
     * 1. Checks if user ID exists
     * 2. Gets the correct database name and remote url
     * 3. If an existing database connection exists, closes it
     * 4. Sets up a database called user_${id}
     * 5. Sets up replication on a remote database called user_${id}
     */
    initializeDatabase() {
      console.log('Initializing database...');
      // 1. Checks if user ID and password exists
      if (!process.env.USER_ID || !process.env.USER_PASSWORD) {
        console.error(
          'Database Error: User ID or password not defined, check .env file'
        );
        return;
      }
      // 2. Gets the correct database name and remote url
      const databaseName = usernameToDbName(process.env.USER_ID);
      const databaseUrl =
        process.env.NODE_ENV === 'production'
          ? `https://${process.env.USER_ID}:${process.env.USER_PASSWORD}@${process.env.COUCH_DB_URL}`
          : `http://${process.env.USER_ID}:${process.env.USER_PASSWORD}@localhost:5984`;
      // 3. If an existing database exists, closes it
      if (this.db) {
        this.db.close();
      }
      // 4. Sets up a local database called user-${id as hex}
      this.db = new PouchDB(databaseName);
      // 5. Sets up replication on a remote database
      if (this.db) {
        const replication = this.db.replicate.to(
          `${databaseUrl}/${databaseName}`,
          {
            live: true,
            retry: true,
          }
        );
        // Replication status callbacks
        replication
          .on('paused', (err) => {
            if (err) {
              console.log('database replication error:', err);
              this.replicationStatus = 'error';
            } else {
              console.log('database replication paused');
              this.replicationStatus = 'paused';
            }
          })
          .on('active', () => {
            console.log('database replication active');
            this.replicationStatus = 'active';
          })
          .on('denied', () => {
            console.log('database replication denied');
            this.replicationStatus = 'denied';
          })
          .on('complete', () => {
            console.log('database replication complete');
            this.replicationStatus = 'complete';
          })
          .on('error', () => {
            console.log('database replication error');
            this.replicationStatus = 'error';
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
      if (!this.db || !process.env.USER_ID) {
        console.error(
          'Trying to post data before database is initialized or no user ID.'
        );
        throw new Error(
          'Trying to post data before database is initialized or no user ID.'
        );
      }

      // 2. Construct the data which will be sent to the database
      const baseData: BaseDatabaseStructure = {
        type: type,
        time: new Date(Date.now()),
        userId: process.env.USER_ID,
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
    /**
     * Function to retrieve the current database info
     * @returns Error string or database info
     */
    async fetchDatabaseInfo() {
      if (!this.db) {
        return 'Database not initialised';
      }
      try {
        const info = await this.db.info();
        return info;
      } catch (e) {
        console.error(e);
        return 'Unknown error getting db info';
      }
    },
  },
});
