const fs = require('fs');
const uid = require('uid');
const readFile = require('node:fs/promises').readFile;
const writeFile = require('node:fs/promises').writeFile;

// reading from json file
const readData = async (path) => {
  try {
    const data = await readFile(path, 'utf8');
    // console.log(data);
    if (!data || data === undefined || data === null) {
      console.log('file is empty');
      return [];
    }

    // console.log(JSON.parse(data), ' from file');
    const result = JSON.parse(data);
    return result;
  } catch (e) {
    console.log(e);
  }
};

// adding data to json file
const addData = async (path, data) => {
  const newData = {
    id: uid.uid(8),
    name: data.name,
    age: data.age,
  };
  // reading data from the file
  try {
    const initialContent = await readData(path);
    // console.log(initialContent, ' initial content');
    initialContent.push(newData);

    const newContentData = JSON.stringify(initialContent);
    await writeFile(path, newContentData, 'utf-8');

    const newStudent = readData(path).catch((e) => {
      throw new Error(e);
    });

    return newStudent;
  } catch (e) {
    throw new Error(e);
  }
};

// getting student by id
const getById = async (path, id) => {
  try {
    const students = await readData(path);
    if (students.length < 1) {
      return null;
    }
    const studentData = students.find((student) => student.id === id);
    if (!studentData) {
      return null;
    }

    return studentData;
  } catch (e) {
    throw new Error(e);
  }
};

// updating student info
const updateStudentInfo = async (path, id, update) => {
  try {
    const students = await readData(path);
    if (students.length < 1) {
      return null;
    }

    const student = await getById(path, id);
    if (student === null) {
      return null;
    }

    const newInfo = { ...student, name: update.name, age: update.age };
    console.log(newInfo, ' new info ');

    // updating the file
    const studentList = students.filter((student) => student.id !== id);
    studentList.push(newInfo);

    console.log(studentList, 'student list');

    const newContentData = JSON.stringify(studentList);
    await writeFile(path, newContentData, 'utf-8');

    const updatedStudent = await getById(path, id);

    if (updatedStudent === null) {
      return null;
    }

    return updatedStudent;
  } catch (e) {
    throw new Error(e);
  }
};

// deleting a specific student info
const deleteInfo = async (path, id) => {
  try {
    const student = await getById(path, id);
    if (student === null) {
      return null;
    }

    const students = await readData(path);
    if (students.length < 1) {
      return null;
    }

    const newStudentList = students.filter((student) => student.id !== id);

    const newContentData = JSON.stringify(newStudentList);
    await writeFile(path, newContentData, 'utf-8');

    const newStudent = readData(path).catch((e) => {
      throw new Error(e);
    });

    return newStudent;
  } catch (e) {
    throw new Error(e);
  }
};
module.exports = { addData, readData, getById, updateStudentInfo, deleteInfo };
