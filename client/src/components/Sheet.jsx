import { Grid } from "react-virtualized";
import { useSnapshot } from "valtio";
import { tableState } from "../../store/tableStore.js";
import CellM from "./CellM.jsx";

const Cell = CellM; // Use the migrated Cell component

function Sheet() {
  console.log("Migrated Sheet Rendered");
  const tableSnapshot = useSnapshot(tableState);

  const handleInputChange = (rowIndex, columnIndex, value, formula = "") => {
    // tableState.setCell(rowIndex, columnIndex, value, formula);
  };

  const handleAddRow = () => {
    // TODO: Make this method dynamic
    tableState.addRowAfter(1);
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
          {tableState.getColumnName(columnIndex)}
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

    const cell = tableState?.getCell(rowIndex, columnIndex);
    const value = cell?.value || (cell?.value === 0 ? 0 : "");
    const formula = cell?.formula || cell?.value === 0 || "";
    const cellCoordinate = `${tableState?.getColumnName(
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
        />
      </div>
    );
  };

  return (
    <Grid
      cellRenderer={cellRenderer}
      columnCount={tableState?.cols.length || 53}
      columnWidth={100}
      height={0.9 * window.innerHeight}
      rowCount={tableState?.rows.length || 1000}
      rowHeight={30}
      width={window.innerWidth}
    />
  );
}

export default Sheet;