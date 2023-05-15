/*
  Q Light Controller Plus
  auroraWave.js
*/

// Development tool access
var testAlgo;

(
  function()
  {
    // Algorithm properties
    var algo = new Object;
    algo.apiVersion = 2;
    algo.name = "BAurora Wave";
    algo.author = "Bryan Sullivan";
    algo.properties = new Array();
    algo.acceptColors = 0;
    algo.waveWidth = 150;
    algo.properties.push("name:prevWave1|type:string|display:Prev Wave 1|write:setPrevWave1|read:getPrevWave1");
    algo.properties.push("name:prevWave2|type:string|display:Prev Wave 2|write:setPrevWave2|read:getPrevWave2");
    algo.properties.push("name:prevWave3|type:string|display:Prev Wave 3|write:setPrevWave3|read:getPrevWave3");
    algo.properties.push("name:nextWave1|type:string|display:Next Wave 1|write:setNextWave1|read:getNextWave1");
    algo.properties.push("name:nextWave2|type:string|display:Next Wave 2|write:setNextWave2|read:getNextWave2");
    algo.properties.push("name:nextWave3|type:string|display:Next Wave 3|write:setNextWave3|read:getNextWave3");
    algo.properties.push("name:nextWave4|type:string|display:Next Wave 4|write:setNextWave4|read:getNextWave4");
    algo.properties.push("name:nextWave5|type:string|display:Next Wave 5|write:setNextWave5|read:getNextWave5");
    algo.properties.push("name:nextWave6|type:string|display:Next Wave 6|write:setNextWave6|read:getNextWave6");
    algo.properties.push("name:nextWave7|type:string|display:Next Wave 7|write:setNextWave7|read:getNextWave7");
    algo.properties.push("name:nextWave8|type:string|display:Next Wave 8|write:setNextWave8|read:getNextWave8");
    algo.properties.push("name:nextWave9|type:string|display:Next Wave 9|write:setNextWave9|read:getNextWave9");
    algo.properties.push("name:nextWave10|type:string|display:Next Wave 10|write:setNextWave10|read:getNextWave10");
    algo.properties.push("name:nextWave11|type:string|display:Next Wave 11|write:setNextWave11|read:getNextWave11");
    algo.properties.push("name:nextWave12|type:string|display:Next Wave 12|write:setNextWave12|read:getNextWave12");
    algo.properties.push("name:nextWave13|type:string|display:Next Wave 13|write:setNextWave13|read:getNextWave13");
    algo.properties.push("name:nextWave14|type:string|display:Next Wave 14|write:setNextWave14|read:getNextWave14");
    algo.properties.push("name:nextWave15|type:string|display:Next Wave 15|write:setNextWave15|read:getNextWave15");
    algo.properties.push("name:nextWave16|type:string|display:Next Wave 16|write:setNextWave16|read:getNextWave16");
    algo.properties.push("name:nextWave17|type:string|display:Next Wave 17|write:setNextWave17|read:getNextWave17");
    algo.properties.push("name:nextWave18|type:string|display:Next Wave 18|write:setNextWave18|read:getNextWave18");
    algo.properties.push("name:nextWave19|type:string|display:Next Wave 19|write:setNextWave19|read:getNextWave19");
    algo.properties.push("name:nextWave20|type:string|display:Next Wave 20|write:setNextWave20|read:getNextWave20");
    algo.properties.push("name:layerSpacing|type:range|display:Leyer Spacing|values:1,50|write:setLayerSpacing|read:getLayerSpacing");

    // Utilities
    var util = new Object;
    util.initialized = false;
    util.layerSpacing = 10;
    util.rgb = 1;
    // prevWaveColors is longer so that the last color is always 0
    util.prevWaveWidths = [0, 0, 0];
    util.prevWaveColors = [0, 0, 0, 0];
    util.prevWaveStrings = ["", "", ""];
    util.nextWaveWidths = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    util.nextWaveColors = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    util.nextWaveStrings = ["", "", ""];
    // Number of steps needed to fill the display (height * layerSpacing)
    util.displayStepSize = 0;

    // Gradient data
    util.nextGradient = new Array();
    util.lastGradient = new Array();

    util.initialize = function(rgb, height) {
      util.rgb = rgb;
      util.displayStepSize = (height + 1) * util.layerSpacing;
      util.initializeGradient();
      util.initialized = true;
    }

    util.initializeGradient = function() {
      util.nextGradient = new Array();
      util.lastGradient = new Array();
      for (i = 0; i < util.nextWaveWidths.length; i++) {
        util.nextGradient = util.nextGradient.concat(
          util.constructGradient(
            i > 0
              ? util.nextWaveColors[i - 1]
              : util.prevWaveColors[0],
            util.nextWaveColors[i],
            util.nextWaveWidths[i]));
      }
            
      for (i = 0; i < util.prevWaveWidths.length; i++) {
        util.lastGradient = util.lastGradient.concat(
          util.constructGradient(
            util.prevWaveColors[i],
            util.prevWaveColors[i + 1],
            util.prevWaveWidths[i]));
      }

      // Fill up the rest of the gradient with zeros
      if (util.lastGradient.length < util.displayStepSize) {
        var nextGradient = util.constructGradient(
          0,
          0,
          util.displayStepSize - util.lastGradient.length);
        util.lastGradient = util.lastGradient.concat(nextGradient);
      }
    }

    util.constructGradient = function(startColor, endColor, waveWidth) {
      var sr = (startColor >> 16) & 0x00FF;
      var sg = (startColor >> 8) & 0x00FF;
      var sb = startColor & 0x00FF;
      var er = (endColor >> 16) & 0x00FF;
      var eg = (endColor >> 8) & 0x00FF;
      var eb = endColor & 0x00FF;

      var stepR = ((er - sr) / (waveWidth));
      var stepG = ((eg - sg) / (waveWidth));
      var stepB = ((eb - sb) / (waveWidth));

      var gradient = new Array();

      for (var s = 0; s < waveWidth; s++)
      {
        var gradR = Math.floor(sr + (stepR * s)) & 0x00FF;
        var gradG = Math.floor(sg + (stepG * s)) & 0x00FF;
        var gradB = Math.floor(sb + (stepB * s)) & 0x00FF;
        var gradRGB = (gradR << 16) + (gradG << 8) + gradB;
        gradient[s] = gradRGB;
      }
      return gradient;
    }

    algo.rgbMap = function(width, height, rgb, step)
    {
      if (step === 0) {
        util.initialize(rgb, height);
      }

      var map = new Array(height);
      for (var y = 0; y < height; y++)
      {
          map[y] = new Array();
          for (var x = 0; x < width; x++)
          {
              var gradPos = step - y * util.layerSpacing;
              if (gradPos < 0) {
                map[y][x] = util.lastGradient[-gradPos];
              } else {
                map[y][x] = util.nextGradient[gradPos];
              }
          }
      }

      return map;
    };

    algo.rgbMapStepCount = function(width, height)
    {
      if (util.initialized === false) {
        util.initialize();
      }
      return util.nextGradient.length;
    };

    util.setnextWave = function(waveString, position) {
      var waveSplit = waveString.split(' ');
      util.nextWaveStrings[position] = waveString;
      util.nextWaveWidths[position] = parseInt(Number(waveSplit[0]));
      util.nextWaveColors[position] = parseInt(Number("0x" + waveSplit[1]), 10);
    }

    util.setPrevWave = function(waveString, position) {
      var waveSplit = waveString.split(' ');
      util.prevWaveStrings[position] = waveString;
      util.prevWaveWidths[position] = parseInt(Number(waveSplit[0]));
      util.prevWaveColors[position] = parseInt(Number("0x" + waveSplit[1]), 10);
    }

    algo.setPrevWave1 = function(waveString) {
      util.setPrevWave(waveString, 0);
    }

    algo.getPrevWave1 = function() {
      return util.prevWaveStrings[0];
    }

    algo.setPrevWave2 = function(waveString) {
      util.setPrevWave(waveString, 1);
    }

    algo.getPrevWave2 = function() {
      return util.prevWaveStrings[1];
    }

    algo.setPrevWave3 = function(waveString) {
      util.setPrevWave(waveString, 2);
    }

    algo.getPrevWave3 = function() {
      return util.prevWaveStrings[2];
    }

    algo.setNextWave1 = function(waveString) {
      util.setnextWave(waveString, 0);
    }

    algo.getNextWave1 = function() {
      return util.nextWaveStrings[0];
    }

    algo.setNextWave2 = function(waveString) {
      util.setnextWave(waveString, 1);
    }

    algo.getNextWave2 = function() {
      return util.nextWaveStrings[1];
    }

    algo.setnextWave3 = function(waveString) {
      util.setnextWave(waveString, 2);
    }

    algo.getnextWave3 = function() {
      return util.nextWaveStrings[2];
    }

    algo.setNextWave4 = function(waveString) {
      util.setnextWave(waveString, 3);
    }

    algo.getNextWave4 = function() {
      return util.nextWaveStrings[3];
    }

    algo.setNextWave5 = function(waveString) {
      util.setnextWave(waveString, 4);
    }

    algo.getNextWave5 = function() {
      return util.nextWaveStrings[4];
    }

    algo.setnextWave6 = function(waveString) {
      util.setnextWave(waveString, 5);
    }

    algo.getnextWave6 = function() {
      return util.nextWaveStrings[5];
    }

    algo.setNextWave7 = function(waveString) {
      util.setnextWave(waveString, 6);
    }

    algo.getNextWave7 = function() {
      return util.nextWaveStrings[6];
    }

    algo.setNextWave8 = function(waveString) {
      util.setnextWave(waveString, 7);
    }

    algo.getNextWave8 = function() {
      return util.nextWaveStrings[7];
    }

    algo.setnextWave9 = function(waveString) {
      util.setnextWave(waveString, 8);
    }

    algo.getnextWave9 = function() {
      return util.nextWaveStrings[8];
    }

    algo.setNextWave10 = function(waveString) {
      util.setnextWave(waveString, 9);
    }

    algo.getNextWave10 = function() {
      return util.nextWaveStrings[9];
    }

    algo.setNextWave11 = function(waveString) {
      util.setnextWave(waveString, 10);
    }

    algo.getNextWave11 = function() {
      return util.nextWaveStrings[10];
    }

    algo.setnextWave12 = function(waveString) {
      util.setnextWave(waveString, 11);
    }

    algo.getnextWave12 = function() {
      return util.nextWaveStrings[11];
    }

    algo.setNextWave13 = function(waveString) {
      util.setnextWave(waveString, 12);
    }

    algo.getNextWave13 = function() {
      return util.nextWaveStrings[12];
    }

    algo.setnextWave14 = function(waveString) {
      util.setnextWave(waveString, 13);
    }

    algo.getnextWave14 = function() {
      return util.nextWaveStrings[13];
    }

    algo.setNextWave15 = function(waveString) {
      util.setnextWave(waveString, 14);
    }

    algo.getNextWave15 = function() {
      return util.nextWaveStrings[14];
    }

    algo.setNextWave16 = function(waveString) {
      util.setnextWave(waveString, 15);
    }

    algo.getNextWave16 = function() {
      return util.nextWaveStrings[15];
    }

    algo.setnextWave17 = function(waveString) {
      util.setnextWave(waveString, 16);
    }

    algo.getnextWave17 = function() {
      return util.nextWaveStrings[16];
    }

    algo.setNextWave18 = function(waveString) {
      util.setnextWave(waveString, 17);
    }

    algo.getNextWave18 = function() {
      return util.nextWaveStrings[17];
    }

    algo.setNextWave19 = function(waveString) {
      util.setnextWave(waveString, 18);
    }

    algo.getNextWave19 = function() {
      return util.nextWaveStrings[18];
    }

    algo.setnextWave20 = function(waveString) {
      util.setnextWave(waveString, 19);
    }

    algo.getnextWave20 = function() {
      return util.nextWaveStrings[19];
    }

    algo.setLayerSpacing = function(inputLayerSpacing) {
      util.layerSpacing = inputLayerSpacing;
    }

    algo.getLayerSpacing = function() {
      return util.layerSpacing;
    }

    // Development tool access
    testAlgo = algo;
    return algo;
    }
)();
