import React, { useState, useEffect } from "react";
import ProjectTable from "./ProjectTable";

const ProjectsTable = ({ showTable }) => {
  const [projectsData, setProjectsData] = useState([]);
  console.log(projectsData);

  useEffect(() => {
    fetchProjects();
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

  if (!showTable) {
    return null;
  }

  return <ProjectTable projectsData={projectsData} />;
};

export default ProjectsTable;
