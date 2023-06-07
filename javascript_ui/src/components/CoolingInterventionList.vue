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
      <div class="fontsize-16">
        If you need to lower your body temperature, here are the best ways to do
        it (click on a row for more info):
      </div>
      <div class="table-container">
        <q-table
          ref="tableRef"
          :rows="coolingStrategies"
          class="large-font my-sticky-header-table"
          row-key="name"
          :pagination="pagination"
          :columns="columns"
          @row-click="onRowClick"
          hide-bottom
        >
          <template v-slot:body-cell-icon="props">
            <q-td :props="props">
              <q-icon :name="props.row.icon" size="60px" color="grey" />
            </q-td>
          </template>

          <template v-slot:body-cell-effectiveness="props">
            <q-td :props="props">
              <CoolingInterventionEffectiveness
                :effectiveness="props.row.effectiveness"
              />
            </q-td>
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
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, onMounted, onBeforeUnmount } from 'vue';
import { CoolingStrategy } from 'src/components/models';
import { coolingStrategies } from 'src/helper/coolingStrategies';
import { QTable, QTableProps } from 'quasar';
import CoolingInterventionEffectiveness from './CoolingInterventionEffectiveness.vue';

export default defineComponent({
  name: 'CoolingInterventionList',
  components: { CoolingInterventionEffectiveness },
  setup(props, { emit }) {
    const showBottomScrollIndicator = ref(false);
    const showTopScrollIndicator = ref(false);
    const tableRef: Ref<null | QTable> = ref(null);
    const pagination = {
      rowsPerPage: 0,
      sortBy: 'effectiveness',
      descending: true,
    };
    const columns: QTableProps['columns'] = [
      {
        name: 'icon',
        required: true,
        label: '',
        align: 'left',
        field: 'icon',
        format: (val: string) => `<img src="${val}" alt="" />`,
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
        sortable: true,
        label: 'Potential Effectiveness',
        align: 'left',
        field: 'effectiveness',
      },
    ];

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

    const onRowClick = (evt: Event, row: CoolingStrategy) => {
      emit('show-info', row);
    };

    return {
      coolingStrategies,
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

<style lang="scss">
.large-font {
  tbody td,
  thead th {
    font-size: 26px;
  }
}

.table-container {
  position: relative; // This allows absolute positioning of children
}

.q-table__middle.scroll::-webkit-scrollbar {
  width: 20px; /* barStyle width */
  background-color: #027ae333; /* barStyle background color */
  border-radius: 9px; /* barStyle border radius */
}

.q-table__middle.scroll::-webkit-scrollbar-thumb {
  right: 4px; /* thumbStyle right */
  border-radius: 9px; /* thumbStyle border radius */
  background-color: #027ae3bf; /* thumbStyle background color */
  width: 16px; /* thumbStyle width */
}

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
  top: 60px;
}

.my-sticky-header-table {
  /* height or max-height is important */
  height: calc(100vh / 1.5);

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    /* bg color is important for th; just specify one */
    background-color: $grey-3;
  }

  thead tr th {
    position: sticky;
    z-index: 1;
  }
  thead tr:first-child th {
    top: 0;
  }

  /* prevent scrolling behind sticky top row on focus */
  tbody {
    /* height of all previous header rows */
    scroll-margin-top: 48px;
  }
}
</style>
