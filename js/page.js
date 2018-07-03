'use strict';

(function () {
  // import
  var setInitialStateForForm = window.form.setInitialStateForForm;
  var makeFormActive = window.form.makeFormActive;
  var makeFormDisabled = window.form.makeFormDisabled;
  var addFormHandlers = window.form.addFormHandlers;
  var showPopup = window.form.showPopup;
  var setAdressByPin = window.form.setAdressByPin;
  var closeCard = window.card.closeCard;
  var mainPinMouseDown = window.mainPin.mainPinMouseDown;

  // elements
  var noticeSection = document.querySelector('.notice');
  var adFormReset = noticeSection.querySelector('.ad-form__reset');
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');

  // functions
  var activateMap = function () {
    map.classList.remove('map--faded');
  };

  var deactivateMap = function () {
    map.classList.add('map--faded');
    closeCard();
  };

  var deactivatePage = function () {
    window.form.pageState = false;
    deactivateMap();
    makeFormDisabled();
    setInitialStateForForm();
  };

  var activatePage = function () {
    window.form.pageState = true;
    activateMap();
    makeFormActive();
  };

  var mainPinMouseDownHandler = function (downEvt) {
    mainPinMouseDown(downEvt, setAdressByPin, activatePage);
  };

  var formButtonSubmitHandler = function () {
    deactivatePage();
    showPopup();
    setInitialStateForForm();
  };

  var resetButtonClickHandler = function () {
    setInitialStateForForm();
    deactivatePage();
  };

  // start
  setInitialStateForForm();
  deactivatePage();
  addFormHandlers(formButtonSubmitHandler);
  adFormReset.addEventListener('click', resetButtonClickHandler);
  mainPin.addEventListener('mousedown', mainPinMouseDownHandler);
})();
