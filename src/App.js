import React, { useState, useEffect } from "react";
import Sidebar from "./components/SideBar";
import NavBar from "./components/NavBar";
import "./App.css";
import ProjectsTable from "./components/ProjectsTable";
import TestcasesDiv from "./components/TestcasesDiv";
import TestcasesTable from "./components/TestcasesTable";

const App = () => {
  const [showTable, setShowTable] = useState(false);
  const [showsTable, setShowsTable] = useState(false);
  const [projectsData, setProjectsData] = useState([]);
  const [versionsData, setVersionsData] = useState([]);
  const [showDivTestcase, setShowDivTestcase] = useState(false);
  const [selectedProjectName, setSelectedProjectName] = useState("");
  const [selectedVersionName, setSelectedVersionName] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedVersionId, setSelectedVersionId] = useState("");

  useEffect(() => {
    fetchProjects();
    fetchVersions();
  }, []);

  async function fetchProjects() {
    try {
      const response = await fetch("http://localhost:3001/projects/get");
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data = await response.json();
      console.log("Fetched projects:", data);
      setProjectsData(data);
    } catch (error) {
      console.error("Error fetching projects:", error.message);
    }
  }

  async function fetchVersions() {
    try {
      const response = await fetch("http://localhost:3001/versions/get");
      if (!response.ok) {
        throw new Error("Failed to fetch versions");
      }
      const data = await response.json();
      console.log("Fetched versions:", data);
      setVersionsData(data);
    } catch (error) {
      console.error("Error fetching versions:", error.message);
    }
  }

  const handleVersionClick = () => {
    setShowsTable(!showsTable);
  };

  return (
    <div>
      {" "}
      <div className="row">
        <div className="col-lg-2" style={{ padding: "0px" }}>
          <Sidebar
            showDivTestcase={showDivTestcase}
            setshowDivTestcase={setShowDivTestcase}
          />
        </div>
        <div className="col-lg-10">
          <NavBar
            setShowTable={setShowTable}
            projectsData={projectsData}
            versionsData={versionsData}
            setSelectedProjectName={setSelectedProjectName}
            setSelectedVersionName={setSelectedVersionName}
            setSelectedProjectId={setSelectedProjectId}
            setSelectedVersionId={setSelectedVersionId}
            selectedProjectId={selectedProjectId}
            selectedVersionId={selectedVersionId}
          />
          <div>
            <ProjectsTable showTable={showTable} />{" "}
          </div>{" "}
          {showDivTestcase && (
            <TestcasesDiv
              projectName={selectedProjectName}
              versionName={selectedVersionName}
              onVersionClick={handleVersionClick}
            />
          )}{" "}
          {showsTable && (
            <TestcasesTable
              projectId={selectedProjectId}
              versionId={selectedVersionId}
            />
          )}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};

export default App;
