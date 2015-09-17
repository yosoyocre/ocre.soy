;(function($, window, document, undefined) {

  'use strict';

  var pluginName = 'vagoenpunto';

  var grayLuminance = getLuminance(200, 200, 200);

  function getLuminance(r, g, b) {
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }

  function getContrastWidthGrey(r, g, b) {
    var l1 = getLuminance(r, g, b) + 0.05;
    var l2 = grayLuminance;
    var ratio = l1 / l2;

    if (l2 > l1) {
      ratio = 1 / ratio;
    }

    return ratio;
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

    rgba = 'rgba(' + r + ', ' + g + ', ' + b + ', 1)';

    contrast = getContrastWidthGrey(r, g, b);

    if (contrast < 2) {
      // Para mejorar la legibilidad de "OCRE es VAGO", descartamos los colores
      // con poco contraste con el gris

      return getRandomColor();
    }

    return rgba;
  }

  function VagoEnPunto(element, options) {

    var defaults = {
      background: null,
      color: null,
      maxRadius: null,
      reverse: false,
    };

    this.element = element;
    this._defaults = defaults;
    this._name = pluginName;

    this.settings = $.extend({}, defaults, options);

    if (!this.settings.background) {
      this.settings.background = getRandomColor();
    }

    this.settings.background = 'white';

    if (!this.settings.color) {
      this.settings.color = getRandomColor();
    }

    this.getRandomColor = getRandomColor;

    this.init();
  }

  $.extend(VagoEnPunto.prototype, {

    init: function() {

      this.canvas = this.element;

      if (!this.settings.maxRadius) {
        this.settings.maxRadius = Math.floor(Math.max(this.canvas.width, this.canvas.height) / 100);
      }

      this.maxX = this.canvas.width / (this.settings.maxRadius * 2);
      this.maxY = this.canvas.height / (this.settings.maxRadius * 2);
      this.matrix = [];
    },

    draw: function() {
      var _this = this;
      var auxCanvas = document.createElement('canvas');
      var windowSize = 7;
      var $video = $('video');
      var video = $video.get(0);
      var relativeWidth;
      var relativeHeight;
      var radius = Math.floor(windowSize / 2);
      var ctx = _this.canvas.getContext('2d');
      var path;
      var row = 0;
      var column = 0;
      var realColumn = 0;
      var i;
      var j;
      var k = 0;
      var wI;
      var wJ;

      // auxCanvas.width = $video.width() / $video.height() * _this.canvas.height;
      // auxCanvas.height = _this.canvas.height;

      auxCanvas.width = _this.canvas.width;
      auxCanvas.height = _this.canvas.height;

      //console.log($video.width(), $video.height(), '=?', _this.canvas.width, _this.canvas.height);

      var auxCtx = auxCanvas.getContext('2d');
      auxCtx.drawImage(video,
        ($video.width() - $video.height()) / 2, 0, $video.height(), $video.height(),
        0, 0, auxCanvas.width, auxCanvas.height);

      var imageData = auxCtx.getImageData(0, 0, auxCanvas.width, auxCanvas.height);
      var iData = imageData.data;
      var matrix = [];
      var averageLuminance;

      for (i = 0; i < iData.length; i += 4) {
        realColumn = _this.settings.reverse ? auxCanvas.width - column : column;

        if (!matrix[row]) {
          matrix[row] = [];
        }

        matrix[row][realColumn] = getLuminance(iData[i], iData[i + 1], iData[i + 2]);

        column++;
        if (column >= auxCanvas.width) {
          row++;
          column = 0;
        }
      }

      ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height);

      ctx.fillStyle = _this.settings.background;
      ctx.fillRect(0, 0, _this.canvas.width, _this.canvas.height);
      ctx.fillStyle = _this.settings.color;

      for (i = radius; i < (matrix.length - radius); i = i + windowSize) {
        for (j = radius; j < (matrix[i].length - radius); j = j + windowSize) {
          averageLuminance = 0;
          for (wI = -radius; wI <= radius; wI++)  {
            for (wJ = -radius; wJ <= radius; wJ++) {
              averageLuminance += matrix[i + wI][j + wJ];
            }
          }

          averageLuminance = averageLuminance / (windowSize * windowSize);

          path = new Path2D();
          path.arc(j, i, (1 - averageLuminance) * radius, 0, 2 * Math.PI);
          ctx.fill(path);
        }
      }
    },
  });

  $.fn[ pluginName ] = function(options) {
    return this.each(function() {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new VagoEnPunto(this, options));
      }
    });
  };

})(jQuery, window, document);
