import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./uselayouteffect.module.css";

const UseLayoutEffect = () => {
  const [toggle, setToggle] = useState(false);
  const textRef = useRef();

  useLayoutEffect(() => {
    if (textRef.current != null) {
      const dimension = textRef.current.getBoundingClientRect();
      textRef.current.style.paddingTop = `${dimension.height}px`;
    }
  }, [toggle]);

  useEffect(() => {
    console.log("useEffect");
  }, [toggle]);

  return (
    <div className={styles.middle}>
      <button className={styles.font} onClick={() => setToggle(!toggle)}>
        Toggle
      </button>
      {toggle && <h3 ref={textRef}>Coding for useLayoutEffect</h3>}
    </div>
  );
};

export default UseLayoutEffect;
