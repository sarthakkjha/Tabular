const express = require("express");
const cors = require("cors");
const { supabase, supabaseAdmin } = require("./config/supabase");
const sheetRepository = require("./repositories/sheetRepository");
const SheetController = require("./controllers/sheetController").default;
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

const sheetController = new SheetController(sheetRepository);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.get("/sheet", (req, res) => sheetController.fetchAllSheets(req, res));
app.get("/sheet/:sheetId/grid", (req, res) =>
  sheetController.fetchGridIds(req, res)
);
app.get("/sheet/:sheetId", (req, res) =>
  sheetController.fetchSheetById(req, res)
);
app.post("/sheet", (req, res) => sheetController.createSheet(req, res));
app.put("/sheet/:sheetId", (req, res) => sheetController.updateCells(req, res));
app.put("/sheet/:sheetId/title", (req, res) => {sheetController.updateTitle(req, res)});

app.listen(PORT, () => {
  console.log(`🚀 Tabular Server running on port ${PORT}`);
});
