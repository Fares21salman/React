const express = require('express');
const path = require('path'); 
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5001;
const uri = 'mongodb://localhost:27017';
const dbName = 'NewProject';
const collectionName = 'projects_collections';
const versionCollectionName = 'versions_collections';
const testcaseCollectionName = "testcases";

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors()); 

const projectClient = new MongoClient(uri);

async function connectToProjectDB() {
    try {
        await projectClient.connect();
        const database = projectClient.db(dbName);
        const collection = database.collection(collectionName);
        console.log('Connected to project database');
        return collection;
    } catch (error) {
        console.error('Error connecting to project MongoDB:', error);
        throw error;
    }
}

app.get('/projects/get', async (req, res) => {
    try {
        const collection = await connectToProjectDB();
        const projects = await collection.find({}).toArray();
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error.message);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

app.post('/projects', async (req, res) => {
    try {
        const collection = await connectToProjectDB();
        const { serialNo, projectName, description, startDate, endDate } = req.body;
        const result = await collection.insertOne({ serialNo, projectName, description, startDate, endDate });
        res.status(201).json(result);
    } catch (error) {
        console.error('Error adding project:', error.message);
        res.status(500).json({ error: 'Failed to add project' });
    }
});

app.get('/projects/names', async (req, res) => {
    try {
        const customersCollection = await connectToProjectDB();
        const projects = await customersCollection.find().toArray();
        const projectNames = projects.map(project => project.projectName);
        res.status(200).json(projectNames);
    } catch (error) {
        console.error('Error fetching project names:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

async function connectToVersionConnection() {
    try {
        console.log("entering connectToVersionConnection");
        await projectClient.connect();
        const database = projectClient.db(dbName);
        const collection = database.collection(versionCollectionName);
        console.log('Connected to version database');
        return collection;
    } catch (error) {
        console.error('Error connecting to version MongoDB:', error);
        throw error;
    }
}

app.get('/versions/getByProject/:projectSerialNo', async (req, res) => {
    try {
        const projectSerialNo = req.params.projectSerialNo;
        const collection = await connectToVersionConnection();
        const versions = await collection.find({ serialNo: projectSerialNo }).toArray();
        res.status(200).json(versions);
    } catch (error) {
        console.error('Error fetching versions by project serial number:', error.message);
        res.status(500).json({ error: 'Failed to fetch versions by project serial number' });
    }
});

app.get('/versions/get', async (req, res) => {
    try {
        const collection = await connectToVersionConnection();
        const versions = await collection.find({}).toArray();
        res.status(200).json(versions);
    } catch (error) {
        console.error('Error fetching versions:', error.message);
        res.status(500).json({ error: 'Failed to fetch versions' });
    }
});

app.post('/versions', async (req, res) => {
    try {
        const collection = await connectToVersionConnection();
        const { serialNo, versionName, description, startDate, endDate } = req.body;
        const result = await collection.insertOne({ serialNo, versionName, description, startDate, endDate });
        res.status(201).json(result);
    } catch (error) {
        console.error('Error adding version:', error.message);
        res.status(500).json({ error: 'Failed to add version' });
    }
});

app.get('/versions/names', async (req, res) => {
    try {
        const collection = await connectToVersionConnection();
        const versions = await collection.find().toArray();
        const versionNames = versions.map(version => version.projectName);
        res.status(200).json(versionNames);
    } catch (error) {
        console.error('Error fetching version names:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

async function connectToTestcaseConnection() {
    try {
        await projectClient.connect();
        const database = projectClient.db(dbName);
        const collection = database.collection(testcaseCollectionName);
        console.log('Connected to testcase database');
        return collection;
    } catch (error) {
        console.error('Error connecting to testcase MongoDB:', error);
        throw error;
    }
}

app.get('/testcases/get', async (req, res) => {
    try {
        const collection = await connectToTestcaseConnection();
        const testcases = await collection.find({}).toArray();
        res.status(200).json(testcases);
    } catch (error) {
        console.error('Error fetching testcases:', error.message);
        res.status(500).json({ error: 'Failed to fetch testcases' });
    }
});

app.post('/testcases', async (req, res) => {
    console.log("entered");
    try {
        const { title, input2, input3, input4, input5, input6, input7, projectName, versionName } = req.body;
        console.log("Project Name:", projectName);
        console.log("Version Name:", versionName);
        const collection = await connectToTestcaseConnection();
        
        const result = await collection.insertOne({ title, input2, input3, input4, input5, input6, input7, projectName, versionName });
        res.status(201).json(result);
    } catch (error) {
        console.error('Error adding test case:', error.message);
        res.status(500).json({ error: 'Failed to add test case' });
    }
});

app.get('/testcases/byprojectandversion/:projectName/:versionName', async (req, res) => {
    const { projectName, versionName } = req.params;
    try {
        const collection = await connectToTestcaseConnection();
        const testcases = await collection.find({ projectName, versionName }).toArray();
        console.log('Test cases for project and version:', testcases);
        res.json(testcases);
    } catch (error) {
        console.error('Error fetching test cases:', error);
        res.status(500).json({ error: 'Failed to fetch test cases' });
    }
});

app.get('/testcases/names', async (req, res) => {
    try {
        const collection = await connectToTestcaseConnection();
        const testcases = await collection.find().toArray();
        const testcasesNames = Array.from(new Set(testcases.map(testcase => testcase.projectName)));
        res.status(200).json(testcasesNames);
    } catch (error) {
        console.error('Error fetching testcase names:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/editProject/:id', async(req,res) => {
    const editId = req.params.id;
    console.log(editId);
    try {
        const collection = await connectToProjectDB();
        const { serialNo, projectName, description, startDate, endDate } = req.body;
        const result = await collection.updateOne({ _id: new ObjectId(editId) }, { $set: { serialNo, projectName, description, startDate, endDate } });
        if(result.modifiedCount === 1){
            res.status(200).json({ message: 'Project edited successfully' });
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (error) {
        console.error('Error editing project:', error);
        res.status(500).json({ error: 'Failed to edit project' });
    }
});

app.delete('/deleteProject/:id', async (req, res) => {
    const projectId = req.params.id;
    console.log(projectId);
    try {
        const collection = await connectToProjectDB();
        console.log("entered into the project deletion");
        const result = await collection.deleteOne({ _id: new ObjectId(projectId) });
        if (result.deletedCount === 1) {
            res.status(200).json({ message: 'Task deleted successfully' });
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (error) {
        console.error('Error deleting task:', error.message);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

app.post('/editVersion/:id', async(req,res) => {
    const versioneditId = req.params.id;
    console.log(versioneditId);
    try {
        const collection = await connectToVersionConnection();
        const { serialNo, versionName, description, startDate, endDate } = req.body;
        const result = await collection.updateOne({ _id: new ObjectId(versioneditId) }, { $set: { serialNo, versionName, description, startDate, endDate } });
        if(result.modifiedCount === 1){
            res.status(200).json({ message: 'Project edited successfully' });
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (error) {
        console.error('Error editing project:', error);
        res.status(500).json({ error: 'Failed to edit project' });
    }
});

app.delete('/deleteVersion/:id', async (req, res) => {
    const versionId = req.params.id;
    try {
        
        const collection = await connectToVersionConnection();
        const result = await collection.deleteOne({ _id: new ObjectId(versionId) });
        
        if (result.deletedCount === 1) {
            res.status(200).json({ message: 'Version deleted successfully' });
        } else {
            res.status(404).json({ error: 'Version not found' });
        }
    } catch (error) {
        console.error('Error deleting version:', error);
        res.status(500).json({ error: 'Failed to delete version' });
    }
});

app.post('/editTestcase/:id', async (req, res) => {
    const testcaseEditId = req.params.id;
    console.log(testcaseEditId);
    try {
        const collection = await connectToTestcaseConnection();
        const { title, input2, input3, input4, input5, input7 } = req.body;
        const result = await collection.updateOne({ _id: new ObjectId(testcaseEditId) }, { $set: { title, input2, input3, input4, input5, input7 } });
        if (result.modifiedCount === 1) {
            res.status(200).json({ message: 'Testcase edited successfully' });
        } else {
            res.status(404).json({ error: 'Testcase not found' });
        }
    } catch (error) {
        console.error('Error editing testcase:', error);
        res.status(500).json({ error: 'Failed to edit testcase' });
    }
});

app.delete('/deleteTestcase/:id', async (req, res) => {
    const testcaseId = req.params.id;
    console.log(testcaseId);
    try {
        
        const collection = await connectToTestcaseConnection();
        const result = await collection.deleteOne({ _id: new ObjectId(testcaseId) });
        
        if (result.deletedCount === 1) {
            res.status(200).json({ message: 'Version deleted successfully' });
        } else {
            res.status(404).json({ error: 'Version not found' });
        }
    } catch (error) {
        console.error('Error deleting version:', error);
        res.status(500).json({ error: 'Failed to delete version' });
    }
});

app.listen(port, () => console.log('Server is listening on port: ' + port));