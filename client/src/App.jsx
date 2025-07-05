import React, { useState, useEffect } from "react";
import { Grid } from "react-virtualized";
import { Table } from "../services/tableService";
import Cell from "./components/Cell";

// New Initial Table Definition
const newInitTable = {
  1: { 1: { value: "HELLO WORLD", formula: "" } },
  2: { 1: { value: "TRY", formula: "" }, 2: { value: "FORMULA", formula: "" } },
};

function App() {
  const [tableInstance, setTableInstance] = useState(null);
  const [currentCell, setCurrentCell] = useState("A1");
  console.log(tableInstance);

  useEffect(() => {
    const table = new Table(
      newInitTable,
      Array.from({ length: 1001 }, (_, i) => i),
      Array.from({ length: 53 }, (_, i) => i)
    );
    // const table = new Table();

    setTableInstance(table);
  }, []);

  const handleInputChange = (rowIndex, columnIndex, value, formula = "") => {
    if (tableInstance) {
      const updatedTableInstance = Table.copy(tableInstance);
      updatedTableInstance.setCell(rowIndex, columnIndex, value, formula);
      setTableInstance(updatedTableInstance);
    }
  };

  const handleAddRow = () => {
    if (tableInstance) {
      const updatedTableInstance = Table.copy(tableInstance);
      updatedTableInstance.addRowAfter(1);
      setTableInstance(updatedTableInstance);
    }
  };

  const cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
    if (rowIndex === 0 && columnIndex === 0) {
      return (
        <div
          key={key}
          style={style}
          className="bg-zinc-950/50 border border-gray-100 flex justify-center items-center font-bold text-white"
        >
          {/* Empty top-left corner */}
        </div>
      );
    }

    if (rowIndex === 0) {
      return (
        <div
          key={key}
          style={style}
          className="bg-zinc-950/50 border border-gray-100 flex justify-center items-center font-bold text-white"
        >
          {tableInstance?.getColumnName(columnIndex)}
        </div>
      );
    }

    if (columnIndex === 0) {
      return (
        <div
          key={key}
          style={style}
          className="bg-zinc-950/50 border border-gray-100 flex justify-center items-center font-bold text-white"
        >
          {rowIndex}
        </div>
      );
    }

    const cell = tableInstance?.getCell(rowIndex, columnIndex);
    const value = cell?.value || "";
    const formula = cell?.formula || "";
    const cellCoordinate = `${tableInstance?.getColumnName(
      columnIndex
    )}${rowIndex}`;

    return (
      <div key={key} style={style} className="flex justify-center items-center">
        <Cell
          rowIndex={rowIndex}
          columnIndex={columnIndex}
          coordinate={cellCoordinate}
          value={value}
          formula={formula}
          onChange={handleInputChange}
          currentCell={currentCell}
          setCurrentCell={setCurrentCell}
          tableInstance={tableInstance}
        />
      </div>
    );
  };

  return (
    <>
      <div className="w-full h-[10vh] bg-zinc-800 flex justify-between items-center px-4">
        <div className="text-white font-bold text-2xl">Tabular</div>
        <div className="flex items-center space-x-4">
          <span className="text-white bg-zinc-900 px-3 py-2 rounded min-w-[100px]">
            Cell : <b>{currentCell}</b>
          </span>
          <span className="text-white bg-zinc-900 px-3 py-2 rounded min-w-[200px]">
            Formula :{" "}
            <b>{tableInstance?.getCellByCoordinate(currentCell)?.formula.slice(1) || ""}</b>
          </span>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleAddRow}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-transform transform hover:scale-105"
          >
            Add Row
          </button>
          <button
            onClick={() => {
              if (tableInstance) {
                const updatedTableInstance = Table.copy(tableInstance);
                updatedTableInstance.addColumnAfter(1);
                setTableInstance(updatedTableInstance);
              }
            }}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-transform transform hover:scale-105"
          >
            Add Column
          </button>
          <button
            onClick={() => {
              console.log("Save sheet functionality to be implemented");
            }}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-transform transform hover:scale-105"
          >
            Save Sheet
          </button>
        </div>
      </div>
      <Grid
        cellRenderer={cellRenderer}
        columnCount={tableInstance?.cols.length || 53}
        columnWidth={100}
        height={0.9 * window.innerHeight}
        rowCount={tableInstance?.rows.length || 1000}
        rowHeight={30}
        width={window.innerWidth}
      />
    </>
  );
}

export default App;
