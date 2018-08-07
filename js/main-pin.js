'use strict';

(function () {
  // constants
  var MAIN_PIN_MIN_Y_POSITION = 130;
  var MAIN_PIN_MAX_Y_POSITION = 630;

  // global
  var renderPins = window.pin.renderPins;
  var showCard = window.card.show;

  // elements
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');

  // export
  // drag and drop
  window.mainPin = {
    mainPinMouseDown: function (downEvt, setAdress, turnOnPage) {
      var startCoords = {
        x: downEvt.clientX,
        y: downEvt.clientY
      };

      var mainPinCoordsMouseMoveHandler = function (moveEvt) {
        moveEvt.preventDefault();
        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };

        if (mainPin.offsetLeft < 0) {
          mainPin.style.left = 0 + 'px';
        } else if (mainPin.offsetLeft + mainPin.offsetWidth > map.offsetWidth) {
          mainPin.style.left = map.offsetWidth - mainPin.offsetWidth + 'px';
        } else {
          mainPin.style.left = mainPin.offsetLeft - shift.x + 'px';
        }

        if (mainPin.offsetTop < MAIN_PIN_MIN_Y_POSITION) {
          mainPin.style.top = MAIN_PIN_MIN_Y_POSITION + 'px';
        } else if (mainPin.offsetTop > MAIN_PIN_MAX_Y_POSITION) {
          mainPin.style.top = MAIN_PIN_MAX_Y_POSITION + 'px';
        } else {
          mainPin.style.top = mainPin.offsetTop - shift.y + 'px';
        }
      };

      var mainPinCoordsMouseUpHandler = function (upEvt) {
        if (window.form.pageState) {
          upEvt.preventDefault();
          setAdress();

          document.removeEventListener(
              'mousemove',
              mainPinCoordsMouseMoveHandler
          );
          document.removeEventListener('mouseup', mainPinCoordsMouseUpHandler);
        } else {
          upEvt.preventDefault();
          turnOnPage();
          renderPins(showCard);

          document.removeEventListener(
              'mousemove',
              mainPinCoordsMouseMoveHandler
          );
          document.removeEventListener('mouseup', mainPinCoordsMouseUpHandler);
        }
      };

      document.addEventListener('mousemove', mainPinCoordsMouseMoveHandler);
      document.addEventListener('mouseup', mainPinCoordsMouseUpHandler);
    }
  };
})();
