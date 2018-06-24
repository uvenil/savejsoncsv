# savejsoncsv Module

const savejsoncsv = require('savejsoncsv');

savejsoncsv(namejson = [{ name, json }], savePath, zuerstZ)

Saves an object of objects as json and as csv.
Creates 2 files:
- savePath + name + ".json"
- savePath + name + ".csv"

Example: 
{ "a": {"c":"1"}, "b": {"c":"2"} }
 -> (zuerstZ = false) default
Attr1 \ Attr2,c
a,1
b,2
 -> (zuerstZ = true) 
Attr2 \ Attr1,a,b
c,1,2