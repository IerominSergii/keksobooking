'use strict';

(function () {
  // import
  var getRandomNumber = window.util.getRandomNumber;
  var shuffle = window.util.shuffle;

  // constants
  var TITLE = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];
  var TYPE = ['palace', 'flat', 'house', 'bungalo'];
  var CHECKIN = ['12:00', '13:00', '14:00'];
  var CHECKOUT = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];

  // functions
  var generateRandomAdvertPost = function (avatarIndex) {
    var adPost = {};

    adPost.author = {};
    adPost.author.avatar = 'img/avatars/user0' + (avatarIndex + 1) + '.png';

    adPost.location = {};
    adPost.location.x = getRandomNumber(300, 900);
    adPost.location.y = getRandomNumber(130, 630);

    adPost.offer = {};
    adPost.offer.title = TITLE.splice(avatarIndex, 1);
    adPost.offer.address = adPost.location.x + ', ' + adPost.location.y;
    adPost.offer.price = getRandomNumber(1000, 1000000);
    adPost.offer.type = TYPE[getRandomNumber(0, TYPE.length - 1)];
    adPost.offer.rooms = getRandomNumber(1, 5);
    adPost.offer.guests = getRandomNumber(1, 10);
    adPost.offer.checkin = CHECKIN[getRandomNumber(0, CHECKIN.length - 1)];
    adPost.offer.checkout = CHECKOUT[getRandomNumber(0, CHECKOUT.length - 1)];
    adPost.offer.features = FEATURES.slice();
    adPost.offer.features.length = getRandomNumber(1, 6);
    adPost.offer.description = '';
    adPost.offer.photos = shuffle(PHOTOS);

    return adPost;
  };

  var generateAdvertPosts = function (amount) {
    var adPostsList = [];

    do {
      adPostsList.push(generateRandomAdvertPost(adPostsList.length));
    } while (adPostsList.length < amount);

    return adPostsList;
  };

  // export
  window.data = generateAdvertPosts;
})();
