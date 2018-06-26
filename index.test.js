const fs = require('fs-extra');
const path = require('path');

const { savejsoncsv } = require('./index.js');


const name = "test1";
const savePath = "/home/micha/Schreibtisch/tests/jsonZuCsv";

const check = async () => {
  console.log('--- Starting tests');
  const json = { "a": {"c":"1"}, "b": {"c":"2"} };
  const zuerstZ = false;
  await savejsoncsv([{ name, json }], savePath, zuerstZ);
};
check().then(() => {
  const jsonPath = path.join(savePath, name + '.json');
  const csvPath = path.join(savePath, name + '.csv');
  if (!fs.existsSync(jsonPath) || !fs.existsSync(csvPath)) {
    throw new Error('savejsoncsv funktioniert nicht!');
  } else {
    console.log('ok savejsoncsv');
  };
  console.log('--- End tests');
});


