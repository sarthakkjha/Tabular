import axios from "axios";
import debounce from "lodash.debounce";

const sheetApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/sheet",
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

class syncService {
  
  constructor(api) {
    this.api = api;
    this.dirty_cells = {};

    // this.upsertCells = debounce(this.upsertCells, 10000); // 10 seconds
  }

  markCellDirty = (cellId, cell) => {
    this.dirty_cells[cellId] = cell;
    console.log("Dirty cells updated:", this.dirty_cells);
  };

  createSheet = async () => {
    try {
      const response = await this.api.post("/", { data: {} });
      return response.data;
    } catch (error) {
      console.error("Error creating sheet:", error);
      throw error;
    }
  };

  fetchAllSheets = async () => {
    try {
      const response = await this.api.get("/");
      return response.data;
    } catch (error) {
      console.error("Error fetching sheets:", error);
      throw error;
    }
  };

  fetchSheetGridIds = async (sheetId) => {
    try {
      const response = await this.api.get(`/${sheetId}/grid`);
      return response.data;
    } catch (error) {
      console.error("Error fetching sheet grid IDs:", error);
      throw error;
    }
  };

  fetchSheet = async (sheetId) => {
    try {
      const response = await this.api.get(`/${sheetId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching sheet:", error);
      throw error;
    }
  };

  // Using the tableService, fetch rid, cid, and value is formula || value
  // cells : Object<coordinate, { rid, cid, value, formula }>
  transformCells = () => {
    const transformedCells = [];

    for (const cell of Object.values(this.dirty_cells)) {
      const { rid, cid, value, formula } = cell;

      transformedCells.push({ rid, cid, value: formula || value });
    }

    return transformedCells;
  };

  resetDirtyCells = () => {
    this.dirty_cells = {};
  };

  upsertCells = async (sheetId, cells) => {
    try {
      // utils method to transform cells to the required format
      if (this.dirty_cells.size === 0) {
        console.log("No dirty cells to upsert.");
        return;
      }

      const response = await this.api.put(`/${sheetId}`, { cells: this.transformCells() });

      this.resetDirtyCells();

      return response.data;
    } catch (error) {
      console.error("Error updating cells:", error);
      throw error;
    }
  };
}

export default new syncService(sheetApi);