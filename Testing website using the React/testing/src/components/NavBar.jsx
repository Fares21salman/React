import React, { useState, useEffect } from "react";
import CreateEditProjectSection from "./CreateEditProjectSection";
import Counts from "./Counts";
import Styles from "./navbar.module.css";

const NavBar = ({
  projectsData,
  versionsData,
  setShowTable,
  setSelectedProjectName,
  setSelectedVersionName,
  setSelectedProjectId,
  setSelectedVersionId,
  selectedProjectId,
  selectedVersionId,
}) => {
  const [projectNames, setProjectNames] = useState([]);
  const [versionNames, setVersionNames] = useState([]);
  const [filteredVersions, setFilteredVersions] = useState([]);
  const [showProjectSection, setShowProjectSection] = useState(false);

  const toggleProjectSection = () => {
    setShowProjectSection(!showProjectSection);
  };

  useEffect(() => {
    if (projectsData && projectsData.length > 0) {
      const names = projectsData.map((projectData) => projectData.projectName);
      setProjectNames(names);
      console.log(setProjectNames);
      console.log(names);
      setSelectedProjectId(projectsData[0]._id);
      console.log(projectsData[0]._id);
      setSelectedProjectName(projectsData[0].projectName);
      console.log(projectsData[0].projectName);
    }
  }, [projectsData, setSelectedProjectId, setSelectedProjectName]);

  useEffect(() => {
    if (versionsData && versionsData.length > 0 && selectedProjectId) {
      const selectedProjectVersions = versionsData.filter(
        (versionData) => versionData.projectId === selectedProjectId
      );
      const versionNames = selectedProjectVersions.map((versionData) => ({
        versionId: versionData._id,
        versionName: versionData.versionName,
      }));
      setVersionNames(versionNames);
      setFilteredVersions(selectedProjectVersions);

      if (versionNames.length > 0) {
        setSelectedVersionName(versionNames[0].versionName);
        setSelectedVersionId(versionNames[0].versionId);
      } else {
        setSelectedVersionName("");
        setSelectedVersionId("");
      }
    } else {
      setVersionNames([]);
      setSelectedVersionName("");
      setSelectedVersionId("");
      setFilteredVersions([]);
    }
  }, [
    versionsData,
    selectedProjectId,
    setSelectedVersionName,
    setSelectedVersionId,
  ]);

  const handleProjectChange = (event) => {
    const projectId = event.target.value;
    console.log(projectId);
    setSelectedProjectId(projectId);
    const selectedProject = projectsData.find(
      (project) => project._id === projectId
    );
    console.log(selectedProject);
    setSelectedProjectName(selectedProject.projectName);
    console.log(selectedProject.projectName);
  };

  const handleVersionChange = (event) => {
    const versionId = event.target.value;
    console.log(versionId);
    setSelectedVersionId(versionId);
    const versionName = event.target.options[event.target.selectedIndex].text;
    setSelectedVersionName(versionName);
    console.log(versionName);
  };

  return (
    <div className={Styles.appContainer}>
      <div>
        <header className={Styles.header}>
          <div className={Styles.container}>
            <div className={Styles.nav}>
              <a
                href="#"
                className={Styles.navLink}
                style={{ marginRight: 20 }}
              >
                <label
                  htmlFor="projects"
                  style={{ color: "white", marginRight: 5, fontSize: "20px" }}
                >
                  Project:
                </label>
                <select
                  name="projects"
                  id="projects"
                  onChange={handleProjectChange}
                  value={selectedProjectId}
                >
                  {projectNames.map((projectName, index) => (
                    <option key={index} value={projectsData[index]._id}>
                      {projectName}
                    </option>
                  ))}
                </select>
              </a>
              <a href="#" className={Styles.navLink}>
                <label
                  htmlFor="versions"
                  style={{ color: "white", marginRight: 5, fontSize: "20px" }}
                >
                  Version:
                </label>
                <select
                  name="versions"
                  id="versions"
                  onChange={handleVersionChange}
                  value={selectedVersionId}
                >
                  {versionNames.map((version, index) => (
                    <option key={index} value={version.versionId}>
                      {version.versionName}
                    </option>
                  ))}
                </select>
              </a>
              <i
                onClick={toggleProjectSection}
                className={`fas fa-cog`}
                style={{ float: "right", cursor: "pointer" }}
              ></i>
            </div>
          </div>
        </header>
      </div>
      <div>
        {showProjectSection && (
          <CreateEditProjectSection
            showTable={showProjectSection}
            setShowTable={setShowTable}
          />
        )}
      </div>
      <div>
        <Counts selectedProjectId={selectedProjectId} />
      </div>
    </div>
  );
};

export default NavBar;
