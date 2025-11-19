import { Table } from "./tableService.js";
import DependencyGraph from "./dependencyGraph.js";
import FormulaParser from "./formulaParser.js";

class FormulaEngineMediator {
  constructor(table) {
    this.table = table;
    this.dependencyGraph = new DependencyGraph();
    this.formulaParser = new FormulaParser();
  }
  
  // TODO: Implement a reset method to clear everything
  resetEngine() {
    this.dependencyGraph = new DependencyGraph();
    this.formulaParser = new FormulaParser();
  }

  setTable(table) {
    this.table = table;

    for (let rowIdx = 1; rowIdx < this.table.rows.length; rowIdx++) {
      for (let colIdx = 1; colIdx < this.table.cols.length; colIdx++) {
        const coordinate = `${this.table.getColumnName(colIdx)}${rowIdx}`;
        const formula = this.table.getCellFormulaByCoordinate(coordinate);

        if (formula) {
          this.updateFormulaAndDependents(coordinate, formula);
        }
      }
    }
  }

  // TODO: Implement a value cache to avoid recalculating the same value multiple times
  updateDependents(cell) {
    let { cycleHead, evaluationOrder, cycle } =
      this.dependencyGraph.getCellEvaluationOrder(cell);

    if (cycleHead) {
      cycle.forEach((cell) => {
        this.table.setCellByCoordinate(cell, "#CYCLE");
      });

      evaluationOrder = evaluationOrder.filter((cell) => !cycle.has(cell));
    }

    // for every cell, find depdencies, get values, evalue and set value
    const cellFormulas = this.table.getCellsByCoordinate(evaluationOrder, {
      returnType: "formula",
    });

    Object.keys(cellFormulas).forEach((coordinate) => {
      this.formulaParser.setExpression(cellFormulas[coordinate]);

      const requiredCellValues = this.formulaParser.getVariables();

      //#ERROR if different format than table cell AND NaN
      if (!requiredCellValues.every((val) => /^[A-Z]+\d+$/.test(val) || !isNaN(val))) {
        this.table.setCellByCoordinate(coordinate, '#ERROR');
        return;
      }

      const requiredValues = this.table.getCellsByCoordinate(
        requiredCellValues,
        { returnType: "value" }
      );

      if (Object.values(requiredValues).includes('#CYCLE')) {
        this.table.setCellByCoordinate(coordinate, '#CYCLE');
        return;
      }
      else if (Object.values(requiredValues).includes('#ERROR')) {
        this.table.setCellByCoordinate(coordinate, '#ERROR');
        return;
      }
      else if (Object.values(requiredValues).some((val) => isNaN(val))) {
        this.table.setCellByCoordinate(coordinate, '#ERROR');
        return;
      }

      const evaluatedValue =
        this.formulaParser.evaluateExpression(requiredValues);

      this.table.setCellByCoordinate(coordinate, evaluatedValue);
    });
  }

  /**
   * Updates the formula for a specific cell and its dependents.
   * @param {string} cell - The cell to update (e.g., "A1").
   * @param {string} formula - The new formula to set for the cell.
   */
  updateFormulaAndDependents(cell, formula) {
    if (formula[0] === "=") {
      formula = formula.slice(1);
    }

    this.formulaParser.setExpression(formula);
    const dependencies = this.formulaParser.getVariables();

    this.dependencyGraph.updateDependencies(cell, dependencies);

    this.updateDependents(cell);

    return;
  }
}

export default new FormulaEngineMediator(new Table());