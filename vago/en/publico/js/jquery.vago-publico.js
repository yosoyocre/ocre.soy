;(function($, window, document, undefined) {

  'use strict';

  var pluginName = 'vaguizable';

  function getLuminance(r, g, b) {
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }

  function getRandomColor() {
    var r;
    var g;
    var b;
    var rgba;
    var contrast;

    r = Math.floor(Math.random() * 255);
    g = Math.floor(Math.random() * 255);
    b = Math.floor(Math.random() * 255);

    rgba = r + ', ' + g + ', ' + b;

    return rgba;
  }

  function Vaguizable(element, options) {

    var defaults = {
      background: null,
      color: null,
      maxRadius: null,
      image: null
    };

    this.element = element;
    this._defaults = defaults;
    this._name = pluginName;

    this.settings = $.extend({}, defaults, options);

    if (!this.settings.background) {
      this.settings.background = getRandomColor();
    }

    if (!this.settings.color) {
      this.settings.color = getRandomColor();
    }

    this.init();
  }

  $.extend(Vaguizable.prototype, {

    init: function() {

      var _this = this;

      this.canvas = this.element;

      if (!this.settings.maxRadius) {
        this.settings.maxRadius = Math.floor(Math.max(this.canvas.width, this.canvas.height) / 100);
      }

      this.maxX = this.canvas.width / (this.settings.maxRadius * 2);
      this.maxY = this.canvas.height / (this.settings.maxRadius * 2);
      this.matrix = [];

      var auxCanvas = document.createElement('canvas');
      var windowSize = 19;
      var radius = Math.floor(windowSize / 2);
      var ctx = _this.canvas.getContext('2d');
      var path;
      var row = 0;
      var column = 0;
      var i;
      var j;
      var k = 0;
      var wI;
      var wJ;

      auxCanvas.width = _this.canvas.width;
      auxCanvas.height = _this.canvas.height;

      var auxCtx = auxCanvas.getContext('2d');
      auxCtx.fillStyle = 'white';
      auxCtx.fillRect(0, 0, _this.canvas.width, _this.canvas.height);
      auxCtx.fillStyle = 'black';
      auxCtx.font = 'normal 300px fatfrank';
      auxCtx.fillText('IGMIG', 80, 280);
      auxCtx.fillText('+ OCRE', 80, 575);

      auxCtx.textAlign = 'end';
      auxCtx.font = 'normal 200px fatfrank';
      auxCtx.fillText('24.10.15', 1160, 1145);
      auxCtx.fillText('20:30h', 1160, 1320);
      auxCtx.fillText('NAVE 1839', 1160, 1495);
      auxCtx.fillText('A CORUÑA', 1160, 1670);

      var imageData = auxCtx.getImageData(0, 0, _this.canvas.width, _this.canvas.height);
      var iData = imageData.data;
      var matrix = [];
      var averageLuminance;

      for (i = 0; i < iData.length; i += 4) {
        if (!matrix[row]) {
          matrix[row] = [];
        }

        matrix[row][column] = getLuminance(iData[i], iData[i + 1], iData[i + 2]);

        column++;
        if (column >= auxCanvas.width) {
          row++;
          column = 0;
        }
      }

      ctx.fillStyle = _this.settings.background;
      ctx.fillRect(0, 0, _this.canvas.width, _this.canvas.height);
      ctx.fillStyle = _this.settings.color;

      var auxColor;
      var auxColors = [];
      var auxRadius;
      var auxGradientColors = [];
      var progress;

      auxColors[0] = getRandomColor();
      auxColors[1] = getRandomColor();

      auxGradientColors[0] = [];
      auxGradientColors[0][0] = Math.floor(Math.random() * 255);
      auxGradientColors[0][1] = Math.floor(Math.random() * 255);
      auxGradientColors[0][2] = Math.floor(Math.random() * 255);

      auxGradientColors[1] = [];
      auxGradientColors[1][0] = Math.floor(Math.random() * 255);
      auxGradientColors[1][1] = Math.floor(Math.random() * 255);
      auxGradientColors[1][2] = Math.floor(Math.random() * 255);

      for (i = radius; i < (matrix.length - radius); i = i + windowSize) {
        for (j = radius; j < (matrix[i].length - radius); j = j + windowSize) {
          averageLuminance = 0;
          for (wI = -radius; wI <= radius; wI++)  {
            for (wJ = -radius; wJ <= radius; wJ++) {
              averageLuminance += matrix[i + wI][j + wJ];
            }
          }

          averageLuminance = averageLuminance / (windowSize * windowSize);

          progress = (i * matrix[i].length + j) / ((matrix.length * matrix[i].length));

          auxColor = Math.floor(auxGradientColors[0][0] + (auxGradientColors[1][0] - auxGradientColors[0][0]) * progress) + ',' +
            Math.floor(auxGradientColors[0][1] + (auxGradientColors[1][1] - auxGradientColors[0][1]) * progress) + ',' +
            Math.floor(auxGradientColors[0][2] + (auxGradientColors[1][2] - auxGradientColors[0][2]) * progress);

          auxRadius = Math.max(1, (averageLuminance) * radius);

          ctx.fillStyle = 'rgba(' + auxColor + ', 1)';
          path = new Path2D();
          path.arc(j, i, auxRadius, 0, 2 * Math.PI);
          ctx.fill(path);
        }
      }

    },
  });

  $.fn[ pluginName ] = function(options) {
    return this.each(function() {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new Vaguizable(this, options));
      }
    });
  };

})(jQuery, window, document);
