import React from "react";
import styles from "./CreateEditProjectSection.module.css";

const CreateEditProjectSection = ({ showTable, setShowTable }) => {
  console.log("clicked");
  console.log("Props in CreateEditProjectSection:", {
    showTable,
    setShowTable,
  });
  console.log("showTable prop:", showTable);
  const toggleTable = () => {
    console.log("Toggling table visibility");
    setShowTable((prevShowTable) => !prevShowTable);
  };

  return (
    <div
      id="settingsControl"
      className={`ps-2 pt-0 ${styles.createEditProjectSection}`}
      style={{
        width: "20%",
        float: "right",
        height: "30px",
      }}
    >
      {showTable && (
        <div className={styles.bg}>
          <p onClick={toggleTable}>Create and Edit Project</p>
        </div>
      )}
    </div>
  );
};

export default CreateEditProjectSection;
