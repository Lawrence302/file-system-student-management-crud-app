const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const { deleteInfo } = require('./src/fileOperations.js');
const getById = require('./src/fileOperations.js').getById;
const addData = require('./src/fileOperations.js').addData;
const readData = require('./src/fileOperations.js').readData;
const updateStudentInfo = require('./src/fileOperations.js').updateStudentInfo;
const app = express();
const port = 3000;

// using middle wares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//////////
app.get('/', (req, res) => {
  res.send('home route');
});

// getting all the students
app.get('/students', async (req, res) => {
  try {
    const students = await readData('./person.json');
    if (students.length < 1) {
      return res.status(200).send([]);
    }

    res.status(200).send(students);
  } catch (e) {
    res.send(e);
  }
});

// registering  a student
app.post('/students', async (req, res) => {
  console.log(req.body);
  try {
    if (!req.body.name || !req.body.age) {
      return res.status(400).send('sorry name and age required');
    }
    const studentInfo = {
      name: req.body.name.trim(),
      age: req.body.age,
    };

    const updatedStudents = await addData('./person.json', studentInfo);
    return res.status(201).send(updatedStudents);
  } catch (e) {
    res.send(e);
  }
});

app.get('/students/:id', async (req, res) => {
  // console.log('called');
  try {
    if (!req.params.id) {
      return res.status(400).send('user id is required');
    }

    const student = await getById('./person.json', req.params.id);
    // console.log(student);
    if (student === null) {
      return res
        .status(404)
        .send(`student with id  "${req.params.id}" not found`);
    }

    res.status(200).send(student);
  } catch (e) {
    res.status(500).send(e);
  }
});

// updating student record
app.put('/students/:id', async (req, res) => {
  // console.log('put called');
  try {
    if (!req.params.id) {
      return res.status(400).send('user id is required');
    }

    if (!req.body.name || !req.body.age) {
      return res.status(400).send('name and age required');
    }

    const newData = { name: req.body.name, age: req.body.age };

    const student = await getById('./person.json', req.params.id);
    // console.log(student);
    if (student === null) {
      return res
        .status(404)
        .send(`student with id  "${req.params.id}" not found`);
    }

    const updatedData = await updateStudentInfo(
      './person.json',
      req.params.id,
      newData
    );

    if (updatedData === null) {
      return res.status(400).send('update failed');
    }

    res.status(200).send(updatedData);
  } catch (e) {
    res.status(500).send(e);
  }
});

/// deleting student record
app.delete('/students/:id', async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).send('user id is required');
    }

    const student = await getById('./person.json', req.params.id);
    if (student === null) {
      return res
        .status(400)
        .send(`student with id ${req.params.id} was not found`);
    }

    const updatedStudents = await deleteInfo('./person.json', req.params.id);
    if (updatedStudents === null) {
      return res.status(200).send('delete process failed');
    }

    return res.status(200).send(updatedStudents);
  } catch (e) {
    res.status(500).send(e);
  }
});

//////////////////////////////////
app.listen(port, () => {
  console.log(`app listening on port ${port}...`);
});
