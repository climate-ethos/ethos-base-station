<template>
  <div>
    <div class="text-h6 q-mb-md">Debug information</div>

    <!-- Display Python socket info -->
    <div class="debug-section">
      <div class="text-subtitle2">Python Socket Info:</div>
      <div v-if="socketStore.isConnected">Connected</div>
      <div v-else>Not Connected</div>
    </div>

    <!-- Display local PouchDB info -->
    <div class="debug-section">
      <div class="text-subtitle2">Database Info:</div>
      <pre v-if="databaseInfo">{{ JSON.stringify(databaseInfo, null, 2) }}</pre>
      <div v-else>Loading database info...</div>
    </div>

    <!-- Display remote CouchDB info -->
    <div class="debug-section">
      <div class="text-subtitle2">Replication Status:</div>
      <div>{{ databaseStore.replicationStatus }}</div>
      <div>{{ databaseStore.replicationErrorMessage }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, Ref } from 'vue';
import { useDatabaseStore } from 'src/stores/database';
import { useSocketStore } from 'src/stores/socket';
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    const socketStore = useSocketStore();
    const databaseStore = useDatabaseStore();
    const databaseInfo: Ref<undefined | string | PouchDB.Core.DatabaseInfo> =
      ref(undefined);

    onMounted(async () => {
      databaseInfo.value = await databaseStore.fetchDatabaseInfo();
    });

    return {
      socketStore,
      databaseStore,
      databaseInfo,
    };
  },
});
</script>

<style scoped>
.debug-section {
  border: 1px solid #eee;
  padding: 1em;
  margin: 1em 0;
}
</style>
