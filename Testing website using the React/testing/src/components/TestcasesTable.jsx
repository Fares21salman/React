import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { IconButton } from "@mui/material";
import { AddCircle, Close, Edit } from "@mui/icons-material";
import Styles from "./versionsTable.module.css";

const TestcasesTable = ({ projectId, versionId }) => {
  const [testcases, setTestcases] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTestcase, setSelectedTestcase] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formEnabled, setFormEnabled] = useState(false);

  const [newTestcase, setNewTestcase] = useState({
    title: "",
    input1: "",
    input2: "",
    input3: "",
    input4: "",
    input5: "",
    input6: "",
    input7: "",
    input8: "",
  });

  const fetchTestcases = async () => {
    try {
      const response = await fetch(`http://localhost:3001/testcases/get`);

      if (!response.ok) {
        throw new Error("Failed to fetch test cases");
      }

      const testcasesData = await response.json();
      console.log("Fetched testcases:", testcasesData);

      const filteredTestcases = testcasesData.filter(
        (testcase) =>
          testcase.projectId === projectId && testcase.versionId === versionId
      );

      console.log("Filtered testcases:", filteredTestcases);

      setTestcases(filteredTestcases);
    } catch (error) {
      console.error("Error fetching test cases:", error.message);
    }
  };

  useEffect(() => {
    fetchTestcases();
  }, [projectId, versionId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTestcase((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const testcaseToSubmit = {
      ...newTestcase,
      projectId,
      versionId,
    };

    try {
      if (isEditing) {
        const response = await fetch(
          `http://localhost:3001/testcases/editingTestcase/${selectedTestcase._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(testcaseToSubmit),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update test case");
        }

        const updatedTestcase = await response.json();
        console.log("Test case updated:", updatedTestcase);

        setTestcases((prevTestcases) =>
          prevTestcases.map((testcase) =>
            testcase._id === updatedTestcase._id ? updatedTestcase : testcase
          )
        );
      } else {
        const response = await fetch(
          `http://localhost:3001/testcases/${projectId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(testcaseToSubmit),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create test case");
        }

        const createdTestcase = await response.json();
        console.log("New test case created:", createdTestcase);

        setTestcases((prevTestcases) => [...prevTestcases, createdTestcase]);
      }
      setShowForm(false);
      setFormEnabled(false);
      setNewTestcase({
        title: "",
        input1: "",
        input2: "",
        input3: "",
        input4: "",
        input5: "",
        input6: "",
        input7: "",
        input8: "",
      });
      fetchTestcases();
    } catch (error) {
      console.error("Error submitting test case:", error.message);
    }
  };

  const handleAddButtonClick = () => {
    setShowForm(true);
    setSelectedTestcase(null);
    setIsEditing(false);
    setFormEnabled(true);
    setNewTestcase({
      title: "",
      input1: "",
      input2: "",
      input3: "",
      input4: "",
      input5: "",
      input6: "",
      input7: "",
      input8: "",
    });
  };

  const handleRowClick = (testcase) => {
    setSelectedTestcase(testcase);
    setNewTestcase(testcase);
    setShowForm(true);
    setIsEditing(true);
    setFormEnabled(false);
  };

  const handleEditClick = () => {
    setFormEnabled(true);
  };

  // const handleVersionClick = () => {
  //   fetchTestcases();
  // };

  const columns = [
    { name: "title", label: "Title" },
    { name: "input2", label: "TC Id" },
    { name: "input3", label: "Priority" },
    { name: "input4", label: "Type" },
    { name: "input5", label: "TestCases Type" },
    { name: "input7", label: "Test Grade" },
  ];

  const options = {
    filterType: "checkbox",
    responsive: "standard",
    selectableRows: "none",
    customToolbar: () => (
      <IconButton onClick={handleAddButtonClick}>
        <AddCircle />
      </IconButton>
    ),
    onRowClick: (rowData, rowMeta) => {
      const clickedTestcase = testcases[rowMeta.dataIndex];
      handleRowClick(clickedTestcase);
    },
  };

  const handleToggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div
      style={{
        marginLeft: "10px",
        marginTop: "20px",
      }}
    >
      {showForm ? (
        <div
          style={{
            padding: "10px",
            marginBottom: "20px",
            backgroundColor: "whitesmoke",
            borderRadius: "10px",
          }}
        >
          <div style={{ backgroundColor: "white" }}>
            <form onSubmit={handleFormSubmit}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                }}
              >
                <IconButton onClick={handleToggleForm}>
                  <Close
                    style={{ fontSize: "20px", float: "right", color: "black" }}
                  />
                </IconButton>
                {isEditing && (
                  <IconButton onClick={handleEditClick}>
                    <Edit
                      style={{
                        fontSize: "20px",
                        float: "right",
                        color: "black",
                      }}
                    />
                  </IconButton>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Title:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={newTestcase.title}
                  onChange={handleInputChange}
                  required
                  disabled={!formEnabled}
                />
              </div>
              <div className="row mb-3">
                <div className="col">
                  <label htmlFor="input1" className="form-label">
                    tc:36c
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="input1"
                    name="input1"
                    value={newTestcase.input1}
                    onChange={handleInputChange}
                    required
                    disabled
                  />
                </div>
                <div className="col">
                  <label htmlFor="input2" className="form-label">
                    TC ID:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="input2"
                    name="input2"
                    value={newTestcase.input2}
                    onChange={handleInputChange}
                    required
                    disabled={!formEnabled}
                  />
                </div>
                <div className="col">
                  <label htmlFor="input3" className="form-label">
                    Priority:
                  </label>
                  <select
                    className="form-select pb-2"
                    id="input3"
                    name="input3"
                    value={newTestcase.input3}
                    onChange={handleInputChange}
                    required
                    disabled={!formEnabled}
                  >
                    <option value="selectgrade">Select Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col">
                  <label htmlFor="input4" className="form-label">
                    Type:
                  </label>
                  <select
                    className="form-select"
                    id="input4"
                    name="input4"
                    value={newTestcase.input4}
                    onChange={handleInputChange}
                    required
                    disabled={!formEnabled}
                  >
                    <option value="selectgrade">Select Type</option>
                    <option value="automated">Automated</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>
                <div className="col">
                  <label htmlFor="input5" className="form-label">
                    TestCases Type:
                  </label>
                  <select
                    className="form-select"
                    id="input5"
                    name="input5"
                    value={newTestcase.input5}
                    onChange={handleInputChange}
                    required
                    disabled={!formEnabled}
                  >
                    <option value="selectgrade">Select Testcase Type</option>
                    <option value="teststeps">Test Steps</option>
                    <option value="testtext">Test Text</option>
                  </select>
                </div>
                <div className="col">
                  <label htmlFor="input6" className="form-label">
                    admin:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="input6"
                    name="input6"
                    value={newTestcase.input6}
                    onChange={handleInputChange}
                    required
                    disabled
                  />
                </div>
              </div>
              <div className="mt-5">
                <label htmlFor="input7" className="form-label">
                  Test Grade:
                </label>
                <select
                  className="form-select"
                  id="input7"
                  name="input7"
                  value={newTestcase.input7}
                  onChange={handleInputChange}
                  required
                  disabled={!formEnabled}
                >
                  <option value="selectgrade">Select Grade</option>
                  <option value="Pass">Pass</option>
                  <option value="Fail">Fail</option>
                  <option value="NE">NE</option>
                </select>
              </div>
              <div className="mt-5">
                <label htmlFor="input8" className="form-label">
                  Description:
                </label>
                <textarea
                  className="form-control"
                  id="input8"
                  name="input8"
                  rows="3"
                  value={newTestcase.input8}
                  onChange={handleInputChange}
                  disabled={!formEnabled}
                ></textarea>
              </div>
              <button
                type="submit"
                className={Styles.btngrad}
                disabled={!formEnabled}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div>
          <MUIDataTable
            title={"Test Cases"}
            data={testcases}
            columns={columns}
            options={options}
          />
        </div>
      )}
    </div>
  );
};

export default TestcasesTable;
