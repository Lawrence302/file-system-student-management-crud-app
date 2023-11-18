const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const addData = require('./src/fileOperations.js').addData;
const readData = require('./src/fileOperations.js').readData;
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

app.listen(port, () => {
  console.log(`app listening on port ${port}...`);
});
