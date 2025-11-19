class SheetController {
  constructor(sheetRepository) {
    this.repository = sheetRepository;
  }

  async fetchAllSheets(req, res) {
    try {
      const userId = req.user ? req.user.id : null;
      const sheets = await this.repository.findAll(userId);

      res.status(200).json(sheets);
    } catch (error) {
      console.error("Error fetching sheets:", error);

      res.status(500).json({ error: "Failed to fetch sheets" });
    }
  }

  async updateCells(req, res) {
    try {
      const { sheetId } = req.params;
      const { cells } = req.body;

      if (!cells || !Array.isArray(cells)) {
        return res.status(400).json({ error: "Invalid cells data" });
      }
      console.log("Updating cells for sheetId:", sheetId, "with data:", cells);
      const updatedSheet = await this.repository.updateCells(sheetId, cells);

      res.status(200).json(updatedSheet);
    } catch (error) {
      console.error("Error updating cells:", error);

      res.status(500).json({ error: "Failed to update cells" });
    }
  }

  async fetchGridIds(req, res) {
    try {
      const { sheetId } = req.params;
      const gridData = await this.repository.fetchGridIds(sheetId);

      if (!gridData) {
        return res.status(404).json({ error: "Sheet not found" });
      }

      res.status(200).json(gridData);
    } catch (error) {
      console.error("Error fetching grid IDs:", error);

      res.status(500).json({ error: "Failed to fetch grid IDs" });
    }
  }

  async fetchSheetById(req, res) {
    try {
      const { sheetId } = req.params;
      const sheet = await this.repository.fetchSheetById(sheetId);

      if (!sheet) {
        return res.status(404).json({ error: "Sheet not found" });
      }

      res.status(200).json(sheet);
    } catch (error) {
      console.error("Error fetching sheet:", error);

      res.status(500).json({ error: "Failed to fetch sheet" });
    }
  }

  async createSheet(req, res) {
    try {
      const { name = "Untitled Sheet", userId } = req.body;

      // FIXME: Figure out how to handle userId properly
      // if (!userId) {
      //   return res.status(400).json({ error: "userId is required" });
      // }

      const newSheet = await this.repository.createSheet(name);

      res.status(201).json(newSheet);
    } catch (error) {
      console.error("Error creating sheet:", error);

      res.status(500).json({ error: "Failed to create sheet" });
    }
  }

  async updateTitle(req, res) {
    try {
      const { sheetId } = req.params;
      const { title } = req.body;

      const updatedSheet = await this.repository.updateTitle(sheetId, title);

      res.status(200).json(updatedSheet);
    } catch (error) {
      console.error("Error updating sheet title:", error);

      res.status(500).json({ error: "Failed to update sheet title" });
    }
  }
}

export default SheetController;
