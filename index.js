<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>animethighs</title>
    <meta property="og:title" content="title here noted">
    <meta property="og:type" content="website">
    <meta property="og:image" content="http://blog-imgs-64.fc2.com/y/a/r/yaraon/fm17493.gif">
    <meta property="og:description" content="description here noted">
    <meta property="og:url" content="https://i.redd.it/736g2jmuokn61.png">
    <meta name="theme-color" content="#36cd78">
  <link rel="icon" type="image/png" href="https://i.redd.it/736g2jmuokn61.png">
	<link rel="stylesheet" href="css\rain.css">
    <link rel="stylesheet" href="css\style.css">
    <link rel="stylesheet" href="css\font-awesome.min.css">
  </head>
  <body>
  <script>

  /* exported Particles */
    var Particles = (function(window, document) {
      'use strict';

      var Plugin, Particle = {};

      function particleCompareFunc(p1, p2) {
        if (p1.x < p2.x) {
          return -1;
        } else if (p1.x > p2.x) {
          return 1;
        } else if (p1.y < p2.y) {
          return -1;
        } else if (p1.y > p2.y) {
          return 1;
        }

        return 0;
      }

    /**
     * Represents the plugin.
     *
     * @constructor
     */
      Plugin = (function() {
       function Plugin() {
          var _ = this;

          _.defaults = {
            responsive: null,
            selector: null,
            maxParticles: 100,
            sizeVariations: 3,
            showParticles: true,
            speed: 0.5,
            color: '#000000',
            minDistance: 120,
            connectParticles: false,
          };

          _.element = null;
          _.context = null;
          _.ratio = null;
          _.breakpoints = [];
          _.activeBreakpoint = null;
          _.breakpointSettings = [];
          _.originalSettings = null;
          _.storage = [];
          _.usingPolyfill = false;
        }

        return Plugin;
      }());

    /**
     * Public mehtod to initialize the plugin with user settings.
     *
     * @public
     * @param {object} settings
     */
      Plugin.prototype.init = function(settings) {
        var _ = this;

        _.options = _._extend(_.defaults, settings);
        _.originalSettings = JSON.parse(JSON.stringify(_.options));

        _._animate = _._animate.bind(_);

        _._initializeCanvas();
        _._initializeEvents();
        _._registerBreakpoints();
        _._checkResponsive();
        _._initializeStorage();
        _._animate();

        return _;
      };

    /**
     * Public method to destroy the plugin.
     *
     * @public
     */
      Plugin.prototype.destroy = function() {
        var _ = this;

        _.storage = [];
        _.element.remove();

        window.removeEventListener('resize', _.listener, false);
        window.clearTimeout(_._animation);
        cancelAnimationFrame(_._animation);
      };

    /**
     * Setup the canvas element.
     *
     * @private
     */
      Plugin.prototype._initializeCanvas = function() {
        var _ = this, devicePixelRatio, backingStoreRatio;

        if(!_.options.selector) {
          console.warn('particles.js: No selector specified! Check https://github.com/marcbruederlin/particles.js#options');
          return false;
        }

        _.element = document.querySelector(_.options.selector);
        _.context = _.element.getContext('2d');

        devicePixelRatio = window.devicePixelRatio || 1;
        backingStoreRatio = _.context.webkitBackingStorePixelRatio || _.context.mozBackingStorePixelRatio || _.context.msBackingStorePixelRatio ||
                _.context.oBackingStorePixelRatio || _.context.backingStorePixelRatio || 1;

        _.ratio = devicePixelRatio / backingStoreRatio;
        _.element.width = (_.element.offsetParent) ? _.element.offsetParent.clientWidth * _.ratio : _.element.clientWidth * _.ratio;

        if (_.element.offsetParent && _.element.offsetParent.nodeName === 'BODY') {
          _.element.height = window.innerHeight * _.ratio;
        } else {
         _.element.height = (_.element.offsetParent) ? _.element.offsetParent.clientHeight * _.ratio : _.element.clientHeight * _.ratio;
        }
        _.element.style.width = '100%';
        _.element.style.height = '100%';

        _.context.scale(_.ratio, _.ratio);
      };

    /**
     * Register event listeners.
     *
     * @private
     */
      Plugin.prototype._initializeEvents = function() {
        var _ = this;

        _.listener = function() { _._resize(); }.bind(this);
        window.addEventListener('resize', _.listener, false);
      };

    /**
     * Initialize the particle storage.
     *
     * @private
     */
      Plugin.prototype._initializeStorage = function() {
        var _ = this;

        _.storage = [];

        for(var i = _.options.maxParticles; i--;) {
          _.storage.push(new Particle(_.context, _.options));
        }
      };

    /**
     * Register responsive breakpoints if the user declared some.
     *
     * @private
     */
      Plugin.prototype._registerBreakpoints = function() {
        var _ = this, breakpoint, currentBreakpoint, l, responsiveSettings = _.options.responsive || null;

        if(typeof responsiveSettings === 'object' && responsiveSettings !== null && responsiveSettings.length) {
          for(breakpoint in responsiveSettings) {
            l = _.breakpoints.length - 1;
            currentBreakpoint = responsiveSettings[breakpoint].breakpoint;

            if(responsiveSettings.hasOwnProperty(breakpoint)) {
              while(l >= 0) {
                if(_.breakpoints[l] && _.breakpoints[l] === currentBreakpoint) {
                  _.breakpoints.splice(l, 1);
                }

                l--;
              }

              _.breakpoints.push(currentBreakpoint);
              _.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].options;
            }
          }

          _.breakpoints.sort(function(a, b) {
            return b-a;
          });
        }
      };

    /**
     * Check if a breakpoint is active and load the breakpoints options.
     *
     * @private
     */
      Plugin.prototype._checkResponsive = function() {
        var _ = this, breakpoint, targetBreakpoint = false, windowWidth = window.innerWidth;

        if(_.options.responsive && _.options.responsive.length && _.options.responsive !== null) {
          targetBreakpoint = null;

          for(breakpoint in _.breakpoints) {
            if(_.breakpoints.hasOwnProperty(breakpoint)) {
              if(windowWidth <= _.breakpoints[breakpoint]) {
                targetBreakpoint = _.breakpoints[breakpoint];
              }
            }
          }

          if(targetBreakpoint !== null) {
            _.activeBreakpoint = targetBreakpoint;
            _.options = _._extend(_.options, _.breakpointSettings[targetBreakpoint]);
          } else {
            if(_.activeBreakpoint !== null) {
              _.activeBreakpoint = null;
              targetBreakpoint = null;

              _.options = _._extend(_.options, _.originalSettings);
            }
          }
        }
      };

    /**
     * Rebuild the storage and update the canvas.
     *
     * @private
     */
      Plugin.prototype._refresh = function() {
        var _ = this;

        _._initializeStorage();
        _._draw();
      };

    /**
     * Kick off various things on window resize.
     *
     * @private
     */
      Plugin.prototype._resize = function() {
        var _ = this;

        _.element.width = (_.element.offsetParent) ? _.element.offsetParent.clientWidth * _.ratio : _.element.clientWidth * _.ratio;

        if (_.element.offsetParent && _.element.offsetParent.nodeName === 'BODY') {
          _.element.height = window.innerHeight * _.ratio;
        } else {
          _.element.height = (_.element.offsetParent) ? _.element.offsetParent.clientHeight * _.ratio : _.element.clientHeight * _.ratio;
        }

        _.context.scale(_.ratio, _.ratio);

        clearTimeout(_.windowDelay);

        _.windowDelay = window.setTimeout(function() {
          _._checkResponsive();
          _._refresh();
        }, 50);
      };

    /**
     * Animates the plugin particles by calling the draw method.
     *
     * @private
     */
      Plugin.prototype._animate = function() {
        var _ = this;

        _._draw();
        _._animation = window.requestAnimFrame(_._animate);
      };

    /**
     * Restarts the particles animation by calling _animate.
     *
     * @public
     */
      Plugin.prototype.resumeAnimation = function() {
        var _ = this;

        if (!_._animation) {
          _._animate();
        }
      };

    /**
     * Pauses/stops the particle animation.
     *
     * @public
     */
      Plugin.prototype.pauseAnimation = function() {
        var _ = this;

        if (!_._animation) {
          return;
        }

        if (_.usingPolyfill) {
          window.clearTimeout(_._animation);
        } else {
          var cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame;
          cancelAnimationFrame(_._animation);
        }

        _._animation = null;
      };

    /**
     * Draws the plugin particles.
     *
     * @private
     */
      Plugin.prototype._draw = function() {
        var _ = this,
                element = _.element,
                parentWidth = (element.offsetParent) ? element.offsetParent.clientWidth : element.clientWidth,
                parentHeight = (element.offsetParent) ? element.offsetParent.clientHeight :  element.clientHeight,
                showParticles = _.options.showParticles,
                storage = _.storage;

        if (element.offsetParent && element.offsetParent.nodeName === 'BODY') {
          parentHeight = window.innerHeight;
        }

        _.context.clearRect(0, 0, element.width, element.height);
        _.context.beginPath();

        for(var i = storage.length; i--;) {
          var particle = storage[i];

          if (showParticles) {
            particle._draw();
          }

          particle._updateCoordinates(parentWidth, parentHeight);
        }

        if (_.options.connectParticles) {
          storage.sort(particleCompareFunc);
          _._updateEdges();
        }
      };

    /**
     * Updates the edges.
     *
     * @private
     */
      Plugin.prototype._updateEdges = function() {
        var _ = this,
                minDistance = _.options.minDistance,
                sqrt = Math.sqrt,
                abs = Math.abs,
                storage = _.storage,
                storageLength = storage.length;

        for(var i = 0; i < storageLength; i++) {
          var p1 = storage[i];

          for(var j = i + 1; j < storageLength; j++) {
            var p2 = storage[j],
                    distance, r = p1.x - p2.x, dy = p1.y - p2.y;

            distance = sqrt(r * r + dy * dy);

            if (abs(r) > minDistance) {
              break;
            }

            if (distance <= minDistance) {
              _._drawEdge(p1, p2, (1.2 - distance/minDistance));
            }
          }
        }
    </script>
    </body>
  </html>
