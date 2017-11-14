;(function($, window, document, undefined) {

  'use strict';

  var pluginName = 'fatigaClip';

  // Constantes
  var MAX_GIFS = 50;
  var WINDOW_SIZE = 7;
  var RADIUS = Math.floor(WINDOW_SIZE / 2);
  var BLACK_LUMINANCE = getLuminance(0, 0, 0);
  var VIDEO_PROB = 1;
  var VIDEO_TIME = 3000;

  var state;
  var cycle = 0;
  var gifs;
  var nGifs = 0;
  var isPlayingAudio = false;
  var isPlayingVideo = false;
  var videoPlaying = 0;

  var currentGif = 0;
  var currentFrame = 0;

  
  function getLuminance(r, g, b) {
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }

  function getContrastWidthBlack(r, g, b) {
    var l1 = getLuminance(r, g, b) + 0.05;
    var l2 = BLACK_LUMINANCE;
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

    contrast = getContrastWidthBlack(r, g, b);

    if (contrast < 2) {
      // Descartamos los colores con poco contraste con el negro

      return getRandomColor();
    }

    return rgba;
  }

  function FatigaClip(element, options) {

    var defaults = {
      background: null,
      color: null,
      maxRADIUS: null,
      reverse: false,
    };

    this.element = element;
    this._defaults = defaults;
    this._name = pluginName;

    this.settings = $.extend({}, defaults, options);

    if (!this.settings.background) {
      this.settings.background = 'black';
    }

    if (!this.settings.color) {
      this.settings.color = getRandomColor();
    }

    this.getRandomColor = getRandomColor;

    this.init();
  }

  $.extend(FatigaClip.prototype, {

    init: function(options) {

      this.img = this.element;

      state = 'start';
      cycle = 0;

      gifs = [];
    },

    getGif: function() {

      var _this = this;
      var options = [];

      if (nGifs < MAX_GIFS) {

        console.log('Obteniendo gif ' + nGifs);

        $.get('obtenGif.php', options, function(data) {
          if (data.code == 'ok') {

            console.log('Adaptando gif...');

            _this.adaptFrame(data.gif, 0);

          } else {
            _this.getGif();
          }
        }, 'json')
          .fail(function() {
            _this.getGif();
          });
      } else {

        //console.log(gifs);

        state = 'playing';
      }

    },

    getFrame: function(img, width, height) {
      var _this = this;

      var canvas;
      var ctx;
      var auxCanvas;
      var auxCtx;
      var imageData;
      var iData;
      var luminanceMatrix;
      var averageLuminance;
      var path;

      var i;
      var j;
      var row = 0;
      var column = 0;
      var wI;
      var wJ;
      var realColumn;


      auxCanvas = document.createElement('canvas');

      auxCanvas.width = width;
      auxCanvas.height = height;

      auxCtx = auxCanvas.getContext('2d');

      auxCtx.drawImage(img, 0, 0, auxCanvas.width, auxCanvas.height);
      imageData = auxCtx.getImageData(0, 0, auxCanvas.width, auxCanvas.height);
      iData = imageData.data;

      luminanceMatrix = [];

      for (i = 0; i < iData.length; i += 4) {
        realColumn = _this.settings.reverse ? auxCanvas.width - column : column;

        if (!luminanceMatrix[row]) {
          luminanceMatrix[row] = [];
        }

        luminanceMatrix[row][realColumn] = getLuminance(iData[i], iData[i + 1], iData[i + 2]);

        column++;
        if (column >= auxCanvas.width) {
          row++;
          column = 0;
        }
      }

      console.log('Dibujando puntos...');

      canvas = document.createElement('canvas');

      canvas.width = width;
      canvas.height = height;

      ctx = canvas.getContext('2d');

      ctx.fillStyle = _this.settings.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = _this.settings.color;

      for (i = RADIUS; i < (luminanceMatrix.length - RADIUS); i = i + WINDOW_SIZE) {
        for (j = RADIUS; j < (luminanceMatrix[i].length - RADIUS); j = j + WINDOW_SIZE) {
          averageLuminance = 0;
          for (wI = -RADIUS; wI <= RADIUS; wI++)  {
            for (wJ = -RADIUS; wJ <= RADIUS; wJ++) {
              averageLuminance += luminanceMatrix[i + wI][j + wJ];
            }
          }

          averageLuminance = averageLuminance / (WINDOW_SIZE * WINDOW_SIZE);

          path = new Path2D();
          path.arc(j, i, Math.max(averageLuminance * RADIUS, 0), 0, 2 * Math.PI);
          ctx.fill(path);
        }
      }

      return canvas.toDataURL();
    },

    adaptFrame: function(gif, adaptingFrame) {

      var _this = this;

      var frames = gif.frames;
      var $img;
      
      if (adaptingFrame >= frames.length) {
        nGifs++;
        _this.settings.color = getRandomColor();
        _this.getGif();
        return;
      }

      console.log('Adaptando frame ' + adaptingFrame + '...');

      $img = $('<img />');
      $img.attr('src', frames[adaptingFrame].url + '?r=' + Math.random());

      $img.imagesLoaded( function() {

        console.log('Calculando luminosidades...');
        
        if (!gifs[nGifs]) {
          gifs[nGifs] = [];
        }

        gifs[nGifs][adaptingFrame] = _this.getFrame($img.get(0), gif.sizes[2], gif.sizes[3]);

        _this.adaptFrame(gif, adaptingFrame + 1);

      }); // imagesLoaded

    }, // adaptFrame

    step: function() {
      var _this = this;

      switch (state) {
        case 'start' :
          console.log('Empezando ejecución...');
          state = 'gettingGifs';
          _this.getGif();
        break;

        case 'gettingGifs':

          this.settings.info.find('span').text(Math.round(nGifs / MAX_GIFS * 100) + '% completado');
          
        break;

        case 'playing':
          var frame;

          if (!isPlayingAudio) {
            this.settings.info.hide();
            this.settings.video1.play();
            this.settings.video2.play();
            this.settings.audio.play();
            isPlayingAudio = true;
          } else {
            if (this.settings.audio.paused) {
                state = 'end';
            }
          }

          //console.log('Reproduciendo frame ' + currentFrame + ' ...');

          if (currentFrame >= gifs[currentGif].length) {
            currentGif = Math.floor(Math.random() * gifs.length);
            currentFrame = 0;

            if (Math.random() < VIDEO_PROB) {
              isPlayingVideo = true;
              videoPlaying = Math.random() > 0.5 ? 1 : 0;
              _this.settings.color = getRandomColor();
              setTimeout(function() {
                isPlayingVideo = false;
                this.settings.video1.currentTime = this.settings.audio.currentTime;
                this.settings.video2.currentTime = this.settings.audio.currentTime;
              }, VIDEO_TIME);
            }
          }

          if (isPlayingVideo) {

            if (videoPlaying) {
              this.img.src = _this.getFrame(this.settings.video1, 600, 543);
            } else {
              this.img.src = _this.getFrame(this.settings.video2, 600, 617);
            }
          } else {
            if (cycle === 0) {
              this.img.src = gifs[currentGif][currentFrame];
              currentFrame++;
            }

            cycle = (cycle + 1) % 10;
          }

        break;

        case 'end':
          this.img.src = '';
          this.settings.credits.show();
        break;
      }

    }

  });

  $.fn[ pluginName ] = function(options) {
    return this.each(function() {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new FatigaClip(this, options));
      }
    });
  };

})(jQuery, window, document);
