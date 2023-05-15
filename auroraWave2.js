// /*
//   Q Light Controller Plus
//   auroraWave.js
// */

// // Development tool access
// var testAlgo;

// (
//   function()
//   {
//     // Algorithm properties
//     var algo = new Object;
//     algo.apiVersion = 2;
//     algo.name = "Aurora Wave";
//     algo.author = "Bryan Sullivan";
//     algo.properties = new Array();
//     algo.acceptColors = 0;
//     algo.properties.push("name:lastWave1|type:string|display:Last Wave 1|write:setLastWave1|read:getLastWave1");
//     algo.properties.push("name:lastWave2|type:string|display:Last Wave 2|write:setLastWave2|read:getLastWave2");
//     algo.properties.push("name:nextWave1|type:string|display:Next Wave 1|write:setNextWave1|read:getNextWave1");
//     algo.properties.push("name:nextWave2|type:string|display:Next Wave 2|write:setNextWave2|read:getNextWave2");

//     // Utilities
//     var util = new Object;
//     util.initialized = false;
//     util.layerSpacing = 10;
//     util.rgb = 1;
//     util.rgbSteps = 0;
//     util.BLANK_WAVE = "0 00"

//     // Array of Wave objects and their string representations
//     util.nextWaves = [0, 0];
//     util.nextWaveStrings = [util.BLANK_WAVE, util.BLANK_WAVE];
//     util.lastWaves = [0, 0];
//     util.lastWaveStrings = [util.BLANK_WAVE, util.BLANK_WAVE];

//     // Size of the full display in wave steps
//     util.displayStepSize = 0;

//     // Initialize the wave data
//     util.initialize = function(rgb, height) {
//       util.rgb = rgb;
//       util.displayStepSize = (height + 1) * util.layerSpacing;

//       util.lastWaves[0] = util.getWave(
//         util.BLANK_WAVE,
//         util.lastWaveStrings[0]);

//       for (let lw = 1; lw < util.lastWaveStrings.length; lw++) {
//         util.lastWaves[lw] = util.getWave(
//           util.lastWaveStrings[lw - 1], util.lastWaveStrings[lw]);
//       }

//       util.nextWaves[0] = util.getWave(
//         util.lastWaveStrings[util.lastWaveStrings.length - 1],
//         util.nextWaveStrings[0]);

//       for (let nw = 1; nw < util.nextWaves.length; nw++) {
//         util.nextWaves[nw] = util.getWave(
//           util.nextWaveStrings[nw - 1], util.nextWaveStrings[nw]);
//       }

//       util.initialized = true;
//     }

//     // Return a fully-constructed wave with gradients set
//     //
//     // @param {startWaveString} String representing the previous wave
//     // @param {nextWaveString} String representing the next wave
//     // @returns A wave object
//     util.getWave = function(startWaveString, nextWaveString) {
//       let startWave = util.parseWaveString(startWaveString);
//       let nextWave = util.parseWaveString(nextWaveString);
//       let startColor = startWave.color;
//       let endColor = nextWave.color;

//       var sr = (startColor >> 16) & 0x00FF;
//       var sg = (startColor >> 8) & 0x00FF;
//       var sb = startColor & 0x00FF;
//       var er = (endColor >> 16) & 0x00FF;
//       var eg = (endColor >> 8) & 0x00FF;
//       var eb = endColor & 0x00FF;

//       let waveWidth = nextWave.width;
//       nextWave.startStep = util.rgbSteps;
//       util.rgbSteps += waveWidth;
//       nextWave.endStep = util.rgbSteps;

//       nextWave.stepR = ((er - sr) / (waveWidth));
//       nextWave.stepG = ((eg - sg) / (waveWidth));
//       nextWave.stepB = ((eb - sb) / (waveWidth));

//       return nextWave;
//     }


//     // Partially construct a wave
//     //
//     // @param {waveString} String representing the wave
//     util.parseWaveString = function(waveString) {
//       let thisWave = new Object;
//       var waveSplit = waveString.split(' ');
//       thisWave.width = parseInt(Number(waveSplit[0]));
//       thisWave.Color = parseInt(Number("0x" + waveSplit[1]), 10);
//       return thisWave;
//     }

//     algo.rgbMap = function(width, height, rgb, step)
//     {
//       if (util.initialized === false) {
//         util.initialize(rgb, height);
//       }

//       var map = new Array(height);
//       for (var y = 0; y < height; y++)
//       {
//           map[y] = new Array();
//           for (var x = 0; x < width; x++)
//           {
//               var gradPos = step - y * util.layerSpacing;
//               if (gradPos < 0) {
//                 map[y][x] = 0;
//                 // map[y][x] = util.lastGradient[gradPos + util.lastGradient.length];
//               } else {
//                 map[y][x] = 0;
//                 // map[y][x] = util.nextGradient[gradPos];
//               }
//           }
//       }

//       return map;
//     };

//     algo.rgbMapStepCount = function(width, height)
//     {
//       if (util.initialized === false) {
//         util.initialize();
//       }

//       return util.rgbSteps;
//     };

//     // util.setnextWave = function(waveString, position) {
//     //   let thisWave = new Object;
//     //   var waveSplit = waveString.split(' ');
//     //   thisWave.width = parseInt(Number(waveSplit[0]));
//     //   thisWave.Color = parseInt(Number("0x" + waveSplit[1]), 10);
//     //   thisWave.string = waveString;
//     //   util.nextWaves[position] = thisWave;
//     // }

//     algo.setlastWave1 = function(waveString) {
//       util.lastWaveStrings[0] = waveString;
//     }

//     algo.setlastWave2 = function(waveString) {
//       util.lastWaveStrings[1] = waveString;
//     }

//     algo.setNextWave1 = function(waveString) {
//       util.nextWaveStrings[0] = waveString;
//     }

//     algo.setNextWave2 = function(waveString) {
//       util.nextWaveStrings[1] = waveString;
//     }

//     algo.getLastWave1 = function() {
//       return util.lastWaveStrings[0];
//     }

//     algo.getLastWave2 = function() {
//       return util.lastWaveStrings[1];
//     }

//     algo.getNextWave1 = function() {
//       return util.nextWaveStrings[0];
//     }

//     algo.getNextWave2 = function() {
//       return util.nextWaveStrings[1];
//     }

//     // Development tool access
//     testAlgo = algo;
//     return algo;
//     }
// )();
