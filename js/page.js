'use strict';

(function () {
  var setInitialStateForForm = window.form.setInitialStateForForm;
  var makeFormActive = window.form.makeFormActive;
  var makeFormDisabled = window.form.makeFormDisabled;
  var addFormHandlers = window.form.addFormHandlers;
  var showPopup = window.form.showPopup;
  var setAdressByPin = window.form.setAdressByPin;
  var closeCard = window.card.close;
  var mainPinMouseDown = window.mainPin.mainPinMouseDown;
  var saveForm = window.backend.saveForm;
  var showError = window.message.error;

  // elements
  var noticeSection = document.querySelector('.notice');
  var adForm = document.querySelector('.ad-form');
  var adFormReset = noticeSection.querySelector('.ad-form__reset');
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');

  var formTitle = adForm.querySelector('#title');
  var formPrice = adForm.querySelector('#price');
  var formCapacity = adForm.querySelector('#capacity');

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
    if (
      formTitle.validity.valid &&
      formPrice.validity.valid &&
      formCapacity.validity.valid
    ) {
      saveForm(
          new FormData(adForm),
          function () {
            deactivatePage();
            showPopup();
            setInitialStateForForm();
          },
          showError
      );
    }
  };

  var resetButtonClickHandler = function () {
    setInitialStateForForm();
    deactivatePage();
  };

  var getOriginalAdverts = function (adverts) {
    window.originalAdverts = adverts;
  };

  // start
  window.originalAdverts = [];
  setInitialStateForForm();
  deactivatePage();
  addFormHandlers(formButtonSubmitHandler);
  adFormReset.addEventListener('click', resetButtonClickHandler);
  mainPin.addEventListener('mousedown', mainPinMouseDownHandler);

  window.backend.loadData(getOriginalAdverts, showError);
})();
