/*
  Q Light Controller Plus
  stripes.js

  Copyright (c) Massimo Callegari

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0.txt

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

// Development tool access
var testAlgo;

(
  function()
  {
    var algo = new Object;
    algo.apiVersion = 2;
    algo.name = "Pause Stripe";
    algo.author = "Eckleburg";

    algo.pauseSize = 0;
    algo.properties = new Array();
    algo.properties.push("name:pauseSize|type:range|display:PauseSize|values:1,20|write:setPause|read:getPause");

    algo.setPause = function(_pause)
    {
      algo.pauseSize = parseInt(_pause);
    };

    algo.getPause = function()
    {
      return algo.pauseSize;
    };

    algo.rgbMap = function(width, height, rgb, step)
    {
      var endRowStep = height + algo.pauseSize - 1;
      var map = new Array(height);
      for (var y = 0; y < height; y++)
      {
          map[y] = new Array();
          for (var x = 0; x < width; x++)
          {
            if ((y === 0 && step <= algo.pauseSize) // Pause at the beginning
              || (y === (step - algo.pauseSize)) // Follow step count upward
              || ((y === (height - 1)) && (step > endRowStep))) { // Pause at the end
                  map[y][x] = rgb;
            } else {
                map[y][x] = 0;
            }
          }
      }

      return map;
    };

    algo.rgbMapStepCount = function(width, height)
    {
      return height + (2 * algo.pauseSize);
    };

    // Development tool access
    testAlgo = algo;

    return algo;
  }
)();
