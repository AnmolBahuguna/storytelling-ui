const translatedFunFacts = {
  English: [
    "Did you know? Octopuses have three hearts and blue blood!",
    "Space is completely silent because there's no air to carry sound.",
    "A group of flamingos is called a 'flamboyance'.",
    "Honey never spoils. It can last for thousands of years!",
    "Bananas actually grow upside down reaching for the sun!",
    "Wombats are the only animals in the world that have cube-shaped poop!",
    "A day on Venus is longer than a year on Venus.",
    "Butterflies can taste their food using their feet!",
    "Sea otters hold hands when they sleep so they don't drift apart.",
    "Sloths can hold their breath underwater for up to 40 minutes!"
  ],
  Hindi: [
    "क्या आप जानते हैं? ऑक्टोपस के तीन दिल होते हैं और खून नीला होता है!",
    "अंतरिक्ष पूरी तरह से शांत है क्योंकि वहां आवाज ले जाने के लिए हवा नहीं है।",
    "राजहंस के झुंड को 'flamboyance' कहा जाता है।",
    "शहद कभी खराब नहीं होता। यह हजारों साल तक रह सकता है!",
    "केले वास्तव में सूरज की ओर पहुंचने के लिए उल्टे बढ़ते हैं!",
    "वोम्बैट दुनिया के एकमात्र जानवर हैं जिनका मल चौकोर आकार का होता है!",
    "शुक्र ग्रह पर एक दिन उसके एक साल से भी लंबा होता है।",
    "तितलियां अपने पैरों से भोजन का स्वाद ले सकती हैं!",
    "समुद्री ऊदबिलाव सोते समय एक-दूसरे का हाथ पकड़ते हैं ताकि वे बह न जाएं।",
    "स्लॉथ पानी के नीचे 40 मिनट तक अपनी सांस रोक सकते हैं!"
  ],
  Spanish: [
    "¿Sabías que los pulpos tienen tres corazones y sangre azul?",
    "El espacio es completamente silencioso porque no hay aire para transportar el sonido.",
    "La miel nunca se echa a perder. ¡Puede durar miles de años!",
    "¡Los plátanos en realidad crecen al revés buscando el sol!",
    "Un día en Venus es más largo que un año en Venus."
  ],
  French: [
    "Le saviez-vous ? Les pieuvres ont trois cœurs et le sang bleu !",
    "L'espace est complètement silencieux car il n'y a pas d'air pour transporter le son.",
    "Le miel ne se gâte jamais. Il peut se conserver des milliers d'années !",
    "Les bananes poussent en fait à l'envers pour atteindre le soleil !",
    "Un jour sur Vénus est plus long qu'une année sur Vénus."
  ],
  German: [
    "Wussten Sie schon? Oktopusse haben drei Herzen und blaues Blut!",
    "Der Weltraum ist völlig still, weil es keine Luft gibt, die den Schall überträgt.",
    "Honig verdirbt nie. Er kann Tausende von Jahren halten!",
    "Bananen wachsen tatsächlich kopfüber und strecken sich nach der Sonne!",
    "Ein Tag auf der Venus ist länger als ein Jahr auf der Venus."
  ],
  Italian: [
    "Sapevi che i polpi hanno tre cuori e il sangue blu?",
    "Lo spazio è completamente silenzioso perché non c'è aria per trasportare il suono.",
    "Il miele non va mai a male. Può durare per migliaia di anni!",
    "Le banane in realtà crescono a testa in giù cercando il sole!",
    "Un giorno su Venere è più lungo di un anno su Venere."
  ],
  Japanese: [
    "知っていましたか？タコには心臓が3つあり、血は青いんです！",
    "音を伝える空気がないため、宇宙は完全に無音です。",
    "ハチミツは決して腐りません。何千年も持ちます！",
    "バナナは太陽に向かって逆さまに成長するんです！",
    "金星の1日は金星の1年よりも長いんです。"
  ],
  Chinese: [
    "你知道吗？章鱼有三颗心脏和蓝色的血液！",
    "太空中完全无声，因为没有空气传播声音。",
    "蜂蜜永远不会变质。它可以保存几千年！",
    "香蕉其实是倒着长向太阳的！",
    "金星上的一天比金星上的一年还要长。"
  ],
  Korean: [
    "알고 계셨나요? 문어는 심장이 3개이고 파란 피를 가지고 있어요!",
    "우주에는 소리를 전달할 공기가 없기 때문에 완전히 고요합니다.",
    "꿀은 절대 상하지 않습니다. 수천 년 동안 지속될 수 있어요!",
    "바나나는 사실 태양을 향해 거꾸로 자랍니다!",
    "금성에서의 하루는 금성에서의 1년보다 깁니다."
  ],
  Portuguese: [
    "Você sabia? Os polvos têm três corações e sangue azul!",
    "O espaço é completamente silencioso porque não há ar para propagar o som.",
    "O mel nunca estraga. Pode durar milhares de anos!",
    "As bananas na verdade crescem de cabeça para baixo em direção ao sol!",
    "Um dia em Vênus é mais longo que um ano em Vênus."
  ],
  Russian: [
    "Знаете ли вы? У осьминогов три сердца и голубая кровь!",
    "В космосе совершенно тихо, потому что там нет воздуха, чтобы передавать звук.",
    "Мёд никогда не портится. Он может храниться тысячи лет!",
    "Бананы на самом деле растут вверх ногами, тянутся к солнцу!",
    "Один день на Венере длится дольше, чем один год на Венере."
  ],
  Arabic: [
    "هل تعلم؟ الأخطبوط لديه ثلاثة قلوب ودم أزرق!",
    "الفضاء صامت تمامًا لأنه لا يوجد هواء لنقل الصوت.",
    "العسل لا يفسد أبدا. يمكن أن يستمر لآلاف السنين!",
    "الموز ينمو في الواقع رأسًا على عقب للوصول إلى الشمس!",
    "اليوم على كوكب الزهرة أطول من سنة على كوكب الزهرة."
  ],
  Bengali: [
    "আপনি কি জানেন? অক্টোপাসের তিনটি হৃদপিণ্ড এবং নীল রক্ত আছে!",
    "মহাকাশ সম্পূর্ণ নীরব কারণ শব্দ বহন করার জন্য কোনও বাতাস নেই।",
    "মধু কখনও নষ্ট হয় না। এটি হাজার হাজার বছর ধরে চলতে পারে!",
    "কলা আসলে সূর্যের দিকে পৌঁছানোর জন্য উল্টোভাবে বৃদ্ধি পায়!",
    "শুক্র গ্রহে একটি দিন শুক্র গ্রহের এক বছরের চেয়ে দীর্ঘ।"
  ],
  Marathi: [
    "तुम्हाला माहित आहे का? ऑक्टोपसला तीन हृदये असतात आणि रक्त निळे असते!",
    "अंतराळ पूर्णपणे शांत आहे कारण आवाज वाहून नेण्यासाठी हवा नाही.",
    "मध कधीही खराब होत नाही. ते हजारो वर्षे टिकू शकते!",
    "केळी खरोखर सूर्याकडे पोहोचण्यासाठी उलटी वाढतात!",
    "शुक्र ग्रहावरील एक दिवस शुक्रावरील एका वर्षापेक्षा मोठा असतो."
  ],
  Telugu: [
    "మీకు తెలుసా? ఆక్టోపస్‌లకు మూడు గుండెలు మరియు నీలి రంగు రక్తం ఉంటుంది!",
    "శబ్దాన్ని మోసుకెళ్లడానికి గాలి లేనందున అంతరిక్షం పూర్తిగా నిశ్శబ్దంగా ఉంటుంది.",
    "తేనె ఎప్పుడూ పాడవదు. ఇది వేల సంవత్సరాల పాటు ఉంటుంది!",
    "అరటిపండ్లు వాస్తవానికి సూర్యుడిని చేరుకోవడానికి తలక్రిందులుగా పెరుగుతాయి!",
    "శుక్రునిపై ఒక రోజు శుక్రునిపై ఒక సంవత్సరం కంటే పొడవుగా ఉంటుంది."
  ],
  Tamil: [
    "உங்களுக்குத் தெரியுமா? ஆக்டோபஸ்களுக்கு மூன்று இதயங்கள் மற்றும் நீல நிற ரத்தம் உள்ளது!",
    "ஒலியை எடுத்துச் செல்ல காற்று இல்லாததால் விண்வெளி முற்றிலும் அமைதியாக இருக்கிறது.",
    "தேன் ஒருபோதும் கெட்டுப்போகாது. இது ஆயிரக்கணக்கான ஆண்டுகள் நீடிக்கும்!",
    "வாழைப்பழங்கள் உண்மையில் சூரியனை நோக்கி தலைகீழாக வளரும்!",
    "சுக்கிரனில் ஒரு நாள் சுக்கிரனில் ஒரு வருடத்தை விட நீண்டது."
  ],
  Gujarati: [
    "શું તમે જાણો છો? ઓક્ટોપસને ત્રણ હૃદય હોય છે અને રક્ત વાદળી હોય છે!",
    "અવકાશ સંપૂર્ણપણે શાંત છે કારણ કે ત્યાં અવાજ વહન કરવા માટે કોઈ હવા નથી.",
    "મધ ક્યારેય બગડતું નથી. તે હજારો વર્ષો સુધી ટકી શકે છે!",
    "કેળા ખરેખર સૂર્ય તરફ પહોંચવા માટે ઊંધા ઉગે છે!",
    "શુક્ર પર એક દિવસ શુક્ર પરના એક વર્ષ કરતા લાંબો હોય છે."
  ],
  Punjabi: [
    "ਕੀ ਤੁਸੀਂ ਜਾਣਦੇ ਹੋ? ਆਕਟੋਪਸ ਦੇ ਤਿੰਨ ਦਿਲ ਹੁੰਦੇ ਹਨ ਅਤੇ ਖੂਨ ਨੀਲਾ ਹੁੰਦਾ ਹੈ!",
    "ਪੁਲਾੜ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸ਼ਾਂਤ ਹੈ ਕਿਉਂਕਿ ਆਵਾਜ਼ ਲਿਜਾਣ ਲਈ ਕੋਈ ਹਵਾ ਨਹੀਂ ਹੈ।",
    "ਸ਼ਹਿਦ ਕਦੇ ਖਰਾਬ ਨਹੀਂ ਹੁੰਦਾ। ਇਹ ਹਜ਼ਾਰਾਂ ਸਾਲਾਂ ਤੱਕ ਰਹਿ ਸਕਦਾ ਹੈ!",
    "ਕੇਲੇ ਅਸਲ ਵਿੱਚ ਸੂਰਜ ਵੱਲ ਪਹੁੰਚਣ ਲਈ ਉਲਟੇ ਵਧਦੇ ਹਨ!",
    "ਸ਼ੁੱਕਰ ਗ੍ਰਹਿ 'ਤੇ ਇੱਕ ਦਿਨ ਸ਼ੁੱਕਰ 'ਤੇ ਇੱਕ ਸਾਲ ਨਾਲੋਂ ਲੰਬਾ ਹੁੰਦਾ ਹੈ।"
  ],
  Kannada: [
    "ನಿಮಗೆ ತಿಳಿದಿದೆಯೇ? ಆಕ್ಟೋಪಸ್‌ಗಳಿಗೆ ಮೂರು ಹೃದಯಗಳು ಮತ್ತು ನೀಲಿ ರಕ್ತವಿರುತ್ತದೆ!",
    "ಶಬ್ದವನ್ನು ಒಯ್ಯಲು ಗಾಳಿ ಇಲ್ಲದ ಕಾರಣ ಬಾಹ್ಯಾಕಾಶವು ಸಂಪೂರ್ಣವಾಗಿ ಮೌನವಾಗಿರುತ್ತದೆ.",
    "ಜೇನುತುಪ್ಪ ಎಂದಿಗೂ ಹಾಳಾಗುವುದಿಲ್ಲ. ಇದು ಸಾವಿರಾರು ವರ್ಷಗಳವರೆಗೆ ಇರುತ್ತದೆ!",
    "ಬಾಳೆಹಣ್ಣುಗಳು ವಾಸ್ತವವಾಗಿ ಸೂರ್ಯನನ್ನು ತಲುಪಲು ತಲೆಕೆಳಗಾಗಿ ಬೆಳೆಯುತ್ತವೆ!",
    "ಶುಕ್ರನ ಮೇಲಿನ ಒಂದು ದಿನವು ಶುಕ್ರನ ಮೇಲಿನ ಒಂದು ವರ್ಷಕ್ಕಿಂತ ಉದ್ದವಾಗಿದೆ."
  ],
  Malayalam: [
    "നിങ്ങൾക്കറിയാമോ? നീരാളികൾക്ക് മൂന്ന് ഹൃദയങ്ങളും നീല നിറത്തിലുള്ള രക്തവുമുണ്ട്!",
    "ശബ്ദം വഹിക്കാൻ വായുവില്ലാത്തതിനാൽ ബഹിരാകാശം പൂർണ്ണമായും നിശബ്ദമാണ്.",
    "തേൻ ഒരിക്കലും കേടാകില്ല. ഇത് ആയിരക്കണക്കിന് വർഷങ്ങൾ നീണ്ടുനിൽക്കും!",
    "സൂര്യപ്രകാശം ലഭിക്കാൻ വാഴപ്പഴം യഥാർത്ഥത്തിൽ തലകീഴായി വളരുന്നു!",
    "ശുക്രനിൽ ഒരു ദിവസം ശുക്രനിലെ ഒരു വർഷത്തേക്കാൾ കൂടുതലാണ്."
  ],
  Odia: [
    "ଆପଣ ଜାଣନ୍ତି କି? ଅକ୍ଟୋପସ୍ ର ତିନୋଟି ହୃଦୟ ଏବଂ ନୀଳ ରକ୍ତ ଥାଏ!",
    "ମହାକାଶ ସମ୍ପୂର୍ଣ୍ଣ ନୀରବ ଅଟେ କାରଣ ଶବ୍ଦ ବହନ କରିବାକୁ ବାୟୁ ନାହିଁ |",
    "ମହୁ କେବେବି ଖରାପ ହୁଏ ନାହିଁ | ଏହା ହଜାର ହଜାର ବର୍ଷ ଧରି ରହିପାରେ!",
    "କଦଳୀ ପ୍ରକୃତରେ ସୂର୍ଯ୍ୟ ଆଡକୁ ପହଞ୍ଚିବା ପାଇଁ ଓଲଟା ବଢିଥାଏ!",
    "ଶୁକ୍ର ଗ୍ରହରେ ଗୋଟିଏ ଦିନ ଶୁକ୍ର ଗ୍ରହର ଗୋଟିଏ ବର୍ଷ ଠାରୁ ଅଧିକ ଅଟେ |"
  ],
  Turkish: [
    "Biliyor muydunuz? Ahtapotların üç kalbi ve mavi kanı vardır!",
    "Sesi taşıyacak hava olmadığı için uzay tamamen sessizdir.",
    "Bal asla bozulmaz. Binlerce yıl dayanabilir!",
    "Muzlar aslında güneşe ulaşmak için baş aşağı büyürler!",
    "Venüs'teki bir gün, Venüs'teki bir yıldan daha uzundur."
  ]
};

export const getFunFactsForLanguage = (language) => {
  return translatedFunFacts[language] || translatedFunFacts["English"];
};
