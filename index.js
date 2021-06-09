let dhlDestinations = require('./dhl.json');
let cost = require('./cost.json');
var country = require('country-list-js'); 

var fs = require('fs');

var constantPath = './zones/';
var arr = [];

fs.readdirSync(constantPath)
  .filter(function (module) {
    return module.slice(module.length - 5) === '.json';
  })
  .forEach(function (module) {
    dhlzones = fs.readFileSync(constantPath + module).toString().split("\n");
    for (zone of dhlzones){
        const land = country.findByName(zone);
        if (land){

        arr.push({
            name: land.name,
            countryCode: land.code.iso3,
            zone: Number(module.replace(".json",'').replace("zone","")),
            kgPrice:cost[module.replace(".json",'')]
        })
        }
    }
  });


console.log(arr);

for (con of dhlDestinations){
if(!arr.find(el => el.countryCode === con)){
    const dhl = country.findByIso3(con);
    if(dhl){
        arr.push({
            name: dhl.name,
            countryCode: dhl.code.iso3,
            zone: 8,
            kgPrice:cost['zone8']
        })
    }
    else{
    console.log(con);
    }
};


}
fs.writeFile("./dhlCosts.json", JSON.stringify(arr), (err) => {
    if (err) {
        console.error(err);
        return;
    };
    console.log("File has been created");
});
