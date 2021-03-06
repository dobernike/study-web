import React, { useState, useMemo, useCallback, useEffect } from "react";

import TableSmall from "./SmallTable";
import { table9 } from "../../mockData";

export default () => {
  const [result9, setResult9] = useState(table9.result.table);
  const [result10, setResult10] = useState(table9.result.table);
  const [result11, setResult11] = useState(table9.result.table);
  const [generalTop, setGeneralTop] = useState(table9.generalTop);
  const [generalBottom, setGeneralBottom] = useState(table9.generalBottom);
  const [head, setHead] = useState(table9.head);

  const table91 = useMemo(() => table9.table1.table, [table9]);

  const tables = useMemo(
    () => ({
      table1: [0, 0, 0, 0],
      table2: [0, 0, 0, 0],
      table3: [0, 0, 0, 0],
      table4: [0, 0, 0, 0],
      table5: [0, 0, 0, 0],
      table6: [0, 0, 0, 0],
      table7: [0, 0, 0, 0]
    }),
    []
  );

  const results = useMemo(
    () => ({
      result1: [0, 0, 0, 0],
      result2: [0, 0, 0, 0],
      result3: [0, 0, 0, 0]
    }),
    []
  );

  const generals = useMemo(
    () => ({
      generalTop: [0, 0, 0, 0],
      generalBottom: [0, 0, 0, 0]
    }),
    []
  );

  const handleGeneralTopUpdate = () => {
    generals["generalTop"] = [];
    const updatedResult = Object.fromEntries(
      Object.entries(generalTop).map(([key, cell], idx) => {
        if (idx !== 0) {
          cell.value =
            +results["result1"][idx] +
            +results["result2"][idx] +
            +results["result3"][idx];
        }
        generals["generalTop"].push(cell.value);

        return [key, cell];
      })
    );
    setGeneralTop(updatedResult);
  };

  useEffect(() => handleGeneralTopUpdate(), [result9, result10, result11]);

  const handleGeneralBottomUpdate = () => {
    generals["generalBottom"] = [];

    const updatedResult = Object.fromEntries(
      Object.entries(generalBottom).map(([key, cell], idx) => {
        if (idx !== 0) {
          if (idx !== 1) {
            cell.value =
              +generals["generalBottom"][idx - 1] +
              +generals["generalTop"][idx];
          } else {
            cell.value = +head.A1.value + +generals["generalTop"][idx];
          }
        }

        generals["generalBottom"].push(cell.value);

        return [key, cell];
      })
    );

    setGeneralBottom(updatedResult);
  };

  useEffect(() => handleGeneralBottomUpdate(), [generalTop]);

  const heads = useMemo(
    () => ({
      head: [0, 0, 0, 0, 0, 0, 0, 0]
    }),
    []
  );

  const handleUpdateHead = () => {
    heads["head"] = [];

    const updatedResult = Object.fromEntries(
      Object.entries(head).map(([key, cell], idx) => {
        if (idx > 5) {
          cell.value = +generals["generalBottom"][idx - 5];
        }

        heads["head"].push(cell.value);

        return [key, cell];
      })
    );

    setHead(updatedResult);
  };

  useEffect(() => handleUpdateHead, [generalBottom]);

  const handleUpdate9 = useCallback(
    (updated, name) => {
      tables[name] = updated;
      results["result1"] = [];

      const updatedResult = Object.fromEntries(
        Object.entries(result9).map(([key, cell], idx) => {
          if (idx !== 0) {
            cell.value =
              +tables["table1"][idx] +
              +tables["table2"][idx] -
              +tables["table3"][idx];
          }

          results["result1"].push(cell.value);

          return [key, cell];
        })
      );

      setResult9(updatedResult);
    },
    [result9]
  );

  const cols = useMemo(
    () => [...new Set(Object.values(table91).map(cell => cell.key.charAt(0)))],
    []
  );

  const rows = useMemo(
    () => [...new Set(Object.values(table91).map(cell => cell.key.slice(1)))],
    []
  );

  const grid = useMemo(
    () => rows.map(row => cols.map(col => ({ ...table91[col + row] }))),
    []
  );

  return (
    <article
      style={{
        padding: "0 5%",
        backgroundColor: "#F8F8F8",
        paddingTop: "1rem"
      }}
    >
      <hr />
      <br />
      <hr />

      <TableSmall data={grid} onUpdate={handleUpdate9} name={"table1"} />
    </article>
  );
};
