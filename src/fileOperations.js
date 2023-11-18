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

module.exports = { addData, readData };
