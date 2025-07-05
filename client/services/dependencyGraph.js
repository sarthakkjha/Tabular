class DependencyGraphInterface {
  addDependency(cell, dependency) {
    throw new Error("Method not implemented.");
  }

  removeDependency(cell, dependency) {
    throw new Error("Method not implemented.");
  }

  getDependencies(cell) {
    throw new Error("Method not implemented.");
  }

  getDependents(cell) {
    throw new Error("Method not implemented.");
  }

  hasDependency(cell, dependency) {
    throw new Error("Method not implemented.");
  }

  hasDependent(cell, dependent) {
    throw new Error("Method not implemented.");
  }
}

class DependencyGraph extends DependencyGraphInterface {
  /**
   * DependencyGraph is a directed graph where each cell can have multiple dependencies and dependents.
   * The graph is represented as a map where the key is the cell and the value is an object containing
   * two sets: one for dependencies and one for dependents.
   */
  constructor() {
    // Map from cell => { dependencies: Set, dependents: Set }
    super();
    this.graph = new Map();
  }

  getNode(cell) {
    if (!this.graph.has(cell)) {
      this.graph.set(cell, { dependencies: new Set(), dependents: new Set() });
    }

    return this.graph.get(cell);
  }

  addDependency(cell, dependency) {
    const cellNode = this.getNode(cell);
    const dependencyNode = this.getNode(dependency);

    cellNode.dependencies.add(dependency);
    dependencyNode.dependents.add(cell);
  }

  removeDependency(cell, dependency) {
    const cellNode = this.graph.get(cell);
    const dependencyNode = this.graph.get(dependency);

    if (cellNode) {
      cellNode.dependencies.delete(dependency);

      this.removeEmptyNode(cell);
    }

    if (dependencyNode) {
      dependencyNode.dependents.delete(cell);

      this.removeEmptyNode(dependency);
    }
  }

  getDependencies(cell) {
    const node = this.graph.get(cell);

    return node ? Array.from(node.dependencies) : [];
  }

  getDependents(cell) {
    const node = this.graph.get(cell);

    return node ? Array.from(node.dependents) : [];
  }

  hasDependency(cell, dependency) {
    const node = this.graph.get(cell);

    return node ? node.dependencies.has(dependency) : false;
  }

  hasDependent(cell, dependent) {
    const node = this.graph.get(cell);

    return node ? node.dependents.has(dependent) : false;
  }

  removeEmptyNode(cell) {
    const node = this.graph.get(cell);

    if (node && node.dependencies.size === 0 && node.dependents.size === 0) {
      this.graph.delete(cell);
    }
  }

    /** 
   * Updates the dependencies of a cell in the dependency graph.
   * @param {string} node - The cell coordinate (e.g., "A1").
   * @param {Array} dependencies - An array of nodes that the cell depends on.
   * @returns {void}
  */
    updateDependencies(node, dependencies) {
      const oldDependencies = this.getDependencies(node);
      const newDependenciesSet = new Set(dependencies);
  
      oldDependencies.forEach((dependency) => {
        if (!newDependenciesSet.has(dependency)) {
          this.removeDependency(node, dependency);
        }
      });
  
      dependencies.forEach((dependency) => {
        if (!this.hasDependency(node, dependency)) {
          this.addDependency(node, dependency);
        }
      });
    }

  /**
   * Returns the evaluation order of the cells in the graph.
   * This is done using a depth-first search (DFS) algorithm.
   * @param {string} sourceNode - The cell to start the evaluation from.
   * @returns {Object} - An object containing the evaluation order and a boolean indicating if a cycle was found.
   */
  getCellEvaluationOrder(sourceNode) {
    let hasCycle = false;
    const visitedNodes = new Set();
    const pathSet = new Set();
    const stack = [];

    const dfs = (node) => {
      if (visitedNodes.has(node)) {
        if (pathSet.has(node)) {
          hasCycle = true;
        }

        return;
      }

      visitedNodes.add(node);
      pathSet.add(node);

      for (const dependent of this.getDependents(node)) {
        dfs(dependent);
      }

      stack.push(node);
      pathSet.delete(node);
    };

    dfs(sourceNode);

    return { hasCycle, evaluationOrder: stack.reverse() };
  }
}

export default DependencyGraph;