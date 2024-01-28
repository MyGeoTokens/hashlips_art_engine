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
  'mapping': 1799,
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
  let jsonFiles = fs.readdirSync('build/json').filter(f => path.extname(f) === '.json');

  console.log(`Found ${jsonFiles.length} JSON files.`);

  // Sort the files to get the last one
  jsonFiles.sort();

  // Open the last json file
  let data = JSON.parse(fs.readFileSync(path.join('build/json', jsonFiles[jsonFiles.length - 1])));

  console.log(`Opened last JSON file: ${jsonFiles[jsonFiles.length - 1]}`);

  // Get the image name
  let imageName = data['properties']['files'][0]['uri'];

  console.log(`Image name from last JSON file: ${imageName}`);

  // Copy the image and rename it
  fs.copyFileSync(path.join('build/images', imageName), path.join('build/images', path.basename(jsonFiles[jsonFiles.length - 1], '.json') + '.png'));

  console.log(`Copied and renamed image to: ${path.basename(jsonFiles[jsonFiles.length - 1], '.json')}.png`);

  // Open the template json file
  let template = JSON.parse(fs.readFileSync('template.json'));

  console.log('Opened template.json');

  // Get the current number from the last file name
  let currentNumber = parseInt(path.basename(jsonFiles[jsonFiles.length - 1], '.json'));

  console.log(`Current number: ${currentNumber}`);

  // Increment the number for the new file
  let newNumber = currentNumber + 1;

  console.log(`New number: ${newNumber}`);

  // Update the template with the new number
  template['name'] = `Geo Genesis #${newNumber}`;
  template['image'] = `${newNumber}.png`;
  template['edition'] = newNumber;
  template['properties']['files'][0]['uri'] = `${newNumber}.png`;

  console.log('Updated template with new number');

  // Get the base name of the image file without the extension
  let baseImageName = path.basename(imageName, '.png');

  console.log(`Base image name: ${baseImageName}`);

  // Update the 'Geo' attribute based on the image file name and the randomized distribution
  template['attributes'][0]['value'] = geoMapping[geoArray[newNumber]];

  console.log(`Updated 'Geo' attribute to: ${geoMapping[geoArray[newNumber]]}`);

  // Create a new json file based on the template
  fs.writeFileSync(path.join('build/json', `${newNumber}.json`), JSON.stringify(template, null, 4));

  console.log(`Created new JSON file: ${newNumber}.json`);
  console.log('Script completed.');
} catch (error) {
  console.error(`An error occurred: ${error.message}`);
}