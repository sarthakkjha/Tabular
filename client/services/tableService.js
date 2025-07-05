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

// TODO: Implement methods to only update value / formula

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

  getCell(rowIdx, colIdx) {
    return this.table[this.rows[rowIdx]]?.[colIdx] || null;
  }

  getCellByCoordinate(coordinate) {
    const { column, row } = this.splitCellCoordinate(coordinate);

    if (column && row) {
      const colIndex = this.getColumnIndex(column);

      return this.getCell(row, colIndex);
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

  setCell(row, col, value, formula = null) {
    row = this.rows[row]; // Convert row index to actual row ID

    if (!this.table[row]) {
      this.table[row] = {};
    }

    if (!this.table[row][col]) {
      this.table[row][col] = createCell(value, formula);
      return;
    }

    this.table[row][col].value = value;
    
    if (formula && formula !== this.table[row][col].formula) {
      this.table[row][col].formula = formula;
    }
  }

  setCellByCoordinate(cell, value, formula = null) {
    const { column, row } = this.splitCellCoordinate(cell);

    if (column && row) {
      const colIndex = this.getColumnIndex(column);
      const cellObj = this.setCell(row, colIndex, value, formula);

      if (cellObj) {
        cellObj.value = value;
        return true;
      }
    }

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