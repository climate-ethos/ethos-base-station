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
      <div class="row">
        <div class="table-container col-8">
          <div class="fontsize-16 q-mb-sm">
            Best ways to cool yourself (click on a row for more info):
          </div>
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
            @click="scrollPage('up')"
          />
          <q-avatar
            icon="arrow_downward"
            size="xl"
            color="primary"
            text-color="white"
            class="scroll-indicator-bottom"
            v-show="showBottomScrollIndicator"
            @click="scrollPage('down')"
          />
        </div>
        <div class="col-4 q-pl-lg">
          <div class="fontsize-16 q-mb-sm">Should you use a fan:</div>
          <CoolingInterventionFan />
          <q-btn
            label="When should I not use a fan?"
            color="info"
            class="q-mt-xl q-ma-lg"
            @click="isShowFanModal = true"
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
import { CoolingStrategy } from 'src/typings/data-types';
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
      const availableStrategies = availableOptions.map(
        (el) => coolingStrategies[el.key]
      );
      const remainingStrategies = remainingOptions.map(
        (el) => coolingStrategies[el.key]
      );

      // Sort both arrays
      availableStrategies.sort((a, b) => b.effectiveness - a.effectiveness);
      remainingStrategies.sort((a, b) => b.effectiveness - a.effectiveness);

      // Concatenate the sorted arrays with the special row in between
      return availableStrategies.concat([
        {
          name: 'You might also consider using...',
          shortName: '',
          icon: '',
          effectiveness: 0,
          group: '',
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

    const scrollPage = (direction: 'up' | 'down') => {
      const table = tableRef.value?.$el;
      if (!table) {
        return;
      }
      const tableBody = table.querySelector('.q-table__middle.scroll');
      if (tableBody) {
        const scrollAmount = tableBody.clientHeight * 0.9; // 90% of visible height
        const targetScroll =
          direction === 'up'
            ? tableBody.scrollTop - scrollAmount
            : tableBody.scrollTop + scrollAmount;

        const start = tableBody.scrollTop;
        const change = targetScroll - start;
        const duration = 300; // Duration in ms
        const startTime = performance.now();

        const animateScroll = (currentTime: number) => {
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);

          tableBody.scrollTop = start + change * easeInOutQuad(progress);

          if (progress < 1) {
            window.requestAnimationFrame(animateScroll);
          } else {
            // Update indicators after scrolling
            handleScroll({ target: tableBody } as unknown as UIEvent);
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
      scrollPage,
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

// Styling for scroll indicators at top and bottom of table when content is there
.scroll-indicator-top,
.scroll-indicator-bottom {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.scroll-indicator-bottom {
  bottom: 10px;
}

.scroll-indicator-top {
  top: 100px;
}
</style>
