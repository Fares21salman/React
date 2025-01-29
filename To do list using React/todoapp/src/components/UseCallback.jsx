import React, { useCallback, useState } from "react";
import PrintTable from "./PrintTable";
import styles from "./useCallback.module.css";

const UseCallback = () => {
  const [number, setNumber] = useState(1);
  const [darkTheme, setDarkTheme] = useState(false);

  const calculateTable = useCallback(() => {
    return [number * 1, number * 2, number * 3, number * 4, number * 5];
  }, [number]);

  const cssStyle = {
    backgroundColor: darkTheme ? "black" : "white",
    color: darkTheme ? "white" : "black",
  };

  return (
    <div style={cssStyle} className={styles.theme}>
      <input
        type="number"
        onChange={(e) => setNumber(e.target.valueAsNumber)}
        value={number}
      />
      <PrintTable calculateTable={calculateTable} />
      <button
        className={styles.buttonTheme}
        onClick={() => setDarkTheme(!darkTheme)}
      >
        Change Theme
      </button>
    </div>
  );
};

export default UseCallback;
