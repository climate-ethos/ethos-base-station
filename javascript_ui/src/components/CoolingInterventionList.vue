<template>
  <q-card>
    <q-card-section class="row items-center q-pb-none">
      <div class="text-bold fontsize-20">Cooling Strategies</div>
      <q-space />
      <q-btn icon="close" color="primary" class="fontsize-12" v-close-popup>
        Close
      </q-btn>
    </q-card-section>
    <q-card-section>
      <div class="fontsize-16 q-mb-md">
        Best ways to cool yourself (click on a row for more info):
      </div>
      <div class="row">
        <div class="col-4 q-pr-lg">
          <CoolingInterventionFan />
          <q-btn
            label="When should I not use a fan?"
            color="info"
            class="q-mt-xl q-ma-lg"
            @click="isShowFanModal = true"
          />
        </div>
        <div class="table-container col-8">
          <q-table
            ref="tableRef"
            :rows="rows"
            class="my-sticky-header-table"
            row-key="name"
            :pagination="pagination"
            :columns="columns"
            hide-bottom
          >
            <template v-slot:body="props">
              <q-tr
                @click="onRowClick(props.row)"
                :props="props"
                :class="{
                  'bg-grey text-white': !props.row.effectiveness,
                }"
              >
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  <template v-if="col.name === 'icon'">
                    <q-icon
                      :name="props.row[col.name]"
                      size="60px"
                      color="grey"
                    />
                  </template>
                  <template v-else-if="col.name === 'effectiveness'">
                    <CoolingInterventionEffectiveness
                      :effectiveness="props.row[col.name]"
                    />
                  </template>
                  <template v-else>
                    {{ props.row[col.name] }}
                  </template>
                </q-td>
              </q-tr>
            </template>
          </q-table>
          <q-avatar
            icon="arrow_upward"
            size="xl"
            color="primary"
            text-color="white"
            class="scroll-indicator-top"
            v-show="showTopScrollIndicator"
            @click="scrollTo(0)"
          />
          <q-avatar
            icon="arrow_downward"
            size="xl"
            color="primary"
            text-color="white"
            class="scroll-indicator-bottom"
            v-show="showBottomScrollIndicator"
            @click="scrollTo(1)"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  Ref,
  onMounted,
  onBeforeUnmount,
  computed,
  inject,
} from 'vue';
import { useDataPreferencesStore } from 'src/stores/dataPreferences';
import { CoolingStrategy } from 'src/components/models';
import { coolingStrategies } from 'src/helpers/coolingStrategies';
import { QTable, QTableProps } from 'quasar';
import CoolingInterventionEffectiveness from './CoolingInterventionEffectiveness.vue';
import CoolingInterventionFan from './CoolingInterventionFan.vue';

export default defineComponent({
  name: 'CoolingInterventionList',
  components: {
    CoolingInterventionEffectiveness,
    CoolingInterventionFan,
  },
  setup(props, { emit }) {
    const isShowFanModal = inject('isShowFanModal');
    const dataPreferencesStore = useDataPreferencesStore();
    const showBottomScrollIndicator = ref(false);
    const showTopScrollIndicator = ref(false);
    const tableRef: Ref<null | QTable> = ref(null);
    const pagination = {
      rowsPerPage: 0,
    };
    const columns: QTableProps['columns'] = [
      {
        name: 'icon',
        required: true,
        label: '',
        align: 'left',
        field: 'icon',
      },
      {
        name: 'name',
        required: true,
        label: 'Name',
        align: 'left',
        field: 'name',
      },
      {
        name: 'effectiveness',
        required: true,
        label: 'Potential Effectiveness',
        align: 'left',
        field: 'effectiveness',
      },
    ];

    const rows = computed(() => {
      // Separate the strategies into two arrays based on haveAccessTo and wouldUse properties
      const availableOptions =
        dataPreferencesStore.coolingStrategyOptions.filter(
          (option) => option.haveAccessTo && option.wouldUse
        );
      const remainingOptions =
        dataPreferencesStore.coolingStrategyOptions.filter(
          (option) => !(option.haveAccessTo && option.wouldUse)
        );

      // Get strategy text from source
      const avaliableStrategies = availableOptions.map(
        (el) => coolingStrategies[el.key]
      );
      const remainingStrategies = remainingOptions.map(
        (el) => coolingStrategies[el.key]
      );

      // Sort both arrays
      avaliableStrategies.sort((a, b) => b.effectiveness - a.effectiveness);
      remainingStrategies.sort((a, b) => b.effectiveness - a.effectiveness);

      // Concatenate the sorted arrays with the special row in between
      return avaliableStrategies.concat([
        {
          name: 'You might also consider using...',
          shortName: '',
          icon: '',
          effectiveness: 0,
          extraInfo: {
            bestUse: [],
            whenUse: [],
            whenNotUse: [],
          },
        },
        ...remainingStrategies,
      ]);
    });

    onMounted(() => {
      const table = tableRef.value?.$el;
      if (table) {
        const tableBody = table.querySelector('.q-table__middle.scroll');
        if (tableBody && tableBody.clientHeight < tableBody.scrollHeight) {
          // If there is scrollable content
          showBottomScrollIndicator.value = true;
          tableBody.addEventListener('scroll', handleScroll);
        }
      }
    });

    onBeforeUnmount(() => {
      const table = tableRef.value?.$el;
      if (table) {
        const tableBody = table.querySelector('.q-table__middle.scroll');
        if (tableBody) {
          tableBody.removeEventListener('scroll', handleScroll);
        }
      }
    });

    const handleScroll = (event: UIEvent) => {
      const target = event.target as HTMLElement;
      if (target) {
        showBottomScrollIndicator.value =
          target.scrollTop + target.clientHeight < target.scrollHeight - 10;
        showTopScrollIndicator.value = target.scrollTop > 10;
      }
    };

    const scrollTo = (percent: number) => {
      const table = tableRef.value?.$el;
      if (!table) {
        return;
      }
      const tableBody = table.querySelector('.q-table__middle.scroll');
      if (tableBody) {
        const start = tableBody.scrollTop;
        const end = percent * tableBody.scrollHeight;
        const change = end - start;
        const duration = 200; // Duration in ms
        const startTime = performance.now();

        const animateScroll = (currentTime: number) => {
          const elapsedTime = currentTime - startTime;
          const progress = elapsedTime / duration;

          tableBody.scrollTop = start + change * easeInOutQuad(progress);

          if (progress < 1) {
            window.requestAnimationFrame(animateScroll);
          }
        };

        const easeInOutQuad = (t: number) => {
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        };

        window.requestAnimationFrame(animateScroll);
      }
    };

    const onRowClick = (row: CoolingStrategy) => {
      if (row.effectiveness) {
        emit('show-info', row);
      }
    };

    return {
      isShowFanModal,
      dataPreferencesStore,
      rows,
      columns,
      pagination,
      tableRef,
      showBottomScrollIndicator,
      showTopScrollIndicator,
      onRowClick,
      scrollTo,
    };
  },
});
</script>

<style lang="scss" scoped>
.table-container {
  position: relative; // This allows absolute positioning of children
}

.my-sticky-header-table {
  /* height or max-height is important */
  height: calc(70vh);
}
</style>
