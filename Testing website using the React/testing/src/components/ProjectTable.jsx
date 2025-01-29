import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { Button } from "react-bootstrap";
import { IconButton } from "@mui/material";
import { AddCircle, Close } from "@mui/icons-material";
import Styles from "./projectTable.module.css";

const ProjectTable = ({ showTable, projectsData }) => {
  const [projectsDataState, setProjectsData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editFormData, setEditFormData] = useState({
    _id: "",
    serialNo: "",
    projectName: "",
    projectDescription: "",
    startDate: "",
    endDate: "",
  });
  const [editingProjectId, setEditingProjectId] = useState("");

  useEffect(() => {
    setProjectsData(projectsData);
  }, [projectsData]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:3001/projects/get");
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data = await response.json();
      setProjectsData(data);
    } catch (error) {
      console.error("Error fetching projects:", error.message);
    }
  };

  const handleEditFormChange = (event) => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;
    setEditFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: fieldValue,
    }));
  };

  const handleAddClick = () => {
    setEditingProjectId("");
    setEditFormData({
      _id: "",
      serialNo: "",
      projectName: "",
      projectDescription: "",
      startDate: "",
      endDate: "",
    });
    setShowForm(true);
  };

  const handleEditClick = (project) => {
    setEditingProjectId(project._id);
    setEditFormData({
      _id: project._id,
      serialNo: project.serialNo,
      projectName: project.projectName,
      projectDescription: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
    });
    setShowForm(true);
  };

  const handleEditFormSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const serialNo = formData.get("serialNo");
    const projectName = formData.get("projectName");
    const description = formData.get("projectDescription");
    const startDate = formData.get("startDate");
    const endDate = formData.get("endDate");

    if (!serialNo || !projectName || !description || !startDate || !endDate) {
      alert("Please fill in all fields");
      return;
    }

    try {
      if (!editingProjectId) {
        const response = await fetch("http://localhost:3001/addProject", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            serialNo,
            projectName,
            description,
            startDate,
            endDate,
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to add project");
        }
      } else {
        const response = await fetch(
          `http://localhost:3001/editProject/${editingProjectId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              _id: editingProjectId,
              serialNo,
              projectName,
              description,
              startDate,
              endDate,
            }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to update project");
        }
        setEditingProjectId("");
      }
      setEditFormData({
        _id: "",
        serialNo: "",
        projectName: "",
        projectDescription: "",
        startDate: "",
        endDate: "",
      });
      setShowForm(false);
      fetchProjects();
      event.target.reset();
    } catch (error) {
      console.error("Error handling form submission:", error.message);
      alert(`Error handling form submission: ${error.message}`);
    }
  };

  const handleDeleteClick = async (projectId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/deleteProject/${projectId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }
      const updatedProjectsData = projectsDataState.filter(
        (project) => project._id !== projectId
      );
      setProjectsData(updatedProjectsData);
    } catch (error) {
      console.error("Error deleting project:", error.message);
    }
  };

  const columns = [
    { name: "serialNo", label: "Serial No" },
    { name: "projectName", label: "Project Name" },
    { name: "description", label: "Description" },
    { name: "startDate", label: "Start Date" },
    { name: "endDate", label: "End Date" },
    {
      name: "actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const project = projectsDataState[tableMeta.rowIndex];
          return (
            <>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => handleEditClick(project)}
              >
                Edit
              </button>{" "}
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDeleteClick(project._id)}
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
      className="table-responsive table content mt-3 p-4"
      style={{
        fontSize: "20px",
        backgroundColor: "whitesmoke",
      }}
    >
      {showForm ? (
        <div>
          <IconButton onClick={handleToggleForm}>
            <Close
              style={{ fontSize: "30px", float: "right", color: "black" }}
            />
          </IconButton>
          <form onSubmit={handleEditFormSubmit}>
            <div className="mb-3">
              <label htmlFor="serialNo" className="form-label">
                Serial No:
              </label>
              <input
                type="number"
                className="form-control"
                id="serialNo"
                name="serialNo"
                value={editFormData.serialNo}
                onChange={handleEditFormChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="projectName" className="form-label">
                Project Name:
              </label>
              <input
                type="text"
                className="form-control"
                id="projectName"
                name="projectName"
                value={editFormData.projectName}
                onChange={handleEditFormChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="projectDescription" className="form-label">
                Description:
              </label>
              <textarea
                className="form-control"
                id="projectDescription"
                name="projectDescription"
                rows="3"
                value={editFormData.projectDescription}
                onChange={handleEditFormChange}
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="startDate" className="form-label">
                Start Date:
              </label>
              <input
                type="date"
                className="form-control"
                id="startDate"
                name="startDate"
                value={editFormData.startDate}
                onChange={handleEditFormChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="endDate" className="form-label">
                End Date:
              </label>
              <input
                type="date"
                className="form-control"
                id="endDate"
                name="endDate"
                value={editFormData.endDate}
                onChange={handleEditFormChange}
              />
            </div>
            <Button type="submit" className={Styles.btngrad}>
              Submit
            </Button>
          </form>
        </div>
      ) : (
        <div>
          <MUIDataTable
            title={"Project List"}
            data={projectsDataState}
            columns={columns}
            options={options}
          />
        </div>
      )}
    </div>
  );
};

export default ProjectTable;
