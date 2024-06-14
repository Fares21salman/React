const express = require("express");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001;
const uri = "mongodb://localhost:27017";
const dbName = "NewProject";
const projectCollectionName = "projects_collections";
const versionCollectionName = "versions_collections";
const testcaseCollectionName = "testcases";

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

const projectClient = new MongoClient(uri);

async function connectToProjectDB() {
  try {
    await projectClient.connect();
    const database = projectClient.db(dbName);
    const collection = database.collection(projectCollectionName);
    console.log("Connected to project database");
    return collection;
  } catch (error) {
    console.error("Error connecting to project MongoDB:", error);
    throw error;
  }
}

app.post("/addProject", async (req, res) => {
  console.log("coming in");
  try {
    const collection = await connectToProjectDB();
    const { serialNo, projectName, description, startDate, endDate } = req.body;
    const result = await collection.insertOne({
      serialNo,
      projectName,
      description,
      startDate,
      endDate,
    });
    res.status(201).json(result);
  } catch (error) {
    console.error("Error adding project:", error.message);
    res.status(500).json({ error: "Failed to add project" });
  }
});

app.get("/projects/get", async (req, res) => {
  try {
    const collection = await connectToProjectDB();
    const projects = await collection.find({}).toArray();
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error.message);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

app.get("/projects/names", async (req, res) => {
  try {
    const customersCollection = await connectToProjectDB();
    const projects = await customersCollection.find().toArray();
    const projectNames = projects.map((project) => project._id);
    res.status(200).json(projectNames);
  } catch (error) {
    console.error("Error fetching project names:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/editProject/:id", async (req, res) => {
  const editId = req.params.id;
  console.log(editId);
  try {
    const collection = await connectToProjectDB();
    const { serialNo, projectName, description, startDate, endDate } = req.body;
    const result = await collection.updateOne(
      { _id: new ObjectId(editId) },
      { $set: { serialNo, projectName, description, startDate, endDate } }
    );
    if (result.modifiedCount === 1) {
      res.status(200).json({ message: "Project edited successfully" });
    } else {
      res.status(404).json({ error: "Project not found" });
    }
  } catch (error) {
    console.error("Error editing project:", error);
    res.status(500).json({ error: "Failed to edit project" });
  }
});

app.delete("/deleteProject/:id", async (req, res) => {
  const projectId = req.params.id;
  console.log(projectId);
  try {
    const collection = await connectToProjectDB();
    console.log("entered into the project deletion");
    const result = await collection.deleteOne({ _id: new ObjectId(projectId) });
    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Task deleted successfully" });
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    console.error("Error deleting task:", error.message);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

async function connectToVersionConnection() {
  try {
    console.log("entering connectToVersionConnection");
    await projectClient.connect();
    const database = projectClient.db(dbName);
    const collection = database.collection(versionCollectionName);
    console.log("Connected to version database");
    return collection;
  } catch (error) {
    console.error("Error connecting to version MongoDB:", error);
    throw error;
  }
}

app.get("/versions/get", async (req, res) => {
  try {
    const collection = await connectToVersionConnection();
    const versions = await collection.find({}).toArray();
    res.status(200).json(versions);
  } catch (error) {
    console.error("Error fetching versions:", error.message);
    res.status(500).json({ error: "Failed to fetch versions" });
  }
});

app.get("/versions/getByProject/:id", async (req, res) => {
  try {
    const projectId = req.params.id;
    const collection = await connectToVersionConnection();
    const versions = await collection
      .find({ projectId: new ObjectId(projectId) })
      .toArray();
    res.status(200).json(versions);
  } catch (error) {
    console.error("Error fetching versions by project ID:", error.message);
    res.status(500).json({ error: "Failed to fetch versions by project ID" });
  }
});

app.post("/addversions/:projectId", async (req, res) => {
  try {
    const collection = await connectToVersionConnection();
    const { projectId } = req.params;
    const {
      versionSerialNo,
      versionName,
      versionDescription,
      versionStartDate,
      versionEndDate,
    } = req.body;

    const projectIdObj = new ObjectId(projectId);

    const result = await collection.insertOne({
      projectId: projectIdObj,
      serialNo: versionSerialNo,
      versionName,
      description: versionDescription,
      startDate: versionStartDate,
      endDate: versionEndDate,
    });

    console.log("Insert result:", result);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error adding version:", error.message);
    res.status(500).json({ error: "Failed to add version" });
  }
});

app.post("/editVersion/:versionId", async (req, res) => {
  try {
    const collection = await connectToVersionConnection();
    const { versionId } = req.params;
    const {
      versionSerialNo,
      versionName,
      versionDescription,
      versionStartDate,
      versionEndDate,
    } = req.body;

    const versionIdObj = new ObjectId(versionId);

    const result = await collection.updateOne(
      { _id: versionIdObj },
      {
        $set: {
          serialNo: versionSerialNo,
          versionName,
          description: versionDescription,
          startDate: versionStartDate,
          endDate: versionEndDate,
        },
      }
    );

    console.log("Update result:", result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error updating version:", error.message);
    res.status(500).json({ error: "Failed to update version" });
  }
});

app.delete("/deleteVersion/:id", async (req, res) => {
  const versionId = req.params.id;
  try {
    const collection = await connectToVersionConnection();
    const result = await collection.deleteOne({ _id: new ObjectId(versionId) });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Version deleted successfully" });
    } else {
      res.status(404).json({ error: "Version not found" });
    }
  } catch (error) {
    console.error("Error deleting version:", error);
    res.status(500).json({ error: "Failed to delete version" });
  }
});

async function connectToTestcaseConnection() {
  try {
    await projectClient.connect();
    const database = projectClient.db(dbName);
    const collection = database.collection(testcaseCollectionName);
    console.log("Connected to testcase database");
    return collection;
  } catch (error) {
    console.error("Error connecting to testcase MongoDB:", error);
    throw error;
  }
}

app.get("/testcases/get", async (req, res) => {
  try {
    const collection = await connectToTestcaseConnection();
    const testcases = await collection.find({}).toArray();
    res.status(200).json(testcases);
  } catch (error) {
    console.error("Error fetching testcases:", error.message);
    res.status(500).json({ error: "Failed to fetch testcases" });
  }
});

app.post("/testcases/:projectId", async (req, res) => {
  try {
    const collection = await connectToTestcaseConnection();

    const { projectId } = req.params;
    const { versionId, title, input2, input3, input4, input5, input6, input7 } =
      req.body;

    // Convert projectId to ObjectId
    const projectIdObj = new ObjectId(projectId);
    const versionIdObj = new ObjectId(versionId);

    const result = await collection.insertOne({
      projectId: projectIdObj,
      versionId: versionIdObj,
      title,
      input2,
      input3,
      input4,
      input5,
      input6,
      input7,
    });

    console.log("Insert result:", result);

    res.status(201).json(result);
  } catch (error) {
    console.error("Error adding version:", error.message);
    res.status(500).json({ error: "Failed to add version" });
  }
});

app.put("/testcases/editingTestcase/:testcaseId", async (req, res) => {
  try {
    const collection = await connectToTestcaseConnection();

    const { testcaseId } = req.params;
    const { versionId, title, input2, input3, input4, input5, input6, input7 } =
      req.body;

    // Convert testcaseId to ObjectId
    const testcaseIdObj = new ObjectId(testcaseId);
    const versionIdObj = new ObjectId(versionId);

    const result = await collection.updateOne(
      { _id: testcaseIdObj },
      {
        $set: {
          versionId: versionIdObj,
          title,
          input2,
          input3,
          input4,
          input5,
          input6,
          input7,
        },
      }
    );

    console.log("Update result:", result);

    res.status(200).json({ message: "Test case updated successfully" });
  } catch (error) {
    console.error("Error updating test case:", error.message);
    res.status(500).json({ error: "Failed to update test case" });
  }
});

app.listen(port, () => console.log("Server is listening on port: " + port));
