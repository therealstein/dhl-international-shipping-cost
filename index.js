let dhlDestinations = require('./dhl.json');
let cost = require('./cost.json');
let euVatList = require('./euVat.json');
var country = require('country-list-js'); 

var fs = require('fs');

var constantPath = './zones/';
var arr = [];

var paypalCountries = fs.readFileSync('./paypal.txt').toString().split("\n");
var stripeCountries = fs.readFileSync('./stripe.txt').toString().split("\n");


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
            countryCode2: land.code.iso2,
            euVAT: (euVatList.find(el => el.Code === land.code.iso2)) ? (euVatList.find(el => el.Code === land.code.iso2).Rate) : 0,
            paypal: (paypalCountries.find(el => el === land.code.iso2))?(true):(false),
            stripe: (stripeCountries.find(el => el === land.code.iso2))?(true):(false),
            zone: Number(module.replace(".json",'').replace("zone","")),
            kgPrice:cost[module.replace(".json",'')]
        })
        }
    }
  });



for (con of dhlDestinations){
if(!arr.find(el => el.countryCode === con)){
    const dhl = country.findByIso3(con);
    if(dhl){
        arr.push({
            name: dhl.name,
            countryCode: dhl.code.iso3,
            countryCode2: dhl.code.iso2,
            euVAT: 0,
            paypal: (paypalCountries.find(el => el === dhl.code.iso2))?(true):(false),
            stripe: (stripeCountries.find(el => el === dhl.code.iso2))?(true):(false),
            zone: 8,
            kgPrice:cost['zone8']
        })
    }
    else{
    console.log(con);
    }
};
}

for (const land of arr){
  console.log("thee",land.name)
fs.writeFile(`./countries/${land.name.replace(" ","-")}.json`, JSON.stringify(land), (err) => {
    if (err) {
        console.error(err);
        return;
    };
    console.log("File has been created");
});
}
