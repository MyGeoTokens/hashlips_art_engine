const fs = require('fs');
const path = require('path');

// Define the mapping of file names to 'Geos'
const geoMapping = {
  'mapping': 'Mapping Geo',
  'potus': 'POTUS Geo',
  'cliff_hanger': 'Cliff Hanger Geo',
  'globe': 'Globe Geo',
  'luna': 'Luna Geo'
};

// Define the distribution of 'Geos'
const geoDistribution = {
  'mapping': 1800,
  'potus': 900,
  'cliff_hanger': 450,
  'globe': 150,
  'luna': 33
};

// Create an array of 'Geos' based on the distribution
let geoArray = [];
for (let geo in geoDistribution) {
  for (let i = 0; i < geoDistribution[geo]; i++) {
    geoArray.push(geo);
  }
}

// Function to shuffle an array
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Shuffle the array of 'Geos'
geoArray = shuffle(geoArray);

console.log('Starting script...');

try {
  // Get the list of json files
  let jsonFiles = fs.readdirSync('build/json_gifs').filter(f => path.extname(f) === '.json');

  console.log(`Found ${jsonFiles.length} JSON files.`);

  // Sort the files to get the last one
  jsonFiles.sort();

  // Get the current number from the last file name
  let currentNumber = parseInt(path.basename(jsonFiles[jsonFiles.length - 1], '.json'));

  console.log(`Current number: ${currentNumber}`);

  // Loop to generate 3333 files
  for (let i = 0; i < 3333; i++) {
    // Increment the number for the new file
    let newNumber = currentNumber + i + 1;

    console.log(`New number: ${newNumber}`);

    // Open the last json file
    let data = JSON.parse(fs.readFileSync(path.join('build/json_gifs', `${currentNumber + i}.json`)));

    console.log(`Opened JSON file: ${currentNumber + i}.json`);

    // Open the template json file
    let template = JSON.parse(fs.readFileSync('custom_scripts/template_gifs.json'));

    console.log('Opened template_gifs.json');

    // Update the template with the new number
    template['name'] = `Geo Genesis #${newNumber}`;
    template['image'] = `${newNumber}.gif`;
    template['edition'] = newNumber;
    template['properties']['files'][0]['uri'] = `${newNumber}.gif`;

    console.log('Updated template with new number');

    // Update the 'Geo' attribute based on the image file name and the randomized distribution
    let geoValue = geoMapping[geoArray[newNumber % geoArray.length]];
    template['attributes'][0]['value'] = geoValue;

    console.log(`Updated 'Geo' attribute to: ${geoValue}`);

    // Copy the image that matches the 'Geo' attribute and rename it
    let geoKey = Object.keys(geoMapping).find(key => geoMapping[key] === geoValue);
    fs.copyFileSync(path.join('custom_scripts/gifs', `${geoKey}.gif`), path.join('build/gifs', `${newNumber}.gif`));

    console.log(`Copied and renamed image to: ${newNumber}.gif`);

    // Create a new json file based on the template
    fs.writeFileSync(path.join('build/json_gifs', `${newNumber}.json`), JSON.stringify(template, null, 4));

    console.log(`Created new JSON file: ${newNumber}.json`);
  }

  console.log('Script completed.');
} catch (error) {
  console.error(`An error occurred: ${error.message}`);
}