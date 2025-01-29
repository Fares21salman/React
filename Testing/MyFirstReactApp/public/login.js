// function login() {
//     const usernameInput = document.getElementById("usernameInput");
//     const passwordInput = document.getElementById("password");

//     const username = usernameInput.value
//     console.log(username);
//     const password = passwordInput.value
//     console.log(password);

//     if (username === "") {
//         alert("Username can't be blank");
//         usernameInput.focus(); // Set focus back to username field
//         return false;
//     } else if (password === "") {
//         alert("Password can't be blank");
//         passwordInput.focus(); // Set focus back to password field
//         return false;
//     } else if (username === "Bob" && password === "Password123!@#") {
//         // Hide the login container and show the dashboard
//         document.getElementById("loginContainer").style.display = "none";
//         document.getElementById("dashboard").style.display = "block";
//         return true;
//     } else {
//         alert("Incorrect username or password. Please try again.");
//         passwordInput.value = ""; // Clear password field
//         passwordInput.value = ""; // Set focus back to password field
//         return false;
//     }
// }

document.addEventListener('DOMContentLoaded', async function () {

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
    const testcaseCreationSymbol = document.getElementById("testcaseCreationSymbol");
    const testcaseCreationForm = document.getElementById("testcaseCreationForm");

    settingsButton.addEventListener("click", function () {
        settingsControl.style.display = "block";
    });

    createProject.addEventListener("click", function () {
        displaySection(createProjectContent);
    });

    createVersion.addEventListener("click", function () {
        displaySection(createVersionContent);
    });

    testcases.addEventListener("click", function () {
        displaySection(testcasesTable);
    });

    testcaseCreationSymbol.addEventListener("click", function () {
        displaySection(testcaseCreationForm);
    });

    function displaySection(section) {
        const sections = [
            createProjectContent,
            createVersionContent,
            manageVersionsTable,
            manageVersions,
            testcasesTable,
            totalTestcasesBox,
            testcaseCreationForm
        ];
        sections.forEach(sec => {
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
            const response = await fetch('http://localhost:5001/projects/get');
            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }
            projectsData = await response.json();
            console.log(projectsData);
            populateProjectsTable(projectsData);
        } catch (error) {
            console.error('Error fetching projects:', error.message);
        }
    }

    function populateProjectsTable(projectsData) {
        const tableBody = document.getElementById("projectsTable").getElementsByTagName("tbody")[0];
        tableBody.innerHTML = "";
        console.log("tableBody:", tableBody);
        console.log("projectsData:", projectsData);
        projectsData.forEach(project => {
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

        const editIcon = document.createElement('i');
        editIcon.classList.add('fas', 'fa-edit');
        editIcon.style.color = '#39f33d';
        editIcon.onclick = function () {
            projectEdit(this);
        };

        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fas', 'fa-trash');
        deleteIcon.style.color = 'red';
        deleteIcon.onclick = function () {
            deleteProject(this);
        };

        cell6.appendChild(editIcon);
        cell6.appendChild(deleteIcon);
    }

    async function deleteProject(icon) {
        const row = icon.closest('tr');
        const taskId = row.dataset.taskId;
        console.log("Task ID:", taskId);

        try {
            const response = await fetch(`http://localhost:5001/deleteProject/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete task');
            }

            row.parentNode.removeChild(row);
            console.log('Task deleted successfully!');
        } catch (error) {
            console.error('Error deleting task:', error.message);
        }
    }

    function projectEdit(icon) {
        const row = icon.closest('tr');
        const serialNo = row.cells[0].textContent;
        console.log("Serial Number:", serialNo);
        const projectName = row.cells[1].textContent;
        const description = row.cells[2].textContent;
        const startDate = row.cells[3].textContent;
        const endDate = row.cells[4].textContent;

        document.getElementById('serialNo').value = serialNo;
        document.getElementById('projectName').value = projectName;
        document.getElementById('projectDescription').value = description;
        document.getElementById('startDate').value = startDate;
        document.getElementById('endDate').value = endDate;
    }

    document.getElementById("projectForm").addEventListener("submit", async function (event) {
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

        const existingRows = findRowBySerialNo(serialNo);
        if (existingRows) {
            editProject(existingRows.dataset.taskId, { serialNo, projectName, description, startDate, endDate })
                .then(response => {
                    if (response.error) {
                        throw new Error(response.error);
                    }
                    event.target.reset();
                })
                .catch(error => {
                    console.error('Error editing project:', error.message);
                    alert(`Error editing project: ${error.message}`);
                });
        } else {
            addToDatabase('projects', { serialNo, projectName, description, startDate, endDate })
                .then(response => {
                    if (response.error) {
                        throw new Error(response.error);
                    }
                    event.target.reset();
                    populateProjectDropdown()
                })
                .catch(error => {
                    console.error('Error adding project:', error.message);
                    alert(`Error adding project: ${error.message}`);
                });
        }
    });

    function findRowBySerialNo(serialNo) {
        const rows = document.querySelectorAll('tr');
        let existingRows = null;
        rows.forEach(row => {
            if (row.cells[0].textContent === serialNo) {
                existingRows = row;
                return;
            }
        });
        return existingRows;
    }

    async function editProject(taskId, projectData) {
        try {
            const response = await fetch(`http://localhost:5001/editProject/${taskId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(projectData),
            });

            if (!response.ok) {
                throw new Error(`Failed to edit project: ${response.statusText}`);
            }

            updateTableRow(projectData.serialNo, projectData);

            return await response.json();
        } catch (error) {
            throw new Error(`Error editing project: ${error.message}`);
        }
    }

    function updateTableRow(serialNo, projectData) {
        const rows = document.querySelectorAll('tr');
        let rowToUpdate = null;
        rows.forEach(row => {
            if (row.cells[0].textContent === serialNo) {
                rowToUpdate = row;
                return;
            }
        });

        if (!rowToUpdate) {
            console.error(`Table row with serial number ${serialNo} not found.`);
            return;
        }

        rowToUpdate.cells[0].textContent = projectData.serialNo;
        rowToUpdate.cells[1].textContent = projectData.projectName;
        rowToUpdate.cells[2].textContent = projectData.description;
        rowToUpdate.cells[3].textContent = projectData.startDate;
        rowToUpdate.cells[4].textContent = projectData.endDate;
    }

    async function fetchVersions() {
        try {
            const response = await fetch('http://localhost:5001/versions/get');
            if (!response.ok) {
                throw new Error('Failed to fetch versions');
            }
            versionsData = await response.json();
            console.log(versionsData);
        } catch (error) {
            console.error('Error fetching versions:', error.message);
        }
    }

    manageVersions.addEventListener("click", function () {
        const selectedProjectSerialNo = projectSelect.value;
    
        if (!selectedProjectSerialNo || selectedProjectSerialNo === "") {
            manageVersionsTable.style.display = "none";
        } else {
            const selectedProjectVersions = versionsData.filter(version => version.serialNo === selectedProjectSerialNo);
    
            const tableBody = document.querySelector("#mvTable tbody");
            tableBody.innerHTML = "";
    
            selectedProjectVersions.forEach(version => {
                updateVersionTable(version);
            });
    
            manageVersionsTable.style.display = "block";
        }
    });

    function updateVersionTable(data) {
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

        // Create edit and delete icons
        const editIcon = document.createElement('i');
        editIcon.classList.add('fas', 'fa-edit');
        editIcon.style.color = '#39f33d';
        editIcon.onclick = function () {
            editVersionTask(this);
        };

        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fas', 'fa-trash');
        deleteIcon.style.color = 'red';
        deleteIcon.onclick = function () {
            deleteVersionTask(this);
        };

        cell6.appendChild(editIcon);
        cell6.appendChild(deleteIcon);
    }

    async function editVersionTask(icon) {
        const row = icon.closest('tr');
        const taskId = row.dataset.taskId;
        console.log("Task ID:", taskId);
        const serialNo = row.cells[0].textContent;
        const versionName = row.cells[1].textContent;
        const description = row.cells[2].textContent;
        const startDate = row.cells[3].textContent;
        const endDate = row.cells[4].textContent;

        document.getElementById('versionSerialNo').value = serialNo;
        document.getElementById('versionName').value = versionName;
        document.getElementById('versionDescription').value = description;
        document.getElementById('versionStartDate').value = startDate;
        document.getElementById('versionEndDate').value = endDate;
    }
    
    async function deleteVersionTask(icon) {
        const row = icon.closest('tr');
        const taskId = row.dataset.taskId;
        console.log("Task ID:", taskId);

        try {
            const response = await fetch(`http://localhost:5001/deleteVersion/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete version');
            }

            row.parentNode.removeChild(row);
            console.log('Version deleted successfully!');
        } catch (error) {
            console.error('Error deleting version:', error.message);
        }
    }

    document.getElementById("versionForm").addEventListener("submit", async function (event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const serialNo = formData.get("versionSerialNo");
        const versionName = formData.get("versionName");
        const description = formData.get("versionDescription");
        const startDate = formData.get("versionStartDate");
        const endDate = formData.get("versionEndDate");

        if (!serialNo || !versionName || !description || !startDate || !endDate) {
            alert("Please fill in all fields");
            return;
        }

        try {
            const existingRow = findRowByVersionName(versionName);
            console.log("Existing Row:", existingRow);
            if (existingRow) {
                // Update existing version
                console.log("In the existing row edit");
                editVersion(existingRow.dataset.taskId, { serialNo, versionName, description, startDate, endDate })
                    .then(response => {
                        console.log("Edit version response:", response);
                        if (response.error) {
                            throw new Error(response.error);
                        }
                        event.target.reset();
                    })
                    .catch(error => {
                        console.error('Error editing version:', error.message);
                        alert(`Error editing version: ${error.message}`);
                    });
            } else {
                addToDatabase('versions', { serialNo, versionName, description, startDate, endDate })
                    .then(response => {
                        if (response.error) {
                            throw new Error(response.error);
                        }
                        event.target.reset();
                    })
                    .catch(error => {
                        console.error('Error adding version:', error.message);
                        alert(`Error adding version: ${error.message}`);
                    });
            }
        } catch (error) {
            console.error('Error submitting version form:', error.message);
            alert(`Error submitting version form: ${error.message}`);
        }
    });

    function findRowByVersionName(versionName) {
        console.log("coming in findRowByVersionName");
        const rows = document.querySelectorAll('tr');
        let existingRow = null;
        rows.forEach(row => {
            if (row.cells[1].textContent === versionName) {
                existingRow = row;
                return;
            }
        });
        return existingRow;
    }

    async function editVersion(taskId, versionData) {
        try {
            const response = await fetch(`http://localhost:5001/editVersion/${taskId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(versionData),
            });

            if (!response.ok) {
                throw new Error(`Failed to edit version: ${response.statusText}`);
            }

            updateVersionTableRow(versionData.versionName, versionData);

            return await response.json();
        } catch (error) {
            throw new Error(`Error editing version: ${error.message}`);
        }
    }

    function updateVersionTableRow(versionName, versionData) {
        const rows = document.querySelectorAll('tr');
        let rowToUpdate = null;
        rows.forEach(row => {
            if (row.cells[1].textContent === versionName) {
                rowToUpdate = row;
                return;
            }
        });

        if (!rowToUpdate) {
            console.error(`Table row with version name ${versionName} not found.`);
            return;
        }

        rowToUpdate.cells[0].textContent = versionData.serialNo;
        rowToUpdate.cells[1].textContent = versionData.versionName;
        rowToUpdate.cells[2].textContent = versionData.description;
        rowToUpdate.cells[3].textContent = versionData.startDate;
        rowToUpdate.cells[4].textContent = versionData.endDate;
    }

    async function fetchTestcases() {
        try {
            const response = await fetch('http://localhost:5001/testcases/get');
            if (!response.ok) {
                throw new Error('Failed to fetch testcases');
            }
            const testcasesData = await response.json();
            console.log('Fetched test cases:', testcasesData);
            populateTestcasesTable(testcasesData);
        } catch (error) {
            console.error('Error fetching testcases:', error.message);
            throw error;
        }
    }

    function populateTestcasesTable(testcasesData) {
        console.log("populateTestcasesTable");
        const tableBody = document.getElementById("tcTable").getElementsByTagName("tbody")[0];
        console.log("tableBody:", tableBody);
        console.log("testcasesData:", testcasesData);
    } 

    async function populateProjectDropdown() {
        populateDropdown(projectSelect, projectsData, "serialNo", "projectName");

        let lastSelectedProject = localStorage.getItem("lastSelectedProject") || "";
        let selectedProjectName = lastSelectedProject;

        Array.from(projectSelect.options).forEach(option => {
            if (option.text.trim() === lastSelectedProject) {
                option.selected = true;
            }
        });

        projectSelect.addEventListener("change", async function () {
            const selectedProjectSerialNo = projectSelect.value;
            selectedProjectName = projectSelect.options[projectSelect.selectedIndex].text.trim();
            console.log("Selected project name:", selectedProjectName);

            localStorage.setItem("lastSelectedProject", selectedProjectName);

            await populateVersions(selectedProjectSerialNo);

            const selectedVersionName = versionSelect.options[versionSelect.selectedIndex].text.trim();
            await fetchAndDisplayTestcases(selectedProjectName, selectedVersionName);
        });

        versionSelect.addEventListener("change", async function () {
            const selectedVersionSerialNo = versionSelect.value;
            console.log(selectedVersionSerialNo);

            const selectedVersionName = versionSelect.options[versionSelect.selectedIndex].text.trim();
            console.log(selectedVersionName);

            await fetchAndDisplayTestcases(selectedProjectName, selectedVersionName);

            localStorage.setItem("lastSelectedVersion", selectedVersionName);
        });

        const selectedProjectSerialNo = projectSelect.value;
        if (selectedProjectSerialNo) {
            await populateVersions(selectedProjectSerialNo);
        }
    }

    function populateDropdown(selectElement, data, valueField, textField) {
        selectElement.innerHTML = '';
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item[valueField];
            option.textContent = item[textField];
            selectElement.appendChild(option);
        });
    }

    populateProjectDropdown();

    async function populateVersions(selectedProjectSerialNo) {
        try {
            const response = await fetch(`http://localhost:5001/versions/getByProject/${selectedProjectSerialNo}`);
            if (!response.ok) {
                throw new Error('Failed to fetch versions for the selected project');
            }
            const matchedVersions = await response.json();
            console.log('Matched versions:', matchedVersions);
    
            versionSelect.innerHTML = "";

            matchedVersions.forEach(version => {
                const option = document.createElement('option');
                option.value = version.serialNo; // Set the value to the serialNo of the version
                option.textContent = version.versionName;
                versionSelect.appendChild(option);
            });
    
            // Set the last selected version if available
            let lastSelectedVersion = localStorage.getItem("lastSelectedVersion") || "";
            Array.from(versionSelect.options).forEach(option => {
                if (option.text.trim() === lastSelectedVersion) {
                    option.selected = true;
                }
            });

            const selectedProjectName = projectSelect.options[projectSelect.selectedIndex].text.trim();
            const selectedVersionName = versionSelect.options[versionSelect.selectedIndex].text.trim();
            await fetchAndDisplayTestcases(selectedProjectName, selectedVersionName);
        } catch (error) {
            console.error('Error fetching versions:', error.message);
        }
    }
    
    async function fetchAndDisplayTestcases(selectedProjectName, selectedVersionName) {
        console.log(selectedProjectName, selectedVersionName);
        try {
            const testcasesForSelectedProjectAndVersion = await fetchTestcasesByProjectAndVersion(selectedProjectName, selectedVersionName);
            console.log(testcasesForSelectedProjectAndVersion);

            if (testcasesForSelectedProjectAndVersion.length > 0) {
                const tableBody = document.querySelector("#tcTable tbody");
                tableBody.innerHTML = "";
            }

            if(testcasesForSelectedProjectAndVersion.length === 0) {
                const tableBody = document.querySelector("#tcTable tbody");
                tableBody.innerHTML = "";
            }

            testcasesForSelectedProjectAndVersion.forEach(testcase => addTestcaseToTable(testcase));
        } catch (error) {
            console.error('Error fetching and displaying test cases:', error.message);
        }
    }

    async function fetchTestcasesByProjectAndVersion(projectName, versionName) {
        console.log(projectName, versionName);
        try {
            const response = await fetch(`http://localhost:5001/testcases/byprojectandversion/${projectName}/${versionName}`);
            console.log(response);
            if (!response.ok) {
                throw new Error(`Failed to fetch testcases for ${projectName} and ${versionName}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching testcases:', error.message);
            return [];
        }
    }

    function addTestcaseToTable(testcase) {
        const tableBody = document.querySelector("#tcTable tbody");
        const newRow = tableBody.insertRow();
        newRow.dataset.taskId = testcase._id;
        console.log(newRow.dataset.taskId);
        newRow.insertCell(0).textContent = testcase.projectName;
        newRow.insertCell(1).textContent = testcase.versionName;
        newRow.insertCell(2).textContent = testcase.title;
        newRow.insertCell(3).textContent = testcase.input2;
        newRow.insertCell(4).textContent = testcase.input3;
        newRow.insertCell(5).textContent = testcase.input4;
        newRow.insertCell(6).textContent = testcase.input7;

        const cell7 = newRow.insertCell(7);
        const editIcon = document.createElement('i');
        editIcon.classList.add('fas', 'fa-edit');
        editIcon.style.color = '#39f33d';
        editIcon.onclick = function () {
            tcEditTask(this);
        };

        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fas', 'fa-trash');
        deleteIcon.style.color = 'red';
        deleteIcon.onclick = function () {
            deleteTestcaseTask(this);
        };

        cell7.appendChild(editIcon);
        cell7.appendChild(deleteIcon);
    }

    function tcEditTask(icon) {
        const row = icon.closest('tr');
        const tcName = row.cells[2].textContent;
        const tcID = row.cells[3].textContent;
        const tcPriority = row.cells[4].textContent;
        const tcType = row.cells[5].textContent;
        const tcGrade = row.cells[6].textContent;

        document.getElementById('editTitle').value = tcName;
        document.getElementById('editInput2').value = tcID;
        document.getElementById('editInput3').value = tcPriority;
        document.getElementById('editInput4').value = tcType;
        document.getElementById('editInput7').value = tcGrade;

        const editForm = document.getElementById('editTestcaseForm');
        editForm.classList.remove('hidden');

        const creationForm = document.getElementById('testcaseCreationForm');
        creationForm.classList.add('hidden');

        const taskId = row.dataset.taskId;
        editForm.setAttribute('data-taskId', taskId);
    }

    async function deleteTestcaseTask(icon) {
        const row = icon.closest('tr');
        const taskId = row.dataset.taskId;
        console.log("Task ID:", taskId);

        try {
            const response = await fetch(`http://localhost:5001/deleteTestcase/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete testcase');
            }

            row.parentNode.removeChild(row);
            console.log('Testcase deleted successfully!');
        } catch (error) {
            console.error('Error deleting testcase:', error.message);
        }
    }

    document.getElementById("editTestcaseForm").addEventListener("submit", async function (event) {
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
    
        try {
            const existingRow = findRowByTitle(title);
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
    
            const selectedProject = projectsData.find(project => project.serialNo === selectedProjectSerialNo);
            const selectedProjectName = selectedProject ? selectedProject.projectName : "";
            const selectedVersion = versionsData.find(version => version.serialNo === selectedVersionSerialNo);
            const selectedVersionName = selectedVersion ? selectedVersion.versionName : "";
    
            if (existingRow) {
                const response = await editTestcase(title, { title, input2, input3, input4, input5, input7 });
                updateTestcaseTableRow(title, { title, input2, input3, input4, input7 });
                event.target.reset();
                console.log('Testcase edited successfully:', response);
                document.getElementById('editTestcaseForm').style.display = "none";
            }
        } catch (error) {
            console.error('Error submitting form:', error.message);
        }
    });    

    document.getElementById("testcaseCreationForm").addEventListener("submit", async function (event) {
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
    
        try {
            const selectedProjectSerialNo = projectSelect.value;
            const selectedVersionSerialNo = versionSelect.value;
            console.log(selectedVersionSerialNo);
    
            if (!selectedProjectSerialNo) {
                alert("Please select a project");
                return;
            }
    
            if (!selectedVersionSerialNo) {
                alert("Please select a version");
                return;
            }
    
            // Fetch the project and version names from the database
            const selectedProject = projectsData.find(project => project.serialNo === selectedProjectSerialNo);
            const selectedProjectName = selectedProject ? selectedProject.projectName : "";
            console.log(selectedProjectName);
    
            const selectedVersion = versionsData.find(version => version.serialNo === selectedVersionSerialNo);
            console.log(selectedVersion);
            const selectedVersionName = selectedVersion ? selectedVersion.versionName : "";
            console.log(selectedVersionName);
    
            // Add the testcase to the database with project and version names
            const response = await addToDatabase('testcases', { title, input2, input3, input4, input5, input7, projectName: selectedProjectName, versionName: selectedVersionName });
            console.log('New testcase added:', response);
            event.target.reset();
        } catch (error) {
            console.error('Error submitting form:', error.message);
        }
    });
    
    
    async function editTestcase(taskId, testcaseData) {
        console.log(testcaseData);
        try {
            const response = await fetch(`http://localhost:5001/editTestcase/${taskId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testcaseData),
            });

            if (!response.ok) {
                throw new Error(`Failed to edit testcase: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            throw new Error(`Error editing testcase: ${error.message}`);
        }
    }

    function updateTestcaseTableRow(title, testcaseData) {
        console.log("TestcaseData:" + testcaseData);
        const rows = document.querySelectorAll('tr');
        let rowToUpdate = null;
        rows.forEach(row => {
            if (row.cells[2].textContent === title) {
                rowToUpdate = row;
                return;
            }
        });

        if (!rowToUpdate) {
            console.error(`Table row with title ${title} not found.`);
            return;
        }

        rowToUpdate.cells[3].textContent = testcaseData.input2;
        rowToUpdate.cells[4].textContent = testcaseData.input3;
        rowToUpdate.cells[5].textContent = testcaseData.input4;
        rowToUpdate.cells[6].textContent = testcaseData.input7;
    }

    function findRowByTitle(title) {
        const rows = document.querySelectorAll('tr');
        let existingRow = null;
        for (const row of rows) {
            if (row.cells[2].textContent === title) {
                existingRow = row;
                break;
            }
        }
        return existingRow;
    }

    async function addToDatabase(database, data) {
        try {
            console.log("entering");
            const response = await fetch(`http://localhost:5001/${database}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`Failed to add ${database}`);
            }
            const result = await response.json();
            if (database === 'projects') {
                await fetchProjects();
            } else if (database === 'versions') {
                await fetchVersions();
                updateVersionTable(data);
            } else if (database === 'testcases') {
                console.log("back in login");
                await fetchTestcases();
            }
            return result;
        } catch (error) {
            console.error(`Error adding ${database}:`, error.message);
            throw error;
        }
    }
});