<script lang="ts" setup>
import { GridOptions } from 'ag-grid-community';
import { ColumnAdvancedFilterModel } from 'ag-grid-community/dist/lib/interfaces/advancedFilterModel';
import 'ag-grid-community/styles/ag-grid.css'; // Core CSS
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Theme
import { AgGridVue } from 'ag-grid-vue3';
import { defineProps, onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';

defineOptions({
  inheritAttrs: false,
});

// Row Data: The data to be displayed.
const gridOptions = ref<GridOptions>();
const props = defineProps({
  columns: {
    type: Array as () => any[],
    required: true,
  },
  rowHeight: {
    type: Number,
    default: 50,
  },
  defaultColDef: {
    type: Object,
    required: false,
    default: () => ({
      flex: 1,
      minWidth: 100,
      sortable: true,
      filterParams: {
        closeOnApply: true,
        closeOnClear: true,
        buttons: ['apply', 'reset'],
      },
    }),
  },
});

const emit = defineEmits([
  'on-grid-ready',
  'update:modelValue',
  'on-update-pagination',
  'on-update-column-filter',
  'on-update-column-sort',
]);
const route = useRoute();
const paginationPageSize = ref();
const cacheBlockSize = ref();
const rowModelType = ref();
const maxBlocksInCache = ref();
const gridApi = ref();
const icons = ref();
const sideBar = ref();
const filterModel = ref<ColumnAdvancedFilterModel>();
const overlayNoRowsTemplate = ref();

onBeforeMount(() => {
  rowModelType.value = 'serverSide';
  paginationPageSize.value = 4000;
  cacheBlockSize.value = 5;
  icons.value = {
    'export-data':
      '<span class="ag-icon ag-icon-save" style="rotate: 90deg"></span>',
  };
  maxBlocksInCache.value = 3;
  sideBar.value = {
    toolPanels: [
      {
        id: 'columns',
        labelDefault: 'Columns',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
        toolPanelParams: {
          suppressValues: true, // disable Value
          suppressPivots: true, // disable Pivots
          suppressPivotMode: true, // disable PivotMode
          suppressRowGroups: true, // disable RowGroups
        },
      },
      {
        id: 'filters',
        labelDefault: 'Filters',
        labelKey: 'filters',
        iconKey: 'filter',
        toolPanel: 'agFiltersToolPanel',
      },
    ],
    defaultToolPanel: 'columns',
  };
  gridOptions.value = {
    enableRangeSelection: true,
    serverSideSortOnServer: true,
  };

  overlayNoRowsTemplate.value =
    '<span class="table-no-data">No data available. Use the filters to adjust your search.</span>';
});
const handleSelectionChange = () => {
  emit('update:modelValue', gridApi.value.getSelectedRows());
};

function handleGridReady(params: Record<string, any>) {
  console.log(' grid ready ', params);
  emit('on-grid-ready', params);
  gridApi.value = params.api;
}

const onFilterChanged = () => {
  filterModel.value = gridApi.value.getFilterModel();
  emit('on-update-column-filter', filterModel.value);
};
const onSortChanged = () => {
  window.colState = gridApi.value.getColumnState();
  let newSortedState = window.colState
    .filter(function (s: Record<string, any>) {
      return s?.sort != null;
    })
    .map(function (s: Record<string, any>) {
      return { colId: s?.colId, sort: s?.sort, sortIndex: s?.sortIndex };
    });
  emit('on-update-column-sort', newSortedState);
};

function onPaginationChanged(a) {
  // console.log(a);
  //
  // console.log('onPaginationPageLoaded');
  // // Workaround for bug in events order
  // if (gridApi.value) {
  //   console.log(gridApi.value.paginationIsLastPageFound());
  //   console.log(gridApi.value.paginationGetPageSize());
  //   // we +1 to current page, as pages are zero based
  //   console.log(gridApi.value.paginationGetCurrentPage() + 1);
  //   console.log(gridApi.value.paginationGetTotalPages());
  //   console.log(gridApi.value.paginationIsLastPageFound());
  //
  //   // emit('on-update-pagination', { startRow: 0, endRow: gridApi.value.paginationGetPageSize() });
  // }
}
</script>

<template>
  <!-- AG Grid Table -->
  <ag-grid-vue
    :columnDefs="props?.columns"
    :defaultColDef="props?.defaultColDef"
    :enableRangeSelection="false"
    :gridOptions="gridOptions"
    :icons="icons"
    :overlayNoRowsTemplate="overlayNoRowsTemplate"
    :pagination="true"
    :paginationPageSize="paginationPageSize"
    :paginationPageSizeSelector="[1000, 2000, 3000, 4000]"
    :rowHeight="props?.rowHeight"
    :rowModelType="rowModelType"
    :rowMultiSelectWithClick="false"
    :rowSelection="'multiple'"
    :sideBar="sideBar"
    class="ag-theme-quartz"
    style="height: 500px"
    @sortChanged="onSortChanged"
    @grid-ready="handleGridReady($event)"
    @selection-changed="handleSelectionChange"
    @filter-changed="onFilterChanged"
  />
</template>
<style lang="scss" scoped>
.rhino-table-header {
  margin-bottom: 20px;

  .table-title {
    font-size: 16px;
    font-weight: 500;
  }
}
</style>
