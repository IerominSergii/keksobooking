'use strict';

(function () {
  // constants
  var ESC_KEYCODE = 27;
  var PRICE_PLACEHOLDERS = {
    Бунгало: 0,
    Квартира: 1000,
    Дом: 5000,
    Дворец: 10000
  };
  var MAIN_PIN = {
    width: 65,
    height: 65
  };
  var MAIN_PIN_POINTER_HEIGHT = 22;
  var DEFAULT_MAIN_PIN_POSITION = {
    x: 570,
    y: 375
  };
  var DEFAULT_FORM_STATE = {
    titleValue: '',
    typeIndex: 1,
    priceValue: null,
    timeInIndex: 0,
    timeOutIndex: 0,
    roomNumberIndex: 1,
    capacityIndex: 1,
    descriptionValue: null
  };

  // global
  var removePins = window.pin.removePins;
  var removeAttributeElements = window.util.removeAttributeElements;
  var addAttributeElements = window.util.addAttributeElements;
  var disable = window.util.disable;
  var enable = window.util.enable;

  // elements
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');
  var noticeSection = document.querySelector('.notice');
  var title = noticeSection.querySelector('#title');
  var adForm = noticeSection.querySelector('.ad-form ');
  var priceForm = noticeSection.querySelector('#price');
  var formFieldsets = noticeSection.querySelectorAll('fieldset');
  var formInputs = noticeSection.querySelectorAll('input');
  var typeAccomodation = noticeSection.querySelector('#type');
  var address = noticeSection.querySelector('#address');
  var timeOut = noticeSection.querySelector('#timeout');
  var timeIn = noticeSection.querySelector('#timein');
  var capacity = noticeSection.querySelector('#capacity');
  var roomNumber = noticeSection.querySelector('#room_number');
  var description = noticeSection.querySelector('#description');
  var features = noticeSection.querySelector('.features');
  var successPopup = document.querySelector('.success');

  // export window.form
  window.form = {};
  window.form.pageState = false;

  // functions
  var setMinimalPrice = function (element, minPrice) {
    element.placeholder = PRICE_PLACEHOLDERS[minPrice];
    element.min = PRICE_PLACEHOLDERS[minPrice];
  };

  var setTime = function (selectedIndex, element) {
    element.selectedIndex = selectedIndex;
  };

  // last version
  var limitGuests = function (rooms) {
    capacity.querySelectorAll('option');
    for (var i = 0; i < capacity.length; i++) {
      var element = capacity[i];
      var value = element.value;
      var shouldBeDisabled = false;

      switch (rooms) {
        case '1':
          if (value !== '1') {
            shouldBeDisabled = true;
          }
          break;
        case '2':
          if (value === '3' || value === '0') {
            shouldBeDisabled = true;
          }
          break;
        case '3':
          if (value === '0') {
            shouldBeDisabled = true;
          }
          break;
        case '100':
          if (value !== '0') {
            shouldBeDisabled = true;
          }
          break;
        default:
          throw new Error('Wrong rooms amount');
      }

      if (shouldBeDisabled) {
        disable(element);
      } else {
        enable(element);
      }
    }
  };

  // set default form state
  var setDefaultMainPinPosition = function () {
    mainPin.style.left = DEFAULT_MAIN_PIN_POSITION.x + 'px';
    mainPin.style.top = DEFAULT_MAIN_PIN_POSITION.y + 'px';
  };

  var setDefaultOption = function (element, index) {
    element.selectedIndex = index;
  };

  var setDefaultInput = function (inputElement, defaultValue) {
    inputElement.value = defaultValue;
  };

  var setDefaultCheckbox = function (element) {
    while (element.querySelector('input:checked')) {
      element.querySelector('input:checked').checked = false;
    }
  };

  // popup
  var popupEscPressHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closePopup();
    }
  };

  var closePopup = function () {
    successPopup.classList.add('hidden');
    document.removeEventListener('click', closePopup);
  };

  // handlers
  var typeAccomodationChangeHandler = function (evt) {
    var selectedElement = evt.target.options[evt.target.selectedIndex];
    setMinimalPrice(priceForm, selectedElement.textContent);
  };

  var timeOutChangeHandler = function () {
    setTime(timeOut.selectedIndex, timeIn);
  };

  var timeInChangeHandler = function () {
    setTime(timeIn.selectedIndex, timeOut);
  };

  var roomNumberChangeHandler = function () {
    limitGuests(roomNumber.options[roomNumber.selectedIndex].value);
  };

  var setCapacityCustomValidityHandler = function () {
    if (capacity.options[capacity.selectedIndex].disabled) {
      capacity.setCustomValidity(
          '«Количество мест» должно соответствовать «Количеству комнат». Пожалуйста, выберете из доступных вариантов.'
      );
    } else {
      capacity.setCustomValidity('');
    }
  };

  // export
  window.form = {
    setAdressByPin: function () {
      var top =
        parseInt(mainPin.style.top, 10) +
        MAIN_PIN.height / 2 +
        MAIN_PIN_POINTER_HEIGHT;
      var left = parseInt(mainPin.style.left, 10) + MAIN_PIN.width / 2;

      address.value = left + ', ' + top;
    },
    setInitialStateForForm: function () {
      setDefaultMainPinPosition();
      window.form.setAdressByPin();

      setDefaultInput(title, DEFAULT_FORM_STATE.titleValue);
      setDefaultInput(priceForm, DEFAULT_FORM_STATE.priceValue);
      setDefaultInput(description, DEFAULT_FORM_STATE.descriptionValue);

      setDefaultOption(typeAccomodation, DEFAULT_FORM_STATE.typeIndex);
      setDefaultOption(timeIn, DEFAULT_FORM_STATE.timeInIndex);
      setDefaultOption(timeOut, DEFAULT_FORM_STATE.timeOutIndex);
      setDefaultOption(roomNumber, DEFAULT_FORM_STATE.roomNumberIndex);
      setDefaultOption(capacity, DEFAULT_FORM_STATE.capacityIndex);

      setDefaultCheckbox(features);

      removePins();
    },
    makeFormActive: function () {
      map.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');
      window.form.setAdressByPin();
      removeAttributeElements(formFieldsets, 'disabled');
      removeAttributeElements(formInputs, 'disabled');
    },
    makeFormDisabled: function () {
      map.classList.add('map--faded');
      adForm.classList.add('ad-form--disabled');
      addAttributeElements(formFieldsets, 'disabled');
    },
    addFormHandlers: function (handler) {
      typeAccomodation.addEventListener(
          'change',
          typeAccomodationChangeHandler
      );
      timeOut.addEventListener('change', timeOutChangeHandler);
      timeIn.addEventListener('change', timeInChangeHandler);
      roomNumber.addEventListener('change', roomNumberChangeHandler);
      roomNumber.addEventListener('change', setCapacityCustomValidityHandler);
      capacity.addEventListener('change', setCapacityCustomValidityHandler);
      adForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        handler();
      });
    },
    showPopup: function () {
      successPopup.classList.remove('hidden');
      successPopup.addEventListener('click', closePopup);
      document.addEventListener('keydown', popupEscPressHandler);
    }
  };
})();
