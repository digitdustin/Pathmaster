import React, { Component } from "react";
import Node from "./Node/Node";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { runAlgorithm, getNodesInOrder } from "../Algorithms/RunAlgorithm.js";

import "./Pathmaster.css";

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      pieceType: "Knight",
      algorithm: "A* (Unweighted)",
    };
  }

  componentDidMount() {
    this.resetBoard();
  }

  resetBoard = () => {
    const grid = getInitialGrid();
    this.setState({ grid });
  };

  setPieceType = (piece) => {
    this.setState({ pieceType: piece });
  };

  setAlgorithm = (algo) => {
    this.setState({ algorithm: algo });
  };

  handleMouseDown = (e, row, col) => {
    if (row === undefined && col === undefined) {
      this.setState({ mouseIsPressed: true });
    } else {
      const newGrid = getNewGrid(this.state.grid, row, col, e);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
  };

  handleMouseEnter = (e, row, col) => {
    if (this.state.mouseIsPressed) {
      const newGrid = getNewGrid(this.state.grid, row, col, e);
      this.setState({ grid: newGrid });
    }
  };

  handleMouseUp = () => {
    this.setState({ mouseIsPressed: false });
  };

  async clearPath() {
    var clearNodes = document.getElementsByClassName("node-visited");
    if (clearNodes !== undefined) {
      for (let i = 0; i < clearNodes.length; i++) {
        clearNodes[i].className = "";
      }
    }
  }

  async animate(visitedNodesInOrder, nodesInShortestPathOrder, startNode) {
    await this.clearPath();
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
    }
    if (nodesInShortestPathOrder[0] === startNode) {
      setTimeout(() => {
        this.animateShortestPath(nodesInShortestPathOrder);
      }, 10 * visitedNodesInOrder.length);
      return;
    } else {
      //display error, shortest path not found
    }
  }

  animateShortestPath = (nodesInShortestPathOrder) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 50 * i);
    }
  };

  visualize = () => {
    const { grid, pieceType, algorithm } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = runAlgorithm(
      algorithm,
      grid,
      startNode,
      finishNode,
      pieceType
    );
    const nodesInShortestPathOrder = getNodesInOrder(
      finishNode,
      pieceType,
      true,
      grid
    );
    this.animate(visitedNodesInOrder, nodesInShortestPathOrder, startNode);
  };

  render() {
    var { grid, pieceType, algorithm } = this.state;

    return (
      <>
        <div className="body">
          <Header
            handleMouseUp={this.handleMouseUp}
            setPieceType={this.setPieceType}
            resetBoard={this.resetBoard}
            setAlgorithm={this.setAlgorithm}
            visualize={this.visualize}
          />
          <div
            className="grid"
            onMouseUp={() => this.handleMouseUp()}
            onContextMenu={(e) => e.preventDefault()}
          >
            {grid.map((row, rowIdx) => {
              return (
                <div className="row" key={rowIdx}>
                  {row.map((node, nodeIdx) => {
                    const {
                      col,
                      row,
                      isFinish,
                      isStart,
                      isColor,
                      isWall,
                    } = node;
                    return (
                      <Node
                        key={nodeIdx}
                        col={col}
                        row={row}
                        isFinish={isFinish}
                        isStart={isStart}
                        isWall={isWall}
                        isColor={isColor}
                        onMouseDown={(e) => this.handleMouseDown(e, row, col)}
                        onMouseEnter={(e) => this.handleMouseEnter(e, row, col)}
                      ></Node>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <p className="current">Current Piece: {pieceType}</p>
          <p className="current">Current Algorithm: {algorithm}</p>
          <Footer handleMouseUp={this.handleMouseUp} />
        </div>
      </>
    );
  }
}

const NUM_ROWS = 30;
const NUM_COLS = 72;
const START_NODE_ROW = Math.floor(NUM_ROWS / 2);
const START_NODE_COL = Math.floor(NUM_COLS / 4);
const FINISH_NODE_ROW = Math.floor(NUM_ROWS / 2);
const FINISH_NODE_COL = Math.floor((NUM_COLS * 3) / 4);

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < NUM_ROWS; row++) {
    const currentRow = [];
    for (let col = 0; col < NUM_COLS; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};
const createNode = (col, row) => {
  return {
    col,
    row,
    distance: Infinity,
    heuristic: Math.sqrt(
      Math.pow(col - FINISH_NODE_COL, 2) + Math.pow(row - FINISH_NODE_ROW, 2)
    ),
    isVisited: false,
    isChanged: false,
    previousNode: null,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    isColor: row % 2 === col % 2,
    isWall: false,
  };
};

const getNewGrid = (grid, row, col, mouse) => {
  const node = grid[row][col];
  if (mouse === 1) {
    if (!node.isStart && !node.isFinish) {
      node.isWall = true;
    }
  } else if (mouse === 3) {
    if (!node.isStart && !node.isFinish) {
      node.isWall = false;
    }
  }

  return grid;
};
