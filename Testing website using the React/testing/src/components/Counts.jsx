import React, { useState } from "react";
import VersionTable from "./VersionTable";
import Styles from "./counts.module.css";

const Counts = ({ selectedProjectId }) => {
  console.log(selectedProjectId);
  const [showVersionTable, setShowVersionTable] = useState(false);

  const toggleVersionTable = () => {
    setShowVersionTable(!showVersionTable);
  };

  return (
    <div className="testcase-summary" style={{ marginTop: "45px" }}>
      <div className="row mt-4">
        <div className={`col-2 ${Styles.col1}`}>
          <div
            className="box white-box"
            style={{
              color: "white",
              height: "80px",
              textAlign: "center",
              fontSize: "18px",
              cursor: "pointer",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p>No of Testcases:</p>
          </div>
        </div>
        <div className={`col-2 ${Styles.col2}`}>
          <div
            className="box green-box"
            style={{
              color: "white",
              height: "80px",
              textAlign: "center",
              fontSize: "18px",
              cursor: "pointer",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p>No of Passed Testcases:</p>
          </div>
        </div>
        <div className={`col-2 ${Styles.col2}`}>
          <div
            className="box red-box"
            style={{
              color: "white",
              height: "80px",
              textAlign: "center",
              fontSize: "18px",
              cursor: "pointer",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p>No of Failed Testcases:</p>
          </div>
        </div>
        <div className={`col-2 ${Styles.col2}`}>
          <div
            className="box grey-box"
            style={{
              color: "white",
              height: "80px",
              textAlign: "center",
              fontSize: "18px",
              cursor: "pointer",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p>Not Executed:</p>
          </div>
        </div>
        <div className={`col-2 ${Styles.col2}`}>
          <div
            className="box manage-versions"
            onClick={toggleVersionTable}
            style={{
              color: "white",
              height: "80px",
              textAlign: "center",
              fontSize: "18px",
              cursor: "pointer",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p>Manage Versions</p>
          </div>
        </div>
      </div>
      {showVersionTable && <VersionTable projectId={selectedProjectId} />}
    </div>
  );
};

export default Counts;
