'use strict'

const fs = require('fs-extra');
const path = require('path');
const objinout = require('obj-inout');

const csvAusJson = (jsonObj, zuerstZ = true, leerWert = "---") => { // erstellt aus einem verschachtelten json-Objekt eine csv-Tabelle, zuerstZ -> äußere Attribute bilden die Zeile
  let obj = jsonObj;
  let z1 = "Attr2 \\ Attr1";
  if (!zuerstZ) {
    obj = objinout(obj);
    z1 = "Attr1 \\ Attr2";
  }
  let primitives = false;
  let keys = Object.keys(obj);  // alle vorkommenden Attribute in der 1. Ebene
  z1 = keys.reduce((a, v) => a.concat("," + String(v).replace(/,/g, '-')), z1); // 1. Zeile
  let z = [z1]; // Array aus den einzelnen Zeilen wird am Ende zusammengesetzt, 1. Zeile = z[0]
  // Attribute der 2. Ebene zusammenstellen (Zeilenbeschriftungen)
  let set = new Set([]);  // alle vorkommenden Attribute in der 2. Ebene
  let testPrim = 'typeof obj[key] === "string"';
  keys.forEach((key) => {
    if (eval(testPrim)) {
      primitives = true;
    } else {
      Object.keys(obj[key]).forEach((k) => {
        set.add(k)
      })
    }
  });
  // Falls es primitive Werte gibt, werden diese in die 2. Zeile geschrieben
  let i = 1;  // Zeilenindex, 1. Zeile = z[0]
  if (primitives) {
    i = 2;
    let z2 = "Werte";
    z2 = keys.reduce((a, key) => {
      let val = ",";
      if (eval(testPrim)) val += String(obj[key]).replace(/,/g, '-');
      return a.concat(val);
    }, z2);
    z[1] = z2;
  }
  // Werte mit 2 Schlüsseln in die Tabelle schreiben
  Array.from(set).map((k2) => { // je 1 Zeile pro Attribut der 2. Ebene
    z[i] = String(k2).replace(/,/g, '-'); // Zeile beginnt mit Attribut der 2. Ebene
    z[i] = keys.reduce((a, v) => {  // Werte mit Kommata hinzufügen
      let val = obj[v][k2] || leerWert; // Leer-Wert, falls Schlüssel in diesem Objekt nicht existiert
      if (typeof val === "object") val = JSON.stringify(val);  // Objekte und Arrays in json-Strings umwandeln
      return a.concat("," + String(val).replace(/,/g, '-'));
    }, z[i]);
    i++;  // Index für die nächste Zeile
  });
  return z.join("\r\n");
};
const savejsoncsv = async (namejson = [{ name, json }], savePath = resPath, zuerstZ = false, leerWert = "---") => {
  if (!fs.existsSync(savePath)) fs.mkdirSync(path.resolve(savePath)); // Ergebnispfad erzeugen
  let csv;
  namejson.forEach(async ({ name, json, csv }) => {
    csv = csvAusJson(json, zuerstZ);
    await fs.writeJson(path.join(savePath, name + '.json'), json);
    await fs.writeFile(path.join(savePath, name + '.csv'), csv); // csv-Datei speichern
  });
};
module.exports = savejsoncsv;