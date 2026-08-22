const fs = require('fs');
const path = require('path');

let cardImages = [];

hexo.extend.helper.register('get_random_image_from_cards', function() {
  if (cardImages.length === 0) {
    const cardDir = path.join(hexo.theme_dir, 'source/images/cards');
    try {
      if (fs.existsSync(cardDir)) {
        const files = fs.readdirSync(cardDir);
        cardImages = files.filter(function(file) {
          return ['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(path.extname(file).toLowerCase());
        });
      }
    } catch (e) {
      console.error('Error reading cards directory:', e);
    }
  }

  if (cardImages.length > 0) {
    const randomCard = cardImages[Math.floor(Math.random() * cardImages.length)];
    return '/images/cards/' + randomCard;
  }

  return null;
});

hexo.extend.helper.register('get_all_card_images', function() {
  if (cardImages.length === 0) {
    const cardDir = path.join(hexo.theme_dir, 'source/images/cards');
    try {
      if (fs.existsSync(cardDir)) {
        const files = fs.readdirSync(cardDir);
        cardImages = files.filter(function(file) {
          return ['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(path.extname(file).toLowerCase());
        });
      }
    } catch (e) {
      console.error('Error reading cards directory:', e);
    }
  }
  return cardImages.map(img => '/images/cards/' + img);
});
