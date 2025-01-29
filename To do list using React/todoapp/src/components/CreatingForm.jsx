import React, { useState } from "react";
import styles from "./creatingform.module.css";

const CreatingForm = () => {
  let [name, setName] = useState("");
  let [age, setAge] = useState(0);
  let [email, setEmail] = useState("");

  function formSubmit(e) {
    e.preventDefault();
    console.log("Form submitted!");
    console.log({ name, age, email });
    console.log("Form element:", e.target);
    setName((name = ""));
    setAge((age = ""));
    setEmail((email = ""));
  }

  return (
    <div className={styles.form}>
      <form onSubmit={formSubmit} action="newForm">
        <h4 className={styles.input}>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </h4>
        <h4 className={styles.input}>
          Age:
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value))}
          />
        </h4>
        <h4 className={styles.input}>
          Email:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </h4>
        <button>Submit</button>
      </form>
    </div>
  );
};

export default CreatingForm;
