const cellPrototype = {
  value: "",
  formula: null,
};

function createCell(value = "", formula = null) {
  let cell = { ...cellPrototype };
  cell.value = value;
  cell.formula = formula;
  return cell;
}

// TODO: Implement methods to only set-reset value / formula

// FIXME: When adding new row or column, cells with formulas that reference the old row/column 
// should be updated to reference the new row/column.
class Table {
  constructor(table = {}, rows = [], cols = [], nextRowID, nextColID) {
    this.table = table;
    this.rows = rows;
    this.cols = cols;
    this.currentCell = null;

    this.nextRowID = nextRowID || this.rows.length + 1;
    this.nextColID = nextColID || this.cols.length + 1;

    if (!rows.length || !cols.length) {
      this.createDefaultTable();
    }
  }

  static copy(existingTable) {
    const newTable = new Table(
      { ...existingTable.table },
      [...existingTable.rows],
      [...existingTable.cols],
      existingTable.nextRowID,
      existingTable.nextColID
    );

    newTable.currentCell = existingTable.currentCell;

    return newTable;
  }

  resetTable() {
    this.rows = [];
    this.cols = [];
    this.currentCell = null;
    this.table = {};
  }

  setGridIds(rows, cols) {
    this.rows = rows;
    this.cols = cols;
  }

  createDefaultTable(rows = 1001, cols = 53) {
    for (let idx = 1; idx <= rows; idx++) {
      this.table[idx] = {};
      this.rows.push(idx);
    }

    for (let idx = 1; idx <= cols; idx++) {
      this.cols.push(idx);
    }

    this.nextRowID = rows + 1;
    this.nextColID = cols + 1;
  }

  getColumnName(colIndex) {
    let res = [];

    while (colIndex > 0) {
      colIndex--;

      res.push(String.fromCharCode((colIndex % 26) + 65));
      colIndex = Math.floor(colIndex / 26);
    }

    return res.reverse().join("");
  }

  getColumnIndex(colName) {
    let num = 0;

    for (let idx = 0; idx < colName.length; idx++) {
      num *= 26;
      num += colName.charCodeAt(idx) - 65 + 1;
    }

    return num;
  }

  splitCellCoordinate(coordinate) {
    const match = String(coordinate).match(/^([A-Z]+)(\d+)$/);

    if (match) {
      return { column: match[1], row: parseInt(match[2], 10) };
    }

    return { column: null, row: null };
  }

  getCell(rowIdx, colIdx, getIds = false) {
    const cell = this.table[this.rows[rowIdx]]?.[this.cols[colIdx]] || null;

    if (getIds && cell) {
      return {
        ...cell,
        rid: this.rows[rowIdx],
        cid: this.cols[colIdx],
      };
    }
    
    return cell;
  }

  getCellFormulaByCoordinate(coordinate) {
    const cell = this.getCellByCoordinate(coordinate);
    const formula = cell?.formula;
    
    if (formula && formula[0] === "=") {
      return formula.slice(1);
    }

    return formula;
  }

  getCellByCoordinate(coordinate, getIds=false) {
    const { column, row } = this.splitCellCoordinate(coordinate);

    if (column && row) {
      const colIndex = this.getColumnIndex(column);

      return this.getCell(row, colIndex, getIds);
    }

    return null;
  }

  /**
   * @param {string[]} coordinates  e.g. ["A1","B2","C3"]
   * @param {{ returnType?: "cell"|"value"|"formula" }} [options]
   * @returns {Record<string, any>}
   */
  getCellsByCoordinate(coordinates, { returnType = "cell" } = {}) {
    const cells = {};

    coordinates.forEach((coordinate) => {
      const { column, row } = this.splitCellCoordinate(coordinate);

      if (column && row) {
        const colIndex = this.getColumnIndex(column);
        const cell = this.getCell(row, colIndex);

        switch (returnType) {
          case "value":
            cells[coordinate] = cell?.value || 0;
            
            break;

          case "formula":
            if (cell?.formula) {
              cells[coordinate] = cell.formula.slice(1); // Remove the '=' sign
            }

            break;

          default: // "cell"
            cells[coordinate] = cell;
        }
      }
    });

    return cells;
  }

  setCellById({ rid, cid, value})
  {
    if (!this.table[rid]) {
      this.table[rid] = {};
    }

    if (!this.table[rid][cid]) {
      this.table[rid][cid] = createCell();
    }

    if (value && value[0] === "=") {
      this.table[rid][cid].formula = value;
    } else {
      this.table[rid][cid].value = value;
    }
  }

  createCellIfNotExists(row, col) {
    if (!this.table[row]) {
      this.table[row] = {};
    }

    if (!this.table[row][col]) {
      this.table[row][col] = createCell();
    }
  }

  setCell(row, col, value, formula = null) {
    row = this.rows[row]; // Convert row index to actual row ID
    col = this.cols[col]; // Convert column index to actual column ID

    this.createCellIfNotExists(row, col);

    this.table[row][col].value = value;

    // remove check for not null formula (formula && formula !== this.table[row][col].formula)
    if (formula && formula !== this.table[row][col].formula) {
      this.table[row][col].formula = formula;
    }
  }

  resetFormula(coordinate) {
    const { column, row } = this.splitCellCoordinate(coordinate);
    
    const colIndex = this.getColumnIndex(column);
    const rowId = this.rows[row];
    const colId = this.cols[colIndex];

    this.createCellIfNotExists(rowId, colId);

    if (this.table[rowId]?.[colId]?.formula) {
      this.table[rowId][colId].formula = null;
    }

    console.log(this.table[rowId][colId].formula);
  }

  setCellByCoordinate(cell, value, formula = null) {
    const { column, row } = this.splitCellCoordinate(cell);

    if (column && row) {
      const colIndex = this.getColumnIndex(column);

      this.setCell(row, colIndex, value, formula);

      return true;
    }

    console.warn(`Invalid cell coordinate: ${cell}`);
    
    return false;
  }

  addRowAfter(rowID) {
    const newRowID = this.nextRowID;
    this.table[newRowID] = {}; // Initialize the new row in the table

    const rowIndex = this.rows.indexOf(rowID);
    if (rowIndex !== -1) {
      this.rows.splice(rowIndex + 1, 0, newRowID); // Insert the new row ID after the specified row
    } else {
      this.rows.push(newRowID); // Add to the end if rowID is not found
    }

    this.nextRowID++;
  }

  addColumnAfter(colID) {
    const newColID = this.nextColID;

    const colIndex = this.cols.indexOf(colID);
    if (colIndex !== -1) {
      this.cols.splice(colIndex + 1, 0, newColID);
    } else {
      this.cols.push(newColID);
    }

    this.nextColID++;
  }

  deleteRow(rowID) {
    const rowIndex = this.rows.indexOf(rowID);

    if (rowIndex !== -1) {
      this.rows.splice(rowIndex, 1); // Remove the row ID from the rows array
      delete this.table[rowID]; // Delete the row from the table
    }
  }

  deleteColumn() {}
}

export { Table, createCell };

// let table = new Table();
// table.setCellByCoordinate("A1", 10);
// table.setCellByCoordinate("B1", 20);
// console.log(table.getCellByCoordinate("A1")); // 20
// table.setCellByCoordinate("A1", 15);
// console.log(table.getCellByCoordinate("B1")); // 20
// console.log(table.getCellsByCoordinate(["A1", "B1"], { returnType: "formula"})); // { A1: 15, B1: 20 }