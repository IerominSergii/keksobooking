'use strict';

(function () {
  // import
  var renderPins = window.pin.renderPins;
  var setAdressByPin = window.form.setAdressByPin;
  var activatePage = window.form.activatePage;

  // constants
  var MAIN_PIN_MIN_Y_POSITION = 130;
  var MAIN_PIN_MAX_Y_POSITION = 630;

  // elements
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');

  // handlers
  // drag and drop
  var mainPinMousedownHandler = function (downEvt) {
    var startCoords = {
      x: downEvt.clientX,
      y: downEvt.clientY,
    };

    var mainPinCoordsMouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY,
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY,
      };

      if (mainPin.offsetLeft < 0) {
        mainPin.style.left = 0 + 'px';
      } else if ((mainPin.offsetLeft + mainPin.offsetWidth) > map.offsetWidth) {
        mainPin.style.left = (map.offsetWidth - mainPin.offsetWidth) + 'px';
      } else {
        mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
      }

      if (mainPin.offsetTop < MAIN_PIN_MIN_Y_POSITION) {
        mainPin.style.top = MAIN_PIN_MIN_Y_POSITION + 'px';
      } else if (mainPin.offsetTop > MAIN_PIN_MAX_Y_POSITION) {
        mainPin.style.top = MAIN_PIN_MAX_Y_POSITION + 'px';
      } else {
        mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
      }
    };

    var mainPinCoordsMouseUpHandler = function (upEvt) {
      if (window.form.pageState) {
        upEvt.preventDefault();
        setAdressByPin();

        document.removeEventListener('mousemove', mainPinCoordsMouseMoveHandler);
        document.removeEventListener('mouseup', mainPinCoordsMouseUpHandler);
      } else {
        upEvt.preventDefault();
        activatePage();
        setAdressByPin();
        renderPins();

        document.removeEventListener('mousemove', mainPinCoordsMouseMoveHandler);
        document.removeEventListener('mouseup', mainPinCoordsMouseUpHandler);
      }

    };

    document.addEventListener('mousemove', mainPinCoordsMouseMoveHandler);
    document.addEventListener('mouseup', mainPinCoordsMouseUpHandler);
  };

  mainPin.addEventListener('mousedown', mainPinMousedownHandler);
})();
