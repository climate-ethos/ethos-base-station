// src/stores/database.ts
import { defineStore } from 'pinia';
import { useDataUserStore } from './dataUser';
import { usernameToDbName } from 'src/helpers/database';
import { replicate } from 'pouchdb';
import PouchDB from 'pouchdb-browser';
import {
  AlertDatabaseStructure,
  BaseDatabaseStructure,
  PreferencesDatabaseStructure,
  SensorDatabaseStructure,
  SurveyDatabaseStructure,
  WeatherDatabaseStructure,
} from 'src/typings/database-types';

interface ReplicationError {
  error?: string;
  message?: string;
  name?: string;
  reason?: string;
  result?: object;
  stack?: string;
  status?: number;
}

export const useDatabaseStore = defineStore({
  id: 'database',
  state: () => ({
    // Database variable
    db: null as null | InstanceType<typeof PouchDB>,
    replicationHandler: null as null | ReturnType<typeof replicate>,
    // The status of the remote CouchDB instance
    replicationStatus: 'initial' as
      | 'initial'
      | 'active'
      | 'paused'
      | 'denied'
      | 'complete'
      | 'error',
    replicationErrorMessage: undefined as undefined | string,
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
      const dataUserStore = useDataUserStore();

      console.log('Initializing database...');
      // 1. Checks if user ID and password exists
      if (!dataUserStore.id || !dataUserStore.password) {
        console.error(
          'Database Error: User ID or password not defined, is it defined in the Pinia store?'
        );
        return;
      }
      // 2. Gets the correct database name and remote url
      const databaseName = usernameToDbName(dataUserStore.id);
      const databaseUrl =
        process.env.NODE_ENV === 'production'
          ? `https://${dataUserStore.id}:${dataUserStore.password}@${process.env.COUCH_DB_URL}`
          : `http://${dataUserStore.id}:${dataUserStore.password}@localhost:5984`;
      console.log(databaseUrl);
      // 3. If an existing database exists, closes it
      if (this.db) {
        this.db.close();
      }
      // 4. Sets up a local database called user-${id as hex}
      this.db = new PouchDB(databaseName);
      // 5. Sets up replication on a remote database
      if (this.db) {
        this.replicationHandler = this.db.replicate.to(
          `${databaseUrl}/${databaseName}`,
          {
            live: true,
            retry: true,
          }
        );
        // Replication status callbacks
        this.replicationHandler
          .on('error', (err: ReplicationError) => {
            console.error('database replication error:', err);
            this.replicationErrorMessage = err.message;
            this.replicationStatus = 'error';
          })
          .on('denied', (err: ReplicationError) => {
            console.log('database replication denied:', err);
            this.replicationErrorMessage = err.message;
            this.replicationStatus = 'denied';
          })
          .on('paused', (err: ReplicationError) => {
            if (err) {
              console.error('database replication paused, error:', err);
              this.replicationErrorMessage = err.message;
              this.replicationStatus = 'error';
            } else {
              console.log('database replication paused');
              this.replicationErrorMessage = undefined;
              this.replicationStatus = 'paused';
            }
          })
          .on('active', () => {
            console.log('database replication active');
            this.replicationErrorMessage = undefined;
            this.replicationStatus = 'active';
          })
          .on('complete', () => {
            console.log('database replication complete');
            this.replicationErrorMessage = undefined;
            this.replicationStatus = 'complete';
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
      const dataUserStore = useDataUserStore();

      // 1. Check that everything is initialised and ready
      if (!this.db || !dataUserStore.id) {
        console.error(
          'Trying to post data before database is initialized or no user ID.'
        );
        return;
      }

      // 2. Construct the data which will be sent to the database
      const baseData: BaseDatabaseStructure = {
        type: type,
        time: new Date(Date.now()),
        userId: dataUserStore.id,
      };
      const sentData = { ...baseData, ...data };

      // 3. Try to send the data to the database and catch any errors
      try {
        const response = await this.db.post(sentData);
        if (!response.ok) {
          console.error('Database response indicates error has occurred');
        }
      } catch (error) {
        console.error('Failed to post document:', error);
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
    /**
     * Destroy the database and clear all memory
     * WARNING: This will delete any data stored in DB
     */
    async destroyDatabase() {
      // Check and stop replication if it exists
      if (this.replicationHandler) {
        this.replicationHandler.cancel();
      }

      if (this.db) {
        try {
          await this.db.destroy();
          console.log('Database successfully destroyed');
          this.db = null;
        } catch (error) {
          console.error('Error destroying the database:', error);
        }
      }
    },
  },
});
