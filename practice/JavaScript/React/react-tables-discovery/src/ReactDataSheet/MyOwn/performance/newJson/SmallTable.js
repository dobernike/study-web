import React, { useState, useCallback, useMemo, memo, useEffect } from "react";
import DataSheet from "../../../../packages/react-datasheet";
import "../../../../packages/react-datasheet/lib/react-datasheet.css";
import { evaluate } from "mathjs";
// import { StickyContainer, Sticky } from "react-sticky";
import numberToFormat from "../../utils/numberToFormat";
import "../../table2.css";
import "../../styles.css";

export default ({ data, onUpdate, name }) => {
  const [grid, setCells] = useState(data);
  const [isEmptyRowsHide, setIsEmptyRowsHide] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [middleOfSum, setMiddleOfSum] = useState(0);
  const [selectedDiff, setSelectedDiff] = useState({ rows: 0, cols: 0 });

  useEffect(() => setCells(data), [data]);

  const validateExp = (trailKeys, expr) => {
    let valid = true;
    const matches = expr.match(/[A-Z][1-9]+/g) || [];

    for (let match of matches) {
      if (trailKeys.indexOf(match) > -1) {
        valid = false;
      } else {
        valid = validateExp([...trailKeys, match], grid[match].expr);
      }
    }

    return valid;
  };

  const computeExpr = (key, expr, scope) => {
    let value = null;

    if (expr.charAt(0) !== "=") {
      expr = expr.replace(",", ".");
      expr = isNaN(expr) || expr === "" ? "0.00" : expr;

      const className = expr < 0 ? "value-error" : "";

      return { className, value: expr, expr };
    }

    try {
      value = evaluate(expr.substring(1), scope);
    } catch {
      value = null;
    }

    if (value !== null && validateExp([key], expr)) {
      return { value, expr };
    }

    return { className: "error", value: "error", expr: "" };
  };

  const cellUpdate = (copyCells, changeCell, expr) => {
    console.log(copyCells, changeCell, expr);

    const scope = copyCells.map(arr =>
      arr.map(cell => {
        cell.value = isNaN(cell.value) ? 0.0 : cell.value;
        return cell;
      })
    );

    const updatedCell = computeExpr(changeCell.key, expr, scope);

    copyCells[1][1] = updatedCell;

    Object.values(copyCells).forEach(cell => {
      if (
        cell.expr.charAt(0) === "=" &&
        cell.expr.indexOf(changeCell.key) > -1 &&
        cell.key !== changeCell.key
      ) {
        copyCells = cellUpdate(copyCells, cell, cell.expr);
      }
    });

    return copyCells;
  };

  const handleCellsChanged = useCallback(
    changes => {
      const copyCells = [...grid];

      changes.forEach(({ cell, value }) => {
        cellUpdate(copyCells, cell, value);
      });

      setCells(copyCells);
    },
    [grid]
  );

  const handleSheetRenderer = useCallback(
    props => <div className={props.className}>{props.children}</div>,
    []
  );

  let topHead;

  const handleRowRenderer = useCallback(
    props => {
      if (props.children[0].props.cell.className === "top-head") {
        topHead = (
          <div className="data-row data-row-sticky data-row-sticky__top">
            {props.children}
          </div>
        );

        return null;
      }

      if (props.children[0].props.cell.className === "bot-head") {
        return (
          <>
            {topHead}
            <div className="data-row data-row-sticky">{props.children}</div>
          </>
        );
      }

      if (isEmptyRowsHide) {
        let count = 0;
        let empty = 0;

        React.Children.forEach(props.children, child => {
          const value = child.props.cell.value;
          const expr = child.props.cell.expr;

          if (isNaN(parseFloat(value))) return;

          count += 1;

          if (value === "0.00" && expr === "") {
            empty += 1;
          }
        });

        if (count === empty) return <div />;
      }

      return <div className="data-row">{props.children}</div>;
    },
    [isEmptyRowsHide]
  );

  const handleCellRenderer = useCallback(
    props => (
      <div
        onMouseDown={props.onMouseDown}
        onMouseOver={props.onMouseOver}
        onDoubleClick={props.onDoubleClick}
        className={props.className}
      >
        {props.children}
      </div>
    ),
    []
  );

  const handleSelect = useCallback(
    ({ start: originStart, end: originEnd }) => {
      const start = { row: originStart.i, col: originStart.j };
      const end = { row: originEnd.i, col: originEnd.j };
      let sumOfCells = 0;
      let count = 0;

      const addCellsToSum = (row, col) => {
        sumOfCells += +grid[row][col].value;
        count++;
      };

      if (start.row <= end.row && start.col === end.col) {
        for (let row = start.row; row <= end.row; row++) {
          addCellsToSum(row, start.col);
        }
      }

      if (start.row > end.row && start.col === end.col) {
        for (let row = start.row; row >= end.row; row--) {
          addCellsToSum(row, start.col);
        }
      }

      if (start.col < end.col && start.row === end.row) {
        for (let col = start.col; col <= end.col; col++) {
          addCellsToSum(start.row, col);
        }
      }

      if (start.col > end.col && start.row === end.row) {
        for (let col = start.col; col >= end.col; col--) {
          addCellsToSum(start.row, col);
        }
      }

      const diffSelected = {
        rows: Math.max(start.row, end.row) - Math.min(start.row, end.row) + 1,
        cols: Math.max(start.col, end.col) - Math.min(start.col, end.col) + 1
      };

      setSelectedDiff(diffSelected);

      setMiddleOfSum(
        isNaN(sumOfCells / count)
          ? "Wrong data"
          : numberToFormat(sumOfCells / count)
      );
    },
    [grid]
  );

  const handleDataRenderer = useCallback(cell => cell.expr, []);
  const handleValueRenderer = useCallback(
    cell =>
      isNaN(parseFloat(cell.value)) ? cell.value : numberToFormat(cell.value),
    []
  );

  const isMultiPasteWithOneParametr = arr =>
    arr[0].length === 1 &&
    !arr[1] &&
    (selectedDiff.rows !== 1 || selectedDiff.cols !== 1);

  const handleParsePaste = useCallback(
    str => {
      const arr = str.split(/\r\n|\n|\r/).map(row => row.split("\t"));

      if (!isMultiPasteWithOneParametr(arr)) {
        return arr;
      }

      return Array(selectedDiff.rows).fill(Array(selectedDiff.cols).fill(str));
    },
    [selectedDiff]
  );

  if (!data) return;

  return (
    <DataSheet
      data={grid}
      className="custom-sheet"
      sheetRenderer={handleSheetRenderer}
      rowRenderer={handleRowRenderer}
      cellRenderer={handleCellRenderer}
      onCellsChanged={handleCellsChanged}
      dataRenderer={handleDataRenderer}
      valueRenderer={handleValueRenderer}
      onSelect={handleSelect}
      // parsePaste={handleParsePaste}
    />
  );
};
