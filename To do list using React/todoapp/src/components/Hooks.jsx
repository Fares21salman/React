import React, { useState, useEffect, useReducer } from "react";
import SinglePost from "./SinglePost";
import styles from "./hooks.module.css";

const Hooks = () => {
  const [counts, setCounts] = useState(0);
  const initialState = { count: 0 };

  const reducer = (state, action) => {
    console.log(action);
    switch (action.type) {
      case "increase":
        return { count: state.count + 1 };

      case "decrease":
        return { count: state.count - 1 };

      default:
        return state;
    }
  };

  //useEffect with dependencies
  useEffect(() => {
    document.title = `${counts} new messages`;
    console.log("Run useEffect:", counts);
    return () => {
      console.log("Clean up", counts);
    };
    // the [counts] is the dependencies used inside the functions where we use variables in an array
  }, [counts]);

  const [state, dispatch] = useReducer(reducer, initialState);

  //increase and decrease counter did for useEffect and useReducer
  function increaseCounter() {
    dispatch({ type: "increase" });
  }
  function decreaseCounter() {
    dispatch({ type: "decrease" });
  }

  return (
    // the styles is the css where we use that like a module stylesheet
    <div className={styles.counter}>
      <h1>Counter: {state.count}</h1>
      <button className={styles.comparison1} onClick={increaseCounter}>
        Increment
      </button>
      <button className={styles.comparison2} onClick={decreaseCounter}>
        Decrement
      </button>
      <hr />
      <div>
        <h2>This is for #UseContext</h2>
        {/* This is the React JSX element inside the JSX*/}
        <SinglePost />
      </div>
    </div>
  );
};

export default Hooks;
