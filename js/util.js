'use strict';

(function () {
  window.util = {
    getRandomNumber: function (min, max) {
      return Math.round(Math.random() * (max - min) + min);
    },
    shuffle: function (array) {
      var newArray = array.slice();
      var finalArray = [];

      array.forEach(function () {
        var randomIndex = window.util.getRandomNumber(0, newArray.length - 1);
        finalArray.push(newArray.splice(randomIndex, 1)[0]);
      });

      return finalArray;
    },
    addElementsWithFragment: function (parent, dataArray, callback, handler) {
      var fragment = document.createDocumentFragment();
      dataArray.forEach(function (element) {
        fragment.appendChild(callback(element, handler));
      });
      parent.appendChild(fragment);
    },
    removeAttributeElements: function (elements, attributeName) {
      for (var i = 0; i < elements.length; i++) {
        var current = elements[i];
        if (current[attributeName]) {
          current[attributeName] = false;
        }
      }
    },
    addAttributeElements: function (elements, attributeName) {
      for (var i = 0; i < elements.length; i++) {
        var current = elements[i];
        if (!current[attributeName]) {
          current[attributeName] = true;
        }
      }
    },
  };
})();
