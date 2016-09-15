(function ($) {

    var Video = function (options) {
            return new Video.Instance(options);
        },
        Canvas = function (options) {
            return new Canvas.Instance(options);
        },
        defaultOptions,
        methods,
        DEBUG_MODE = true;

    function log(message) {
        if (DEBUG_MODE === true) {
            console.log('Meanwhile.js: ' + message);
        }
    }

    Video.STATUS_EMPTY = 'empty';
    Video.STATUS_DOWNLOADING = 'downloading';
    Video.STATUS_READY = 'ready';
    Video.STATUS_PLAYING = 'playing';
    Video.STATUS_PAUSED = 'paused';
    Video.STATUS_ENDED = 'ended';

    Video.Instance = function (options) {
        var self = this;

        this.options = {
            width: 480,
            height: 480,
            id: 'video'
        };

        if (options) {
            $.extend(this.options, options);
        }

        this.element = $('<video />');
        this.element
            .attr({
                'id': this.options.id,
                'preload': 'auto',
                'autobuffer': true,
            })
            .css({
                'display': 'none'
            });

        this.video = this.element.get(0);
        this.video.muted = true;

        this.status = Video.STATUS_EMPTY;

        return this;
    };

    Video.Instance.prototype = {
        drawOnCanvas: function (canvas) {
            canvas.draw(this);
        },

        load: function (sourceUrl, callback) {
            var self = this;

            log('loading ' + this.options.id);

            this.status = Video.STATUS_DOWNLOADING;

            $.ajax({
                url: sourceUrl + '?buffer=' + this.options.id,
                success: function (data) {

                    log('success!');

                    self.element.attr('src', data.video_url);
                    self.status = Video.STATUS_READY;

                    if (callback) {
                        callback();
                    }

                    self = null;
                },
                error: function(jqXHR, textStatus, errorThrown ) {
                    log('error!');
                    log(errorThrown);
                }
            });
        },

        play: function (callback) {
            var self = this;
            this.status = Video.STATUS_PLAYING;
            this.video.play();

            this.element.bind("ended", function () {
                self.status = Video.STATUS_ENDED;
                self.element.unbind("ended");
                self = null;
                if (!!callback) {
                    callback();
                }
            });
        },

        restart: function () {
            this.element.unbind('ended');
            this.status = Video.STATUS_PAUSED;
            this.video.pause();
            this.video.currentTime = 0;
        },

        id: function () {
            return this.options.id;
        },

        width: function () {
            return this.options.width;
        },

        height: function () {
            return this.options.height;
        }
    };

    Canvas.Instance = function (options) {
        var self = this;

        function centerCanvas() {
            self.element.css({
                // Vertically center the square videos
                'margin-top': (($(window).height() - $(window).width()) / 2) + 'px'
            });
        }

        this.options = {
            effect: 'colorChanging',
            effectOpacity: 1,
            cellsPerDimension: 4,
            width: 480,
            height: 480,
            palette: [
                [89, 79, 79],
                [84, 121, 128],
                [69, 173, 168],
                [157, 224, 173],
                [229, 252, 194]
            ]
        };

        if (options) {
            $.extend(this.options, options);
        }

        this.element = $('<canvas />');
        this.backCanvas = this.element.clone();

        this.element
            .css({
                'position': 'absolute',
                'top': 0,
                'left': 0,
                'width': '100%',
                'display': 'block'
            });

        centerCanvas();
        $(window).resize(centerCanvas);

        this.element.get(0).width = this.options.width;
        this.element.get(0).height = this.options.height;
        this.backCanvas.get(0).width = this.options.width;
        this.backCanvas.get(0).height = this.options.height;

        this.context = this.element.get(0).getContext('2d');
        this.backContext = this.backCanvas.get(0).getContext('2d');
        this.timeout = undefined;

        return this;
    };

    Canvas.Instance.prototype = {
        draw: function (video) {
            this.recalculateEffectFactors(this.options.effect);

            if (!!this.options.onDraw) {
                this.options.onDraw({
                    'effect': this.options.effect === 'random' ? Canvas.aux.randomEffect : this.options.effect
                });
            }

            Canvas.utils.drawOneVideo(this, video, this.context, this.backContext, this.options);
        },

        recalculateEffectFactors: function (effect) {
            var i,
                temp = [];

            switch (effect) {

            case 'randomColorTone':
                Canvas.aux.rfactor = Canvas.utils.recalculateFactorArray(Canvas.aux.rfactor);
                Canvas.aux.gfactor = Canvas.utils.recalculateFactorArray(Canvas.aux.gfactor);
                Canvas.aux.bfactor = Canvas.utils.recalculateFactorArray(Canvas.aux.bfactor);
                break;

            case 'random':
                for (i in Canvas.effects) {
                    if (Canvas.effects.hasOwnProperty(i) && i !== 'random') {
                        temp.push(i);
                    }
                }

                Canvas.aux.randomEffect = temp[Math.round(Math.random() * (temp.length - 1))];
                this.recalculateEffectFactors(Canvas.aux.randomEffect);

                break;

            }
        }
    };

    Canvas.utils = {
        findColorDifference: function (dif, dest, src) {
            return (dif * dest + (1 - dif) * src);
        },

        getBrightness: function (r, g, b) {
            return (3 * r + 4 * g + b) >>> 3;
        },

        recalculateFactor: function (factor) {
            return Math.random();
        },

        recalculateFactorArray: function (f) {
            f[0] = Canvas.utils.recalculateFactor(f[0]);
            f[1] = Canvas.utils.recalculateFactor(f[1]);
            f[2] = Canvas.utils.recalculateFactor(f[2]);

            return f;
        },

        drawOneVideo: function (canvas, video, context, backContext, options) {
            var idata;

            if (!!canvas.timeout) {
                clearTimeout(canvas.timeout);
            }

            if (video.status === Video.STATUS_PAUSED || video.status === Video.STATUS_ENDED) {
                return false;
            }

            backContext.drawImage(video.video, 0, 0, options.width, options.height);
            idata = backContext.getImageData(0, 0, options.width, options.height);
            idata.data = Canvas.effects[options.effect](idata.data, canvas);

            context.putImageData(idata, 0, 0);
            // Start over!        
            canvas.timeout = setTimeout(Canvas.utils.drawOneVideo, 20, canvas, video, context, backContext, options);
        }
    };

    Canvas.aux = {
        rfactor: [0.5, 0.5, 0.5],
        gfactor: [0.5, 0.5, 0.5],
        bfactor: [0.5, 0.5, 0.5],
        randomEffect: null
    };

    Canvas.effects = {
        blackAndWhite: function (data, canvas) {

            var i, j,
                r, g, b,
                brightness;

            for (i = 0; i < data.length; i = i + 4) {
                r = data[i];
                g = data[i + 1];
                b = data[i + 2];

                brightness = Canvas.utils.getBrightness(r, g, b);
                brightness = brightness > 128 ? 255 : 0;

                data[i]     = brightness;
                data[i + 1] = brightness;
                data[i + 2] = brightness;
            }

            return data;
        },

        palette: function (data, canvas) {

            var i, j,
                r, g, b,
                brightness;

            for (i = 0; i < data.length; i = i + 4) {
                r = data[i];
                g = data[i + 1];
                b = data[i + 2];

                brightness = Canvas.utils.getBrightness(r, g, b);

                j = Math.floor(brightness * canvas.options.palette.length / 256);

                data[i]     = canvas.options.palette[j][0];
                data[i + 1] = canvas.options.palette[j][1];
                data[i + 2] = canvas.options.palette[j][2];
            }

            return data;
        },

        grayscale: function (data, canvas) {

            var i, j,
                r, g, b,
                brightness;

            for (i = 0; i < data.length; i = i + 4) {
                r = data[i];
                g = data[i + 1];
                b = data[i + 2];

                brightness = Canvas.utils.getBrightness(r, g, b);

                data[i]     = brightness;
                data[i + 1] = brightness;
                data[i + 2] = brightness;
            }

            return data;
        },

        sepia: function (data, canvas) {

            var i, j,
                r, g, b;

            for (i = 0; i < data.length; i = i + 4) {
                r = data[i];
                g = data[i + 1];
                b = data[i + 2];

                data[i]     = Canvas.utils.findColorDifference(canvas.options.effectOpacity, (r * 0.393) + (g * 0.769) + (b * 0.189), r);
                data[i + 1] = Canvas.utils.findColorDifference(canvas.options.effectOpacity, (r * 0.349) + (g * 0.686) + (b * 0.168), g);
                data[i + 2] = Canvas.utils.findColorDifference(canvas.options.effectOpacity, (r * 0.272) + (g * 0.534) + (b * 0.131), b);
            }

            return data;
        },

        randomColorTone: function (data, canvas) {

            var i, j,
                r, g, b;

            for (i = 0; i < data.length; i = i + 4) {
                r = data[i];
                g = data[i + 1];
                b = data[i + 2];

                data[i]     = Canvas.utils.findColorDifference(canvas.options.effectOpacity, (r * Canvas.aux.rfactor[0]) + (g * Canvas.aux.rfactor[1]) + (b * Canvas.aux.rfactor[2]), r);
                data[i + 1] = Canvas.utils.findColorDifference(canvas.options.effectOpacity, (r * Canvas.aux.gfactor[0]) + (g * Canvas.aux.gfactor[1]) + (b * Canvas.aux.gfactor[2]), g);
                data[i + 2] = Canvas.utils.findColorDifference(canvas.options.effectOpacity, (r * Canvas.aux.bfactor[0]) + (g * Canvas.aux.bfactor[1]) + (b * Canvas.aux.bfactor[2]), b);
            }

            return data;

        },

        verticalMirror: function (data, canvas) {

            var i, j, k,
                dataInRow,
                row, column;

            dataInRow = canvas.options.width * 4;

            for (i = 0; i < (data.length / 2); i = i + 4) {
                column = (i % (dataInRow / 2)) / 4;
                row = Math.floor(i / (dataInRow / 2));
                k = row * dataInRow + column * 4;
                j = (row + 1) * dataInRow - (column * 4) - 4;
                data[j] = data[k];
                data[j + 1] = data[k + 1];
                data[j + 2] = data[k + 2];
            }

            return data;
        },

        horizontalMirror: function (data, canvas) {

            var i, j,
                row, column,
                dataInRow;

            dataInRow = canvas.options.width * 4;

            for (i = 0; i < (data.length / 2); i = i + 4) {
                column = (i % dataInRow) / 4;
                row = Math.floor(i / dataInRow);
                j = data.length - (row + 1) * dataInRow + column * 4;

                data[j] = data[i];
                data[j + 1] = data[i + 1];
                data[j + 2] = data[i + 2];
            }

            return data;
        },

        matrix: function (data, canvas) {

            var i, j, k,
                row, column,
                dataInRow,
                dataAux;

            dataAux = [];
            dataInRow = canvas.options.width * 4;
            k = canvas.options.width / canvas.options.cellsPerDimension;

            for (i = 0; i < data.length; i = i + 4) {
                column = (i % dataInRow) / 4;
                row = Math.floor(i / dataInRow);
                j = canvas.options.cellsPerDimension * (column % k) * 4 + dataInRow * canvas.options.cellsPerDimension * (row % k);

                dataAux[i] = data[j];
                dataAux[i + 1] = data[j + 1];
                dataAux[i + 2] = data[j + 2];
                dataAux[i + 3] = data[j + 3];
            }

            // data is a readonly array, so we have to modify one cell each time
            for (i = 0; i < data.length; i = i + 1) {
                data[i] = dataAux[i];
            }

            return data;
        },

        superPixel: function (data, canvas) {

            var i, j;

            for (i = 0; i < data.length; i = i + 4) {
                j = i - i % 64;

                data[i] = data[j];
                data[i + 1] = data[j + 1];
                data[i + 2] = data[j + 2];
                data[i + 3] = data[j + 3];
            }

            return data;
        },

        random: function (data, canvas) {
            Canvas.effects[Canvas.aux.randomEffect](data, canvas);
        }
    };

    function videoLoop(sourceUrl, video1, video2, canvas) {
        var downloading,
            mainVideo,
            bufferVideo;

        log('showing ' + video1.id());

        downloading = video1.status === Video.STATUS_DOWNLOADING;

        if (downloading) {
            log('\twait! it\'s still downloading');
        }
        mainVideo = downloading ? video2 : video1;
        bufferVideo = downloading ? video1 : video2;

        if (downloading) {
            mainVideo.restart();
        }

        log('playing ' + mainVideo.id());

        mainVideo.play(function () {
            log(mainVideo.id() + ' ended');
            videoLoop(sourceUrl, bufferVideo, mainVideo, canvas);
        });

        canvas.draw(mainVideo);

        if (!downloading) {
            bufferVideo.load(sourceUrl);
        }
    }

    defaultOptions = {
        sourceUrl: null,
        onDraw: undefined
    };
    methods = {
        init: function (options) {
            var that = this;

            if (options) {
                $.extend(defaultOptions, options);
            }

            return this.each(function () {
                var $this = $(this),
                    video1 = new Video({
                        id: 'video_1'
                    }),
                    video2 = new Video({
                        id: 'video_2'
                    }),
                    canvas = new Canvas({
                        effect: options.effect,
                        onDraw: options.onDraw
                    });

                $this.append(video1.element).append(video2.element).append(canvas.element);

                video1.load(options.sourceUrl, function () {
                    videoLoop(options.sourceUrl, video1, video2, canvas);
                });
            });
        }
    };

    $.fn.meanwhile = function (method) {

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }

        if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }

        $.error('Method ' +  method + ' does not exist on jQuery.meanwhile');
    };

}(jQuery));