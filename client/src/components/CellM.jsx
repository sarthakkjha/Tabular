import React, { useState, useEffect } from "react";
import { tableState, formulaEngine } from "../../store/tableStore";
import syncService from "../../services/syncService";
import { useSnapshot } from "valtio";

export default function Cell({ rowIndex, columnIndex, coordinate }) {
  const tableSnapshot = useSnapshot(tableState);

  const cell = tableSnapshot?.getCell(rowIndex, columnIndex);
  const value = cell?.value || (cell?.value === 0 ? 0 : "");
  const formula = cell?.formula || cell?.value === 0 || "";

  let isFocused = tableSnapshot?.currentCell === coordinate;
  const [isEditing, setIsEditing] = useState(false);
  const [cellValue, setCellValue] = useState(isEditing ? formula || value : "");

  useEffect(() => {
    if (isEditing) {
      setCellValue(formula || value);
    } else {
      setCellValue(value);
    }
  }, [isEditing, formula, value]);

  function onClick() {
    if (tableSnapshot?.currentCell !== coordinate) {
      tableState.currentCell = coordinate;
    } else if (!isEditing) {
      setIsEditing(true);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter") {
      submitValue(isEditing);
      setIsEditing(false);
      // tableState.setCellByCoordinate(coordinate, e.target.value); FIXME : call the method to update
      formulaEngine.updateDependents(coordinate);
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  }

  function submitValue(edited=false) {
    if (cellValue[0] === "=") {
      if (cellValue.length == 1) {
        tableState.setCellByCoordinate(coordinate, "#MISSING_FORMULA", cellValue);
      } else {
        tableState.setCellByCoordinate(coordinate, "#ERROR", cellValue);
        formulaEngine.updateFormulaAndDependents(coordinate, cellValue.slice(1));
      }
    } else {
      const { formula: pFormula } = tableState.getCellByCoordinate(coordinate) || {};

      // If user is editing a cell that previously had a formula then reset it
      if (edited && pFormula) {
        tableState.resetFormula(coordinate);
      }

      tableState.setCellByCoordinate(coordinate, cellValue);
      formulaEngine.updateDependents(coordinate);
    }

    syncService.markCellDirty(coordinate, tableState.getCellByCoordinate(coordinate, true));
  }

  function onBlur(){
    const status = isEditing;
    setIsEditing(false);

    submitValue(status);
  }

  return (
    <input
      type="text"
      value={cellValue}
      readOnly={!isEditing}
      onClick={onClick}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      coordinate={coordinate}
      onChange={(e) => setCellValue(e.target.value)}
      className={[
        `${
          isFocused
            ? "bg-zinc-800 border-zinc-600"
            : "bg-zinc-900 border-zinc-700"
        }`,
        "border bg-transparent text-white h-full text-center w-full focus:outline-none px-1",
      ].join(" ")}
    />
  );
}