<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { IServerSideGetRowsParams } from 'ag-grid-community';
import AgGridComponent from 'components/ag-grid-component.vue';

const route = useRoute();
const router = useRouter();

const startRow = ref(0);
const endRow = ref(10);
const columns = computed(() => [
  { field: 'athlete' },
  { field: 'country', rowGroup: true, hide: true },
  { field: 'sport', rowGroup: true, hide: true },
  { field: 'year', filter: 'number', filterParams: { newRowsAction: 'keep' } },
  { field: 'gold', aggFunc: 'sum' },
  { field: 'silver', aggFunc: 'sum' },
  { field: 'bronze', aggFunc: 'sum' },
]);
const filterModel = ref();
const sortModel = ref();

const gridApiParams = ref();
const gridApi = ref();

const onGridReady = (params) => {
  gridApi.value = params.api;

  var datasource = createServerSideDatasource();
  // register the datasource with the grid
  params.api.setGridOption('serverSideDatasource', datasource);
};

async function updateFilterModel(params: Record<string, any>) {
  filterModel.value = params;
}

async function updateSortModel(params: Record<string, any>) {
  sortModel.value = params;
}

window.createServerSideDatasource = function createServerSideDatasource() {
  return {
    getRows: async (params: IServerSideGetRowsParams) => {
      startRow.value = params.request.startRow as number;
      endRow.value = params.request.endRow as number;
      filterModel.value = params.request.filterModel;
      sortModel.value = params.request.sortModel;
      gridApiParams.value = params;
      console.log({
        start: startRow.value,
        end: endRow.value,
      });
      fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
        .then((resp) => resp.json())
        .then((data) => {
          data.forEach(function (item) {
            var idSequence = 1;

            item.id = idSequence++;
          });

          // in this simplified fake server all rows are contained in an array
          const requestedRows = data.slice(startRow.value, endRow.value);
          params.success({
            rowData: requestedRows,
            rowCount: 8617,
          });
        })
        .catch(() => {
          params.fail();
          gridApi.value.showNoRowsOverlay();
        });
    },
  };
};
</script>

<template>
  <q-page class="q-pa-md q-gutter-md">
    <ag-grid-component
      :columns="columns"
      @on-grid-ready="onGridReady"
      @on-update-column-filter="(params) => updateFilterModel(params)"
      @on-update-column-sort="(params) => updateSortModel(params)"
    />
  </q-page>
</template>
