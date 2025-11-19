import { proxy, subscribe } from "valtio";
import { subscribeKey } from "valtio/utils";
import { Table } from "../services/tableService.js";
import formulaEngine from "../services/formulaEngine.js";
import syncService from "../services/syncService.js";

/**
 * README
 * This file wires up `tableState` (Valtio proxy) with the formula engine.
 * Always import `formulaEngine` from here to ensure it's correctly bound.
 */

const initTable = new Table();

let tableState = proxy(initTable);
formulaEngine.setTable(tableState);

async function initializeSheetState(sheetId) {
  try {
    tableState.resetTable();

    const gridData = await syncService.fetchSheetGridIds(sheetId);
    const cellData = await syncService.fetchSheet(sheetId);

    const rowIds = gridData.rows.map((row) => row.id);
    const colIds = gridData.columns.map((col) => col.id);

    tableState.setGridIds(rowIds, colIds);

    cellData.forEach((cell) => {
      tableState.setCellById(cell);
    });

    formulaEngine.setTable(tableState);
  } catch (error) {
    console.error("Error initializing table state:", error);
  }
}

// subscribeKey(tableState, "currentCell", () => {
//   console.log("Current Cell : ", tableState);
// });

const subscribeToTableState = (callback, ...args) => {
  subscribe(tableState, () => {
    callback(...args);
  });
};

export {
  tableState,
  formulaEngine,
  subscribeToTableState,
  initializeSheetState,
};
