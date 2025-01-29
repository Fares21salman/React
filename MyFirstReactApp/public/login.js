document.addEventListener("DOMContentLoaded", async function () {
  const projectSelect = document.getElementById("projects");
  const versionSelect = document.getElementById("versions");
  const settingsButton = document.getElementById("settingsButton");
  const settingsControl = document.getElementById("settingsControl");
  const createProject = document.getElementById("createProject");
  const createProjectContent = document.getElementById("createProjectContent");
  const createVersion = document.getElementById("createVersion");
  const manageVersions = document.getElementById("manageVersions");
  const manageVersionsTable = document.getElementById("manageVersionsTable");
  const testcases = document.getElementById("testcases");
  const testcasesTable = document.getElementById("testcasesTable");
  const totalTestcasesBox = document.getElementById("totalTestcasesBox");
  const testcaseCreationSymbol = document.getElementById(
    "testcaseCreationSymbol"
  );
  const testcaseCreationForm = document.getElementById("testcaseCreationForm");
  const selectedContent = document.getElementById("selectedContent");
  const repository = document.getElementById("repository");
  const New = document.getElementById("New");

  const graph = document
    .getElementById("graph")
    .addEventListener("click", function () {
      console.log("clicked");
      document.getElementById("testcasesChart").classList.remove("hidden");
      document.getElementById("selectedContent").style.display = "none";
      document.getElementById("settingsControl").style.display = "none";
      document.getElementById("testcasesTable").style.display = "none";
      displaySection(graph);
    });

  document.getElementById("New").addEventListener("click", function () {
    console.log("clicked the dashboard");
    document.getElementById("dashboard").style.display = "block";
    document.getElementById("selectedContent").style.display = "none";
    document.getElementById("settingsControl").style.display = "none";
    document.getElementById("testcasesChart").classList.add("hidden");
    document.getElementById("testcasesTable").style.display = "none";
    document.getElementById("tcShowingForm").style.display = "none";
    document.getElementById("testcaseCreationForm").style.display = "none";
    displaySection(New);
  });

  repository.addEventListener("click", function () {
    selectedContent.style.display = "block";
    document.getElementById("testcasesChart").classList.add("hidden");
    document.getElementById("settingsControl").style.display = "none";
    // document.getElementById("testcasesTable").style.display = "block";
    displaySection(selectedContent);
  });

  settingsButton.addEventListener("click", function () {
    settingsControl.style.display = "block";
    document.getElementById("selectedContent").style.display = "none";
  });

  createProject.addEventListener("click", function () {
    document.getElementById("selectedContent").style.display = "none";
    displaySection(createProjectContent);
  });

  testcaseCreationSymbol.addEventListener("click", function () {
    document.getElementById("testcasesTable").style.display = "none";
    document.getElementById("selectedContent").style.display = "none";
    displaySection(testcaseCreationForm);
  });

  function displaySection(section) {
    const sections = [
      createProjectContent,
      manageVersionsTable,
      testcaseCreationForm,
    ];
    sections.forEach((sec) => {
      if (sec === section) {
        sec.style.display = "block";
      } else {
        sec.style.display = "none";
      }
    });
  }

  let projectsData = [];
  let versionsData = [];

  await fetchProjects();
  await fetchVersions();
  await fetchTestcases();

  async function fetchProjects() {
    try {
      const response = await fetch("http://localhost:5001/projects/get");
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      projectsData = await response.json();
      console.log(projectsData);
      populateProjectsTable(projectsData);
      populateDropdown(projectSelect, projectsData, "_id", "projectName");
    } catch (error) {
      console.error("Error fetching projects:", error.message);
    }
  }

  function populateDropdown(selectElement, data, valueField, textField) {
    selectElement.innerHTML = "";
    data.forEach((item) => {
      const option = document.createElement("option");
      option.value = item[valueField];
      option.textContent = item[textField];
      selectElement.appendChild(option);
    });
  }

  function populateProjectsTable(projectsData) {
    const tableBody = document
      .getElementById("projectsTable")
      .getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";
    console.log("tableBody:", tableBody);
    console.log("projectsData:", projectsData);
    projectsData.forEach((project) => {
      addRowToTable(tableBody, project);
    });
  }

  function addRowToTable(tableBody, data) {
    const newRow = tableBody.insertRow();
    newRow.dataset.taskId = data._id;
    console.log(newRow.dataset.taskId);
    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    const cell4 = newRow.insertCell(3);
    const cell5 = newRow.insertCell(4);
    const cell6 = newRow.insertCell(5);

    cell1.textContent = data.serialNo;
    cell2.textContent = data.projectName;
    cell3.textContent = data.description;
    cell4.textContent = data.startDate;
    cell5.textContent = data.endDate;

    const editIcon = document.createElement("i");
    editIcon.classList.add("fas", "fa-edit");
    editIcon.style.color = "#39f33d";
    editIcon.onclick = function () {
      projectEdit(this);
    };

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fas", "fa-trash");
    deleteIcon.style.color = "red";
    deleteIcon.onclick = function () {
      deleteProject(this);
    };

    cell6.appendChild(editIcon);
    cell6.appendChild(deleteIcon);
  }

  async function deleteProject(icon) {
    const row = icon.closest("tr");
    console.log(row);
    const taskId = row.dataset.taskId;
    console.log("Task ID:", taskId);

    try {
      const response = await fetch(
        `http://localhost:5001/deleteProject/${taskId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      // Remove the row from the table
      row.parentNode.removeChild(row);
      fetchProjects();
      console.log("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error.message);
    }
  }

  let currentTaskID;

  function projectEdit(icon) {
    const row = icon.closest("tr");
    currentTaskID = row.dataset.taskId;
    console.log(currentTaskID);
    const serialNo = row.cells[0].textContent;
    console.log("Serial Number:", serialNo);
    const projectName = row.cells[1].textContent;
    const description = row.cells[2].textContent;
    const startDate = row.cells[3].textContent;
    const endDate = row.cells[4].textContent;

    document.getElementById("serialNo").value = serialNo;
    document.getElementById("projectName").value = projectName;
    document.getElementById("projectDescription").value = description;
    document.getElementById("startDate").value = startDate;
    document.getElementById("endDate").value = endDate;
  }

  document
    .getElementById("projectForm")
    .addEventListener("submit", async function (event) {
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
      console.log(currentTaskID);

      try {
        if (!currentTaskID) {
          // If taskId doesn't exist, add a new project
          const response = await addToDatabase("projects", {
            serialNo,
            projectName,
            description,
            startDate,
            endDate,
          });
          if (response.error) {
            throw new Error(response.error);
          }
          event.target.reset();
          populateProjectDropdown();
        } else {
          // If taskId exists, edit the project
          const response = await editProject(currentTaskID, {
            serialNo,
            projectName,
            description,
            startDate,
            endDate,
          });
          if (response.error) {
            throw new Error(response.error);
          }
          event.target.reset();
          currentTaskID = "";
          fetchProjects();
        }
      } catch (error) {
        console.error("Error handling form submission:", error.message);
        alert(`Error handling form submission: ${error.message}`);
      }
    });

  async function addToDatabase(database, data) {
    try {
      const response = await fetch(`http://localhost:5001/${database}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to add ${database}`);
      }
      const result = await response.json();
      if (database === "projects") {
        await fetchProjects();
      }
      return result;
    } catch (error) {
      console.error("Error adding" + database + ":" + error.message);
      throw error;
    }
  }

  async function editProject(taskId, projectData) {
    console.log("entering after checking the id");
    try {
      const response = await fetch(
        `http://localhost:5001/editProject/${taskId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(projectData),
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to edit project: ${response.statusText}`);
      }
      updateTableRow(taskId, projectData);
      return await response.json();
    } catch (error) {
      throw new Error(`Error editing project: ${error.message}`);
    }
  }

  function updateTableRow(taskId, projectData) {
    console.log("entering to update the name in the table");
    const rows = document.querySelectorAll("tr");
    let rowToUpdate = null;
    rows.forEach((row) => {
      if (row.dataset.taskId === taskId) {
        rowToUpdate = row;
        return;
      }
    });
    if (!rowToUpdate) {
      console.error(`Table row with task ID ${taskId} not found.`);
      return;
    }
    // Update the table cells with the new project data
    rowToUpdate.cells[0].textContent = projectData.serialNo;
    rowToUpdate.cells[1].textContent = projectData.projectName;
    rowToUpdate.cells[2].textContent = projectData.description;
    rowToUpdate.cells[3].textContent = projectData.startDate;
    rowToUpdate.cells[4].textContent = projectData.endDate;
  }

  async function fetchVersions() {
    try {
      const response = await fetch("http://localhost:5001/versions/get");
      if (!response.ok) {
        throw new Error("Failed to fetch versions");
      }
      versionsData = await response.json();
      console.log(versionsData);
      return versionsData;
    } catch (error) {
      console.error("Error fetching versions:", error.message);
    }
  }

  manageVersions.addEventListener("click", function () {
    const selectedProjectSerialNo = projectSelect.value;
    console.log(selectedProjectSerialNo);
    updateVersionsTable(selectedProjectSerialNo);
    manageVersionsTable.style.display = "block";
  });

  projectSelect.addEventListener("change", function () {
    const selectedProjectSerialNo = projectSelect.value;
    console.log(selectedProjectSerialNo);
    updateVersionsTable(selectedProjectSerialNo);
  });

  function updateVersionsTable(selectedProjectSerialNo) {
    console.log(selectedProjectSerialNo);
    if (!selectedProjectSerialNo || selectedProjectSerialNo === "") {
      manageVersions.style.display = "none";
    } else {
      const selectedProject = projectsData.find(
        (project) => project._id === selectedProjectSerialNo
      );
      console.log("Selected project serial number:", selectedProjectSerialNo);
      console.log("All projects:", projectsData);
      console.log(selectedProject);
      // Check if selectedProject is undefined
      if (!selectedProject) {
        console.error("Selected project not found");
        return;
      }
      const selectedProjectId = selectedProject._id;
      const selectedProjectVersions = versionsData.filter(
        (version) => version.projectId === selectedProjectId
      );
      const tableBody = document.querySelector("#mvTable tbody");
      tableBody.innerHTML = "";
      selectedProjectVersions.forEach((version) => {
        updateVersionTable(version);
      });
    }
  }

  function updateVersionTable(data) {
    console.log("coming to update the table");
    const tableBody = document.querySelector("#mvTable tbody");
    const newRow = tableBody.insertRow();

    newRow.dataset.taskId = data._id;

    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    const cell4 = newRow.insertCell(3);
    const cell5 = newRow.insertCell(4);
    const cell6 = newRow.insertCell(5);

    cell1.textContent = data.serialNo;
    cell2.textContent = data.versionName;
    cell3.textContent = data.description;
    cell4.textContent = data.startDate;
    cell5.textContent = data.endDate;

    const editIcon = document.createElement("i");
    editIcon.classList.add("fas", "fa-edit");
    editIcon.style.color = "#39f33d";
    editIcon.onclick = function () {
      editVersionTask(this);
    };

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fas", "fa-trash");
    deleteIcon.style.color = "red";
    deleteIcon.onclick = function () {
      deleteVersionTask(this);
    };

    cell6.appendChild(editIcon);
    cell6.appendChild(deleteIcon);
  }

  let currentVersionTaskID;

  function editVersionTask(icon) {
    const row = icon.closest("tr");
    currentVersionTaskID = row.dataset.taskId;
    console.log("Version Task ID:", currentVersionTaskID);
    const serialNo = row.cells[0].textContent;
    const versionName = row.cells[1].textContent;
    const description = row.cells[2].textContent;
    const startDate = row.cells[3].textContent;
    const endDate = row.cells[4].textContent;

    document.getElementById("versionSerialNo").value = serialNo;
    document.getElementById("versionName").value = versionName;
    document.getElementById("versionDescription").value = description;
    document.getElementById("versionStartDate").value = startDate;
    document.getElementById("versionEndDate").value = endDate;
  }

  document
    .getElementById("versionForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const serialNo = formData.get("versionSerialNo");
      const versionName = formData.get("versionName");
      const description = formData.get("versionDescription");
      const startDate = formData.get("versionStartDate");
      const endDate = formData.get("versionEndDate");

      const selectedProjectSerialNo = projectSelect.value;
      const selectedProject = projectsData.find(
        (project) => project._id === selectedProjectSerialNo
      );
      if (!selectedProject) {
        alert("Please select a project");
        return;
      }

      const selectedProjectId = selectedProject._id;

      if (!serialNo || !versionName || !description || !startDate || !endDate) {
        alert("Please fill in all fields");
        return;
      }

      try {
        if (!currentVersionTaskID) {
          const response = await addToVersionDatabase("versions", {
            projectId: selectedProjectId,
            serialNo,
            versionName,
            description,
            startDate,
            endDate,
          });
          console.log(response);
          if (!response.acknowledged) {
            throw new Error(`Failed to add version`);
          }
          currentVersionTaskID = response.insertedId;
          console.log(currentVersionTaskID);
          event.target.reset();
          populateProjectDropdown();
        } else {
          const response = await editVersion(currentVersionTaskID, {
            serialNo,
            versionName,
            description,
            startDate,
            endDate,
          });
          console.log(response);
          event.target.reset();
          currentVersionTaskID = "";
          populateVersions(selectedProjectId);
        }
      } catch (error) {
        console.error("Error handling form submission:", error.message);
        alert(`Error handling form submission: ${error.message}`);
      }
    });

  async function addToVersionDatabase(database, data) {
    console.log(data);
    console.log(database);
    console.log("coming into addToVersionDatabase");
    try {
      const response = await fetch(
        `http://localhost:5001/versions/${data.projectId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to add ${database}`);
      }
      const result = await response.json();
      if (database === "versions") {
        await fetchVersions();
        updateVersionTable(data);
      }
      return result;
    } catch (error) {
      console.error("Error adding " + database + ":" + error.message);
      throw error;
    }
  }

  async function editVersion(currentVersionTaskID, versionData) {
    try {
      const response = await fetch(
        `http://localhost:5001/editVersion/${currentVersionTaskID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(versionData),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to edit version: ${response.statusText}`);
      }
      updateVersionTableRow(currentVersionTaskID, versionData);
      return await response.json();
    } catch (error) {
      throw new Error(`Error editing version: ${error.message}`);
    }
  }

  function updateVersionTableRow(taskId, versionData) {
    console.log("entering to update the version name in the table");
    const rows = document.querySelectorAll("tr");
    let rowToUpdate = null;
    rows.forEach((row) => {
      if (row.dataset.taskId === taskId) {
        rowToUpdate = row;
        return;
      }
    });
    if (!rowToUpdate) {
      console.error(`Table row with task ID ${taskId} not found.`);
      return;
    }
    // Update the table cells with the new project data
    rowToUpdate.cells[0].textContent = versionData.serialNo;
    rowToUpdate.cells[1].textContent = versionData.versionName;
    rowToUpdate.cells[2].textContent = versionData.description;
    rowToUpdate.cells[3].textContent = versionData.startDate;
    rowToUpdate.cells[4].textContent = versionData.endDate;
  }

  async function deleteVersionTask(icon) {
    const selectedProjectSerialNo = projectSelect.value;
    console.log(selectedProjectSerialNo);
    const row = icon.closest("tr");
    const taskId = row.dataset.taskId;
    console.log("Task ID:", taskId);

    try {
      const response = await fetch(
        `http://localhost:5001/deleteVersion/${taskId}`,
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

      row.parentNode.removeChild(row);
      populateVersions(selectedProjectSerialNo);
      console.log("Version deleted successfully!");
    } catch (error) {
      console.error("Error deleting version:", error.message);
    }
  }

  async function fetchTestcases() {
    try {
      const response = await fetch("http://localhost:5001/testcases/get");
      if (!response.ok) {
        throw new Error("Failed to fetch testcases");
      }
      const testcasesData = await response.json();
      console.log("Fetched test cases:", testcasesData);
    } catch (error) {
      console.error("Error fetching testcases:", error.message);
      throw error;
    }
  }

  populateProjectDropdown();

  async function populateProjectDropdown() {
    let lastSelectedProject = localStorage.getItem("lastSelectedProject") || "";
    let selectedProjectId = lastSelectedProject; // Change variable name to selectedProjectId

    Array.from(projectSelect.options).forEach((option) => {
      if (option.text.trim() === lastSelectedProject) {
        option.selected = true;
      }
    });

    projectSelect.addEventListener("change", async function () {
      const selectedProjectId = projectSelect.value; // Change to use project ID
      console.log(selectedProjectId);

      // Fetch project name based on selected project ID
      const selectedProjectName =
        projectsData.find((project) => project._id === selectedProjectId)
          ?.projectName || "";

      console.log("Selected project name:", selectedProjectName);

      localStorage.setItem("lastSelectedProject", selectedProjectName);

      await populateVersions(selectedProjectId);

      const selectedVersionIndex = versionSelect.selectedIndex;
      const selectedVersionName =
        selectedVersionIndex !== -1
          ? versionSelect.options[selectedVersionIndex].text.trim()
          : "";
      console.log("Selected version name:", selectedVersionName);

      // Update selected content with project and version names
      updateSelectedContent(selectedProjectId);
    });

    versionSelect.addEventListener("change", async function () {
      const selectedVersionIndex = versionSelect.selectedIndex;
      const selectedVersionName =
        selectedVersionIndex !== -1
          ? versionSelect.options[selectedVersionIndex].text.trim()
          : "";
      console.log("Selected version name:", selectedVersionName);

      // Get the selected project ID from the dropdown
      const selectedProjectId = projectSelect.value;

      // Update selected content with project and version names
      updateSelectedContent(selectedProjectId);

      localStorage.setItem("lastSelectedVersion", selectedVersionName);
    });

    const selectedProjectsId = projectSelect.value;
    if (selectedProjectsId) {
      await populateVersions(selectedProjectsId);
    }

    // Trigger change event on version select to initially update selected content
    const changeEvent = new Event("change");
    versionSelect.dispatchEvent(changeEvent);
  }

  async function populateVersions(selectedProjectId) {
    console.log(selectedProjectId);
    try {
      const response = await fetch(
        `http://localhost:5001/versions/getByProject/${selectedProjectId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch versions for the selected project");
      }
      const matchedVersions = await response.json();
      console.log("Matched versions:", matchedVersions);

      versionSelect.innerHTML = "";

      matchedVersions.forEach((version) => {
        const option = document.createElement("option");
        option.value = version._id; // Use _id as value for version
        option.textContent = version.versionName;
        versionSelect.appendChild(option);
      });
      await fetchTestcasesByProjectAndVersion(selectedProjectId);
    } catch (error) {
      console.error("Error fetching versions:", error.message);
    }
  }

  // Function to update selected content
  async function updateSelectedContent(selectedProjectId) {
    console.log(selectedProjectId);
    const selectedVersionSerialNo = versionSelect.value;
    console.log(selectedVersionSerialNo);
    const projectSection = document.getElementById("projectSection");
    const versionSection = document.getElementById("versionSection");
    console.log(versionSection);

    // Clear previous content
    projectSection.innerHTML = "";
    versionSection.innerHTML = "";
    let selectedProjectName = "";
    let selectedVersionName = "";

    projectsData.forEach((project) => {
      if (project._id === selectedProjectId) {
        selectedProjectName = project.projectName;
      }
    });

    versionsData.forEach((version) => {
      if (version._id === selectedVersionSerialNo) {
        selectedVersionName = version.versionName;
      }
    });
    const projectElement = document.createElement("div");
    projectElement.classList.add("selected-project");
    projectElement.innerHTML = `<i class='fa fa-folder'></i> ${selectedProjectName}`;

    const versionElement = document.createElement("div");
    versionElement.classList.add("selected-version");
    versionElement.innerHTML = `<i class='fa fa-folder'></i> ${selectedVersionName}`;
    versionElement.addEventListener("click", async function () {
      // document.getElementById("testcasesTable").classList.remove("hidden");
      await displayTestCases(selectedProjectName, selectedVersionName);
    });

    // Append elements to their respective sections
    projectSection.appendChild(projectElement);
    versionSection.appendChild(versionElement);
  }

  async function displayTestCases(selectedProjectName, selectedVersionName) {
    console.log(selectedProjectName, selectedVersionName);
    const selectedProjectSerialNo = projectSelect.value;
    console.log(selectedProjectSerialNo);
    console.log("not opening testcases");
    document.getElementById("testcasesTable").classList.remove("hidden");
    const testCaseList = document.getElementById("testCaseList");
    testCaseList.innerHTML = "";

    // Fetch test case titles for the selected project and version
    const testCases = await fetchTestcasesByProjectAndVersion(
      selectedProjectSerialNo
    );
    console.log(testCases);

    testCases.forEach((testCase) => {
      const listItem = document.createElement("li");
      listItem.textContent = testCase.title;
      listItem.addEventListener("click", () => {
        populateFormWithTestCaseData(testCase._id, testCase);
        document.getElementById("testcasesTable").classList.add("hidden");
      });
      testCaseList.appendChild(listItem);
    });

    // Add event listeners to each row of the testcase table
    const tableRows = document.querySelectorAll("#tcTable tbody tr");
    tableRows.forEach((row, index) => {
      row.addEventListener("click", () => {
        const selectedTestCase = testCases[index];
        console.log(selectedTestCase);
        populateFormWithTestCaseData(selectedTestCase._id, selectedTestCase);
        document.getElementById("testcasesTable").classList.add("hidden");
      });
    });
  }

  function populateFormWithTestCaseData(taskId, testData) {
    console.log(taskId);
    const testCaseForm = document.getElementById("tcShowingForm");
    testCaseForm.classList.remove("hidden");

    // Reset the form
    document.getElementById("tcShowingForm").reset();
    const selectedTaskId = testData._id;
    console.log(selectedTaskId);

    // Check if the task ID matches the currently selected test case ID
    if (taskId === selectedTaskId) {
      // Populate form fields with test data
      document.getElementById("titles").value = testData.title;
      document.getElementById("inputs2").value = testData.input2;
      document.getElementById("inputs3").value = testData.input3;
      document.getElementById("inputs4").value = testData.input4;
      document.getElementById("inputs7").value = testData.input7;
    }

    document
      .getElementById("editButton")
      .addEventListener("click", function (event) {
        event.preventDefault();

        const inputs = document.querySelectorAll(
          "#tcShowingForm input, #tcShowingForm select, #tcShowingForm textarea"
        );
        inputs.forEach((input) => {
          if (input.id !== "inputs1" && input.id !== "inputs6") {
            input.disabled = !input.disabled;
          }
        });
      });

    document
      .getElementById("tcShowingForm")
      .addEventListener("submit", async function (event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const title = formData.get("titles");
        const input2 = formData.get("inputs2");
        const input3 = formData.get("inputs3");
        const input4 = formData.get("inputs4");
        const input5 = formData.get("inputs5");
        const input7 = formData.get("inputs7");

        if (!title || !input2 || !input3 || !input4 || !input5 || !input7) {
          alert("Please fill in all fields");
          return;
        }

        try {
          const existingRow = findRowByTestCaseId(taskId);
          console.log(existingRow);
          const selectedProjectSerialNo = projectSelect.value;
          const selectedVersionSerialNo = versionSelect.value;

          if (!selectedProjectSerialNo) {
            alert("Please select a project");
            return;
          }

          if (!selectedVersionSerialNo) {
            alert("Please select a version");
            return;
          }

          const response = await editTestcase(existingRow.dataset.taskId, {
            _id: taskId,
            title,
            input2,
            input3,
            input4,
            input5,
            input7,
          });
          updateTestcaseTableRow(taskId, {
            title,
            input2,
            input3,
            input4,
            input7,
          });
          event.target.reset();
          console.log("Testcase edited successfully:", response);

          // Hide the form and show the table
          document.getElementById("tcShowingForm").classList.add("hidden");
          document.getElementById("testcasesTable").classList.remove("hidden");
        } catch (error) {
          console.error("Error submitting form:", error.message);
        }
      });
  }

  async function editTestcase(taskId, testcaseData) {
    console.log("entering the editing the testcase");
    console.log(taskId);
    console.log(testcaseData);
    try {
      const response = await fetch(
        `http://localhost:5001/editTestcase/${taskId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(testcaseData),
        }
      );
      console.log(response);

      if (!response.ok) {
        throw new Error(`Failed to edit testcase: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error editing testcase: ${error.message}`);
    }
  }

  function findRowByTestCaseId(taskId) {
    console.log(taskId);
    console.log("entering the finding row");
    const rows = document.querySelectorAll("tr");
    let existingRow = null;
    for (const row of rows) {
      if (row.dataset.taskId === taskId) {
        existingRow = row;
        console.log(existingRow);
        break;
      }
    }
    return existingRow;
  }

  function updateTestcaseTableRow(taskId, testcaseData) {
    console.log("entering the updation of the testcase in the table");
    console.log("TestcaseData:", testcaseData);
    console.log(taskId);
    const rows = document.querySelectorAll("tr");
    let rowToUpdate = null;
    rows.forEach((row) => {
      console.log("Row dataset taskId:", row.dataset.taskId);
      if (row.dataset.taskId === taskId) {
        rowToUpdate = row;
        return;
      }
    });

    if (!rowToUpdate) {
      console.error(`Table row with taskId ${taskId} not found.`);
      return;
    }

    rowToUpdate.cells[2].textContent = testcaseData.title;
    rowToUpdate.cells[3].textContent = testcaseData.input2;
    rowToUpdate.cells[4].textContent = testcaseData.input3;
    rowToUpdate.cells[5].textContent = testcaseData.input4;
    rowToUpdate.cells[6].textContent = testcaseData.input7;
  }

  let chart;
  async function fetchTestcasesByProjectAndVersion(selectedProjectSerialNo) {
    console.log(selectedProjectSerialNo);
    const selectedVersionSerialNo = versionSelect.value;
    console.log(selectedVersionSerialNo);
    if (!selectedProjectSerialNo || selectedProjectSerialNo === "") {
      manageVersions.style.display = "none";
    } else {
      const selectedProject = projectsData.find(
        (project) => project._id === selectedProjectSerialNo
      );
      if (!selectedProject) {
        alert("Please select a project");
        return;
      }

      const selectedProjectId = selectedProject._id;
      console.log(selectedProjectId);
      try {
        const response = await fetch("http://localhost:5001/testcases/get");
        if (!response.ok) {
          throw new Error("Failed to fetch testcases");
        }
        let testcasesData = await response.json();
        console.log("Fetched test cases:", testcasesData);

        // Ensure testcasesData is an array
        if (!Array.isArray(testcasesData)) {
          testcasesData = [testcasesData];
        }

        const selectedProjectTestcases = testcasesData.filter(
          (testcase) =>
            testcase.projectId === selectedProjectId &&
            testcase.versionId === selectedVersionSerialNo
        );

        const tableBody = document.querySelector("#tcTable tbody");
        tableBody.innerHTML = "";

        selectedProjectTestcases.forEach((testcase) => {
          addTestcaseToTable(testcase);
        });
        populateTestcasesChart(selectedProjectTestcases);
        console.log("came out of the populateTestcasesChart");
        if (chart) {
          chart.destroy();
        }
        return selectedProjectTestcases;
      } catch (error) {
        console.error("Error fetching testcases:", error.message);
        throw error;
      }
    }
  }

  function addTestcaseToTable(testcase) {
    console.log("coming into testcase table");
    console.log(testcase);
    const tableBody = document.querySelector("#tcTable tbody");
    const newRow = tableBody.insertRow();
    newRow.dataset.taskId = testcase._id; // Replace taskId with testcase._id
    console.log(newRow.dataset.taskId);
    newRow.insertCell(0).textContent = testcase.projectName;
    newRow.insertCell(1).textContent = testcase.versionName;
    newRow.insertCell(2).textContent = testcase.title;
    newRow.insertCell(3).textContent = testcase.input2;
    newRow.insertCell(4).textContent = testcase.input3;
    newRow.insertCell(5).textContent = testcase.input4;
    newRow.insertCell(6).textContent = testcase.input7;
  }

  function populateTestcasesChart(testcasesData) {
    console.log(testcasesData);
    const passedCount = testcasesData.filter(
      (testcase) => testcase.input7 === "Pass"
    ).length;
    const failedCount = testcasesData.filter(
      (testcase) => testcase.input7 === "Fail"
    ).length;

    const options = {
      series: [
        {
          data: [passedCount, failedCount],
        },
      ],
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: ["Passed", "Failed"],
      },
      yaxis: {
        title: {
          text: "Count",
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
    };

    const chart = new ApexCharts(
      document.querySelector("#testcasesChart"),
      options
    );
    chart.render();
  }

  document
    .getElementById("testcaseCreationForm")
    .addEventListener("submit", async function (event) {
      console.log("coming");
      event.preventDefault();
      const formData = new FormData(event.target);
      const title = formData.get("title");
      const input2 = formData.get("input2");
      const input3 = formData.get("input3");
      const input4 = formData.get("input4");
      const input5 = formData.get("input5");
      const input7 = formData.get("input7");

      if (!title || !input2 || !input3 || !input4 || !input5 || !input7) {
        alert("Please fill in all fields");
        return;
      }

      const selectedVersionSerialNo = versionSelect.value;
      const selectedVersion = versionsData.find(
        (version) => version._id === selectedVersionSerialNo
      );
      if (!selectedVersion) {
        alert("Please select a version");
        return;
      }
      const selectedVersionId = selectedVersion._id;

      const selectedProjectSerialNo = projectSelect.value;
      const selectedProject = projectsData.find(
        (project) => project._id === selectedProjectSerialNo
      );
      if (!selectedProject) {
        alert("Please select a project");
        return;
      }
      const selectedProjectId = selectedProject._id;

      try {
        const selectedProjectName = selectedProject.projectName;
        const selectedVersionName = selectedVersion.versionName;

        const response = await addToTestcaseDatabase("testcases", {
          projectId: selectedProjectId,
          versionId: selectedVersionId,
          title,
          input2,
          input3,
          input4,
          input5,
          input7,
          projectName: selectedProjectName,
          versionName: selectedVersionName,
        });
        console.log("New testcase added:", response);
        event.target.reset();
        // document.getElementById("testcasesTable").classList.remove("hidden");
      } catch (error) {
        console.error("Error submitting form:", error.message);
      }
    });

  async function addToTestcaseDatabase(database, data) {
    console.log(data);
    console.log(database);
    console.log("coming into addToTestcaseDatabase");
    try {
      const response = await fetch(
        `http://localhost:5001/testcases/${data.projectId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to add ${database}`);
      }
      const result = await response.json();
      if (database === "testcases") {
        await fetchTestcases();
      }
      return result;
    } catch (error) {
      console.error("Error adding " + database + ":" + error.message);
      throw error;
    }
  }
});
