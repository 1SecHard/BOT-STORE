const TelegramBot = require('node-telegram-bot-api');

// Token និង Admin Chat ID
const token = '7751660864:AAE6rfu2qpJINu7wc2zRwdvNr2_28BKYpLM';  // ជំនួស "YOUR_BOT_TOKEN" ជាមួយ token របស់អ្នក
const adminId = '7728394947';  // Admin chat ID
const adminUsername = 'electric0009';  // Admin username

const bot = new TelegramBot(token, { polling: true });

let userOrderMap = {};

// បញ្ជូនម៉ឺនុយផលិតផល
const products = {
  chatgpt: {
    name: "ChatGPT Plus",
    previewImage: 'https://imgur.com/a/awIbkz4', // URL រូបភាពដែលបានយកពី Imgur
    qrImage: 'https://imgur.com/a/VINZt33', // តំណ QR Code ដែលអ្នកបានផ្តល់
    caption: "🤖 <b>ChatGPT Plus - $5.00 / ខែ</b>\n\n• Email:Pass\n• Auto Renewal\n\n📌 ចុច \"ទិញឥឡូវនេះ\" ដើម្បីបង្ហាញ QR"
  },
  photoshop: {
    name: "Photoshop 2024 AI",
    previewImage: 'https://imgur.com/a/IRJGr9l',  // URL រូបភាពដែលបានយកពី Imgur
    qrImage: 'https://imgur.com/a/VINZt33', // តំណ QR Code ដែលអ្នកបានផ្តល់
    caption: "🖼 <b>Photoshop 2024 AI - $3.50</b>\n\n• Installer + Crack\n• For Windows"
  },
  CarParking: {
    name: "Carparking",
    previewImage: 'https://imgur.com/a/e0zjuNf',  // URL រូបភាពដែលបានយកពី Imgur
    qrImage: 'https://imgur.com/a/VINZt33', // តំណ QR Code ផ្សេង
    caption: "🎨 <b>Car Parking - $1 / ប្រើប្រាស់បានរហូត</b>\n\n• Hack Car Parking Account"
  },
  spotify: {
    name: "Spotify Premium",
    previewImage: 'https://imgur.com/a/BtbUCSY',
    qrImage: 'https://imgur.com/a/VINZt33', // តំណ QR Code ផ្សេង
    caption: "🎧 <b>Spotify Premium - $3.00 / ខែ</b>\n\n• Family Plan"
  },
  canva: {
    name: "Canva Pro",
    previewImage: 'https://imgur.com/a/IceMHVR',  // URL រូបភាពដែលបានយកពី Imgur
    qrImage: 'https://imgur.com/a/VINZt33', // តំណ QR Code ផ្សេង
    caption: "🎨 <b>Canva Pro - $3.00 / ខែ</b>\n\n• Invite Link"
  },
  // បន្ថែមផលិតផលផ្សេងៗ
};

// កូដបើក bot
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  sendWelcomeMessage(chatId);
});

function sendWelcomeMessage(chatId) {
  const welcomeMessage = "👋 សួស្តី! សូមស្វាគមន៍មកកាន់ @KALIPTO_STORE Bot។\n\n🎁 សូមជ្រើសរើសផលិតផលដែលអ្នកចង់ទិញ។\n\n👇 ចុចខាងក្រោមសម្រាប់ការជួយ!";
  
  bot.sendPhoto(chatId, 'https://imgur.com/a/a3i7ZKg', {
    caption: welcomeMessage,
    reply_markup: {
      inline_keyboard: [
        [{ text: 'ចូល Channel KALIPTO_STORE', url: 'https://t.me/KALIPTO_STORE' }],
        [{ text: '📋 ជ្រើសរើសផលិតផល', callback_data: 'menu' }],
        [{ text: '💬 ទំនាក់ទំនង Admin', url: 'https://t.me/' + adminUsername }],
        [{ text: '💻 Free Scripts & Tools', callback_data: 'show_freeScripts' }]  // Button Free Scripts & Tools
      ]
    }
  });
}

function sendProductMenu(chatId) {
  const keyboard = Object.keys(products).map(p => [{ text: products[p].name, callback_data: 'show_' + p }]);
  bot.sendMessage(chatId, '📋 សូមជ្រើសរើសផលិតផល៖', {
    reply_markup: { inline_keyboard: keyboard }
  });
}

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === 'menu') {
    sendProductMenu(chatId);
    return;
  }

  if (data.startsWith('show_')) {
    const productKey = data.split('_')[1];
    const product = products[productKey];
    userOrderMap[chatId] = productKey;

    // Check if product has previewImage before sending
    if (product.previewImage) {
      await bot.sendPhoto(chatId, product.previewImage, {
        caption: product.caption,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🛒 ទិញឥឡូវនេះ', callback_data: 'buy_' + productKey }],
            [{ text: '📂 ត្រឡប់ទៅម៉ឺនុយ', callback_data: 'menu' }]
          ]
        }
      });
    } else {
      await bot.sendMessage(chatId, '❌ រូបភាពមិនមាន។');
    }
    return;
  }

  if (data.startsWith('buy_')) {
    const productKey = data.split('_')[1];
    const product = products[productKey];

    // Check if product has qrImage before sending
    if (product.qrImage) {
      await bot.sendPhoto(chatId, product.qrImage, {
        caption: "📸 សូមស្កេន QR ដើម្បីបង់ប្រាក់។\n\n📤 បន្ទាប់មកសូមផ្ញើ slip មកទីនេះ។",
        reply_markup: {
          inline_keyboard: [
            [{ text: '📂 ត្រឡប់ទៅម៉ឺនុយ', callback_data: 'menu' }],
            [{ text: '📩 ទំនាក់ទំនង Admin', url: 'https://t.me/' + adminUsername }]
          ]
        }
      });
    } else {
      await bot.sendMessage(chatId, '❌ មិនមាន QR Code សម្រាប់ផលិតផលនេះទេ។');
    }
    return;
  }

  if (data === 'show_freeScripts') {
    const product = products.freeScript;

    await bot.sendPhoto(chatId, product.previewImage, {
      caption: product.caption,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🛒 ទិញឥឡូវនេះ (Free)', callback_data: 'buy_freeScript' }],
          [{ text: '📂 ត្រឡប់ទៅម៉ឺនុយ', callback_data: 'menu' }]
        ]
      }
    });
  }

  if (data === 'buy_freeScript') {
    // Send Free Script Files
    await bot.sendDocument(chatId, 'path/to/your/python_script.py', { caption: "📄 Python Script" });
    await bot.sendDocument(chatId, 'path/to/your/java_script.js', { caption: "📄 Java Script" });
    await bot.sendDocument(chatId, 'path/to/your/txt_file.txt', { caption: "📄 TXT File" });
    await bot.sendMessage(chatId, "🎉 អ្នកបានទទួលផលិតផលឥតគិតថ្លៃ។ សូមរងចាំការបញ្ជូនព័ត៌មាន!");
    return;
  }
});

// ការផ្ញើរូបភាពពេលអ្នកប្រើផ្ញើ slip
bot.on('photo', async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username || "មិនស្គាល់";
  const photoId = msg.photo[msg.photo.length - 1].file_id;
  const selected = userOrderMap[chatId] || "មិនបញ្ជាក់";

  await bot.sendMessage(chatId, "📥 បានទទួល slip របស់អ្នក! សូមរងចាំ Admin ត្រួតពិនិត្យ។");

  await bot.sendPhoto(adminId, photoId, {
    caption: `🧾 Slip ថ្មីពី @${username} (${chatId})\n\n🎁 ផលិតផល: ${selected}\n📌 ប្រើ /send ${chatId} [account info] ដើម្បីផ្ញើ។`
  });
});

// Admin ផ្ញើ account info ដោយដៃ
bot.onText(/\/send (\d+)\s+([\s\S]+)/, (msg, match) => {
  const fromId = msg.from.id.toString();
  if (fromId !== adminId) {
    return bot.sendMessage(msg.chat.id, '❌ អ្នកមិនមានសិទ្ធិប្រើបញ្ជានេះទេ។');
  }

  const targetChatId = match[1];
  const message = match[2];

  bot.sendMessage(targetChatId, `✅ អ្នកទទួលបានផលិតផលរបស់អ្នក:\n\n${message}`);
  bot.sendMessage(msg.chat.id, `📤 ផ្ញើ account info ទៅ Chat ID ${targetChatId} ដោយជោគជ័យ។`);
});