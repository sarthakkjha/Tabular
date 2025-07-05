import { Parser } from "expr-eval";

class FormulaParser {
  constructor(expression = null) {
    this.expression = expression;
    this.parser = new Parser();
    this.formula = expression ? this.parser.parse(expression) : null;
  }

  getExpression() {
    return this.expression;
  }

  setExpression(expression) {
    this.expression = expression;
    this.formula = this.parser.parse(expression);
  }

  /*
   * Returns the symbols in the expression. This is used to get the cell references in the formula.
   * @returns {Array} - An array of symbols in the expression.
   */
  getVariables() {
    return this.formula.variables();
  }

  /*
   * Evaluates the expression with the given cell values.
   * @param {Object} cellValues - An object containing cell values.
   * @returns {number | null}
   */
  evaluateExpression(cellValues) {
    if (!this.expression) return null;

    return this.formula.evaluate(cellValues);
  }
}

export default FormulaParser;
