import React from "react";
import { useState, useEffect } from "react";
import formulaEngine from "../../services/formulaEngine";

function Cell({
  rowIndex,
  columnIndex,
  coordinate,
  value,
  formula,
  onChange,
  currentCell,
  setCurrentCell,
  tableInstance,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [cellValue, setCellValue] = useState("");

  function onClick() {
    if (currentCell != coordinate) {
      setCurrentCell(coordinate);
    } else if (!isEditing) {
      setIsEditing(true);
      setCellValue(formula || value);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter") {
      submitValue();
      setIsEditing(false);
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setIsFocused(false);
      setCellValue(value);
    }
  }

  function submitValue() {
    if (cellValue[0] === "=" && cellValue.length > 1) {
      onChange(rowIndex, columnIndex, "#FORMULA", cellValue);
      const formulaExpression = cellValue.slice(1);
      setCellValue(value);
      
      formulaEngine.setTable(tableInstance);
      formulaEngine.updateFormulaAndDependents(coordinate, formulaExpression);
      console.log(formulaEngine.table.getCellByCoordinate(coordinate));
    } else {
      onChange(rowIndex, columnIndex, cellValue, formula);
      formulaEngine.updateDependents(coordinate);
    }
  }

  function onBlur() {
    setIsEditing(false);
    setCurrentCell(null);
    submitValue();
  }

  useEffect(() => {
    setIsFocused(currentCell === coordinate);
    setCellValue(value);
  }, [value, currentCell, coordinate]);

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

export default Cell;
