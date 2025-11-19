const BaseRepository = require("./baseRepository");

class SheetRepository extends BaseRepository {
  constructor() {
    super("sheets");
  }

  async findAll(userId = null) {
    let query = this.supabase.from(this.tableName).select("*");

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;

    return data;
  }

  async createSheet(name) {
    try {
      if (!name) name = "Untitled Sheet";

      const { data, error } = await this.supabase.rpc("initialize_table", {
        tname: name,
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error creating table:", error);
     
      throw error;
    }
  }

  /**
   * Finds all grid IDs (row and column) for a given sheet.
   * @param {string} sheetId - The ID of the sheet to find grid IDs for.
   * @returns {Promise<Object>} - An object containing arrays of row and column IDs.
   */
  async fetchGridIds(sheetId) {
    try {
      let { data: rowData, error: rowError } = await this.supabase
        .from("rows")
        .select("id")
        .eq("sid", sheetId);

      const { data: colData, error: colError } = await this.supabase
        .from("columns")
        .select("id")
        .eq("sid", sheetId);

      if (rowError || colError) {
        throw rowError || colError;
      }

      const data = {
        rows: rowData,
        columns: colData,
      };

      return data;
    } catch (error) {
      console.error("Error fetching grid IDs:", error);

      throw error;
    }
  }

  async fetchSheetById(sheetId) {
    try {
      const { data, error } = await this.supabase
        .from('cells')
        .select('rid, cid, value')
        .eq("sid", sheetId);

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error fetching sheet by ID:", error);
      throw error;
    }
  }

  async updateCells(sheetId, cells) {
    try {
      const { data, error } = await this.supabase
        .from('cells')  
        .upsert(cells.map(cell => ({ ...cell, sid: sheetId })), { onConflict: ['sid', 'rid', 'cid'] })
        .select();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error updating cells:", error);
      throw error;
    }
  }

  async updateTitle(sheetId, title) {
    try {
      const { data, error } = await this.supabase
        .from('sheets')
        .update({ title })
        .eq('id', sheetId)
        .select();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error updating sheet title:", error);
      throw error;
    }
  }
}

module.exports = new SheetRepository();
