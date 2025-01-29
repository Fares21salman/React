import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { IconButton } from "@mui/material";
import { AddCircle, Close } from "@mui/icons-material";
import Styles from "./versionsTable.module.css";

const VersionTable = ({ projectId }) => {
  const [versionsDataState, setVersionsDataState] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editFormData, setEditFormData] = useState({
    _id: "",
    versionSerialNo: "",
    versionName: "",
    versionDescription: "",
    versionStartDate: "",
    versionEndDate: "",
  });

  useEffect(() => {
    if (projectId) {
      fetchVersions(projectId);
    }
  }, [projectId]);

  const fetchVersions = async (projectId) => {
    try {
      const response = await fetch(`http://localhost:3001/versions/get`);
      if (!response.ok) {
        throw new Error("Failed to fetch versions");
      }
      const data = await response.json();
      const filteredData = data.filter(
        (version) => version.projectId === projectId
      );
      setVersionsDataState(filteredData);
      console.log(filteredData);
      console.log(data);
    } catch (error) {
      console.error("Error fetching versions:", error.message);
    }
  };

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleAddClick = () => {
    setEditingVersionId("");
    setEditFormData({
      _id: "",
      versionSerialNo: "",
      versionName: "",
      versionDescription: "",
      versionStartDate: "",
      versionEndDate: "",
    });
    setShowForm(true);
  };

  const [editingVersionId, setEditingVersionId] = useState("");

  const handleVersionEdit = (version) => {
    setEditingVersionId(version._id);
    setEditFormData({
      _id: version._id,
      versionSerialNo: version.serialNo,
      versionName: version.versionName,
      versionDescription: version.description,
      versionStartDate: version.startDate,
      versionEndDate: version.endDate,
    });
    setShowForm(true); // Show the form with the existing data
  };

  const handleVersionFormSubmit = async (event) => {
    event.preventDefault();
    const {
      versionSerialNo,
      versionName,
      versionDescription,
      versionStartDate,
      versionEndDate,
    } = editFormData;

    if (
      !versionSerialNo ||
      !versionName ||
      !versionDescription ||
      !versionStartDate ||
      !versionEndDate
    ) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/${
          editingVersionId
            ? `editVersion/${editingVersionId}`
            : `addversions/${projectId}`
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            versionSerialNo,
            versionName,
            versionDescription,
            versionStartDate,
            versionEndDate,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          editingVersionId
            ? "Failed to update version"
            : "Failed to add version"
        );
      }

      setEditingVersionId("");
      setEditFormData({
        _id: "",
        versionSerialNo: "",
        versionName: "",
        versionDescription: "",
        versionStartDate: "",
        versionEndDate: "",
      });
      setShowForm(false);
      fetchVersions(projectId);
    } catch (error) {
      console.error("Error handling form submission:", error.message);
      alert(`Error handling form submission: ${error.message}`);
    }
  };

  const handleVersionDelete = async (versionId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/deleteVersion/${versionId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete version");
      }

      // Refresh versions data after deletion
      fetchVersions(projectId);
      console.log("Version deleted successfully!");
    } catch (error) {
      console.error("Error deleting version:", error.message);
    }
  };

  const columns = [
    { name: "serialNo", label: "Serial No" },
    { name: "versionName", label: "Version Name" },
    { name: "description", label: "Description" },
    { name: "startDate", label: "Start Date" },
    { name: "endDate", label: "End Date" },
    {
      name: "actions",
      label: "Actions",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          const versionId = versionsDataState[tableMeta.rowIndex]._id;
          return (
            <>
              <button
                className="btn btn-sm btn-primary me-1"
                onClick={() =>
                  handleVersionEdit(versionsDataState[tableMeta.rowIndex])
                }
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleVersionDelete(versionId)}
              >
                Delete
              </button>
            </>
          );
        },
      },
    },
  ];

  const options = {
    filterType: "checkbox",
    responsive: "standard",
    selectableRows: "none",
    customToolbar: () => (
      <IconButton onClick={handleAddClick}>
        <AddCircle />
      </IconButton>
    ),
  };

  const handleToggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div
      className="table-responsive table content mt-5 p-2"
      style={{ backgroundColor: "whitesmoke" }}
    >
      {showForm ? (
        <div className="ps-2">
          <IconButton onClick={handleToggleForm}>
            <Close
              style={{ fontSize: "32px", float: "right", color: "black" }}
            />
          </IconButton>
          <div style={{ backgroundColor: "white" }}>
            <form onSubmit={handleVersionFormSubmit}>
              <div className="mb-3">
                <label htmlFor="versionSerialNo" className="form-label">
                  Serial No:
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="versionSerialNo"
                  name="versionSerialNo"
                  value={editFormData.versionSerialNo}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="versionName" className="form-label">
                  Version Name:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="versionName"
                  name="versionName"
                  value={editFormData.versionName}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="versionDescription" className="form-label">
                  Description:
                </label>
                <textarea
                  className="form-control"
                  id="versionDescription"
                  name="versionDescription"
                  rows="3"
                  value={editFormData.versionDescription}
                  onChange={handleEditFormChange}
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="versionStartDate" className="form-label">
                  Start Date:
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="versionStartDate"
                  name="versionStartDate"
                  value={editFormData.versionStartDate}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="versionEndDate" className="form-label">
                  End Date:
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="versionEndDate"
                  name="versionEndDate"
                  value={editFormData.versionEndDate}
                  onChange={handleEditFormChange}
                />
              </div>
              <button type="submit" className={Styles.btngrad}>
                Submit
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: "10px" }}>
          <MUIDataTable
            title={"Version List"}
            data={versionsDataState} // Use versionsDataState here
            columns={columns}
            options={options}
          />
        </div>
      )}
    </div>
  );
};

export default VersionTable;
