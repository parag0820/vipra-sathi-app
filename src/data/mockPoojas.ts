import { Pooja, PoojaPersonalNote } from '../types/pooja';

export const CATEGORIES = [
  'All',
  'Vishnu Pooja',
  'Ganesh Pooja',
  'Shiva Pooja',
  'Durga Pooja',
  'Lakshmi Pooja',
  'Hanuman Pooja'
];

export const INITIAL_GANESH_NOTES: PoojaPersonalNote[] = [
  {
    id: 'note-1',
    poojaId: 'p1',
    title: 'संकल्प में जोड़ने वाले विवरण',
    content: 'यजमान का नाम, गोत्र और पूजा का उद्देश्य पहले पूछ लें।\n\n• परिवार के सदस्यों के नाम लिखें।\n• तिथि और स्थान की पुष्टि करें।\n• आवश्यक सामग्री पहले व्यवस्थित रखें।',
    isPinned: true,
    updatedAt: '29 अक्टूबर • 09:15',
    timestamp: 1730173500000,
  },
  {
    id: 'note-2',
    poojaId: 'p1',
    title: 'पूजा से पहले की तैयारी',
    content: 'आसन, जलपात्र और सभी सामग्री पूजा शुरू होने से पहले व्यवस्थित रखें।',
    isPinned: false,
    updatedAt: '28 अक्टूबर • 18:40',
    timestamp: 1730121000000,
  },
  {
    id: 'note-3',
    poojaId: 'p1',
    title: 'दूर्वा और नैवेद्य संबंधी नोट',
    content: 'स्थानीय परंपरा के अनुसार सामग्री की पुष्टि यजमान से कर लें।',
    isPinned: false,
    updatedAt: '27 अक्टूबर • 11:20',
    timestamp: 1730008200000,
  },
  {
    id: 'note-4',
    poojaId: 'p1',
    title: 'मेरे पाठ के संदर्भ',
    content: 'पाठ के दौरान उपयोग होने वाले पुस्तक संदर्भ यहाँ लिखें।',
    isPinned: false,
    updatedAt: '25 अक्टूबर • 16:10',
    timestamp: 1729852800000,
  },
  {
    id: 'note-5',
    poojaId: 'p1',
    title: 'अगली पूजा के लिए याद रखें',
    content: 'यजमान को सामग्री सूची पहले भेजनी है और समय की पुष्टि करनी है।',
    isPinned: false,
    updatedAt: '24 अक्टूबर • 08:30',
    timestamp: Date.now() - 1000 * 60 * 60 * 168,
  },
];

export const MOCK_POOJAS: Pooja[] = [
  {
    id: 'p1',
    title: 'Ganesh Chaturthi Pooja',
    headerTitle: 'गणेश पूजा',
    titleHindi: 'श्री गणेश पूजा',
    subtitleHindi: 'संक्षिप्त पूजा क्रम',
    breadcrumbs: 'पूजा विधि  /  गणेश पूजा',
    navAnchors: ['सामग्री', 'प्रारंभ', 'ध्यान', 'आवाहन', 'उपचार'],
    category: 'Ganesh Pooja',
    subCategory: 'Shodashopchar Pooja',
    samagriList: [
      'गणेश प्रतिमा, आसन, जलपात्र, अक्षत, रोली, दूर्वा',
      'पुष्प, धूप, दीप, नैवेद्य, फल एवं दक्षिणा'
    ],
    stepsList: [
      {
        id: 's1',
        stepNumber: 1,
        title: 'तैयारी एवं शुद्धि',
        content: 'पूजा स्थल और सामग्री व्यवस्थित करके आसन ग्रहण करें।'
      },
      {
        id: 's2',
        stepNumber: 2,
        title: 'संकल्प',
        content: 'तिथि, स्थान, नाम और पूजा के उद्देश्य का संकल्प करें।'
      },
      {
        id: 's3',
        stepNumber: 3,
        title: 'श्री गणेश ध्यान',
        content: 'वक्रतुण्ड महाकाय सूर्यकोटिसमप्रभ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥'
      },
      {
        id: 's4',
        stepNumber: 4,
        title: 'आवाहन',
        content: 'ॐ गं गणपतये नमः।\nश्रीगणपतिमावाहयामि स्थापयामि।'
      },
      {
        id: 's5',
        stepNumber: 5,
        title: 'पूजन एवं उपचार',
        content: 'आसन — ॐ गं गणपतये नमः। आसनं समर्पयामि।\nपाद्य — ॐ गं गणपतये नमः। पाद्यं समर्पयामि।\nअर्घ्य — ॐ गं गणपतये नमः। अर्घ्य समर्पयामि।\nआचमन — ॐ गं गणपतये नमः। आचमनीयं समर्पयामि।\nस्नान — ॐ गं गणपतये नमः। स्नानं समर्पयामि।'
      },
      {
        id: 's6',
        stepNumber: 6,
        title: 'पुष्प एवं दूर्वा',
        content: 'ॐ गं गणपतये नमः। पुष्पाणि दूर्वाङ्कुरान् समर्पयामि।'
      },
      {
        id: 's7',
        stepNumber: 7,
        title: 'धूप, दीप एवं नैवेद्य',
        content: 'क्रमशः धूप, दीप और नैवेद्य अर्पित करें।'
      }
    ],
    sections: [
      { sectionId: 's1', sectionType: 'Heading', content: 'Ganesh Chaturthi Special' },
      { sectionId: 's2', sectionType: 'Description', content: 'This pooja is performed to invoke the blessings of Lord Ganesha, the remover of obstacles.' },
      { sectionId: 's3', sectionType: 'Dhyan', content: 'Vakratunda Mahakaya Surya Koti Samaprabha\nNirvighnam Kuru Me Deva Sarva Karyeshu Sarvada' },
      { sectionId: 's4', sectionType: 'Heading', content: 'Main Mantra' },
      { sectionId: 's5', sectionType: 'Mantra', content: 'Om Gam Ganapataye Namaha' },
    ]
  },
  {
    id: 'p2',
    title: 'Satyanarayan Vrat Katha',
    headerTitle: 'सत्यनारायण कथा',
    titleHindi: 'श्री सत्यनारायण पूजा एवं कथा',
    subtitleHindi: 'संक्षिप्त पूजा एवं कथा क्रम',
    breadcrumbs: 'पूजा विधि  /  सत्यनारायण कथा',
    navAnchors: ['सामग्री', 'प्रारंभ', 'संकल्प', 'कथा', 'आरती'],
    category: 'Vishnu Pooja',
    subCategory: 'Panchopchar Pooja',
    samagriList: [
      'भगवान विष्णु / सत्यनारायण चित्र, चौकी, पीला वस्त्र, कलश, पंचामृत',
      'केला, पंजीरी (प्रसाद), तुलसी दल, धूप, दीप, गंध, फल एवं दक्षिणा'
    ],
    stepsList: [
      {
        id: 'sn1',
        stepNumber: 1,
        title: 'शुद्धिकरण एवं स्वस्तिवाचन',
        content: 'पवित्रिकरण मंत्रों के साथ स्वयं एवं पूजन सामग्री पर जल छिड़कें।'
      },
      {
        id: 'sn2',
        stepNumber: 2,
        title: 'संकल्प विधान',
        content: 'यजमान हाथ में जल, अक्षत, पुष्प व द्रव्य लेकर सत्यनारायण व्रत का संकल्प लें।'
      },
      {
        id: 'sn3',
        stepNumber: 3,
        title: 'कलश एवं गणेश पूजन',
        content: 'सर्वप्रथम विघ्नहर्ता श्री गणेश एवं वरुण रूपी कलश का पंचोपचार पूजन करें।'
      },
      {
        id: 'sn4',
        stepNumber: 4,
        title: 'श्री सत्यनारायण ध्यान एवं आवाहन',
        content: 'ध्यायेत् सत्यं गुणातीतं गुणवन्तं सनातनम्।\nशंखचक्रगदापद्मधरं देवं चतुर्भुजम्॥'
      },
      {
        id: 'sn5',
        stepNumber: 5,
        title: 'पंचामृत स्नान एवं अर्चन',
        content: 'भगवान को पंचामृत व शुद्ध जल से स्नान कराकर पीले पुष्प व तुलसी दल अर्पित करें।'
      },
      {
        id: 'sn6',
        stepNumber: 6,
        title: 'सत्यनारायण कथा श्रवण',
        content: 'सत्यनारायण भगवान की पाँचों अध्यायों की पावन कथा का वाचन व श्रवण करें।'
      },
      {
        id: 'sn7',
        stepNumber: 7,
        title: 'आरती एवं महाप्रसाद वितरण',
        content: 'कपूर से आरती करें और पंजीरी व पंचामृत का चरणामृत सभी भक्तों में वितरित करें।'
      }
    ],
    sections: [
      { sectionId: 's1', sectionType: 'Heading', content: 'Satyanarayan Vrat' },
      { sectionId: 's2', sectionType: 'Description', content: 'Dedicated to Lord Vishnu in his manifestation as Lord Satyanarayan. Performed for prosperity and happiness.' },
      { sectionId: 's3', sectionType: 'Dhyan', content: 'Shantakaram Bhujagashayanam Padmanabham Suresham\nVishwadharam Gaganasadrisham Meghavarnam Shubhangam' },
      { sectionId: 's4', sectionType: 'Heading', content: 'Mantra' },
      { sectionId: 's5', sectionType: 'Mantra', content: 'Om Namo Bhagavate Vasudevaya' },
    ]
  },
  {
    id: 'p3',
    title: 'Maha Shivratri Pooja',
    headerTitle: 'शिव पूजा',
    titleHindi: 'श्री महाशिवरात्रि रुद्राभिषेक',
    subtitleHindi: 'संक्षिप्त रुद्राभिषेक विधि',
    breadcrumbs: 'पूजा विधि  /  शिव पूजा',
    navAnchors: ['सामग्री', 'ध्यान', 'अभिषेक', 'बिल्वपत्र', 'आरती'],
    category: 'Shiva Pooja',
    subCategory: 'Rajopchar Pooja',
    samagriList: [
      'शिवलिंग, जलहरी, गंगाजल, कच्चा दूध, दही, घी, शहद, शर्करा (पंचामृत)',
      'बिल्वपत्र, धतूरा, भांग, भस्म, सफेद चंदन, जनेऊ, अक्षत एवं नैवेद्य'
    ],
    stepsList: [
      {
        id: 'sh1',
        stepNumber: 1,
        title: 'तैयारी एवं आसन शुद्धि',
        content: 'उत्तर या पूर्व मुख होकर बैठें और शिव परिवार का स्मरण करें।'
      },
      {
        id: 'sh2',
        stepNumber: 2,
        title: 'शिव ध्यान',
        content: 'ध्यायेन्नित्यं महेशं रजतगिरिनिभं चारुचंद्रावतंसं।\nरत्नाकल्पोज्ज्वलांगं परशुमृगवराभीतिहस्तं प्रसन्नम्॥'
      },
      {
        id: 'sh3',
        stepNumber: 3,
        title: 'महामृत्युंजय मंत्र जप',
        content: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्।\nउर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात्॥'
      },
      {
        id: 'sh4',
        stepNumber: 4,
        title: 'पंचामृत अभिषेक',
        content: 'दूध, दही, घी, शहद और गंगाजल से शिवलिंग पर निरंतर जलधारा अर्पित करें।'
      },
      {
        id: 'sh5',
        stepNumber: 5,
        title: 'बिल्वपत्र एवं भस्म अर्पण',
        content: 'त्रिदलं त्रिगुणाकारं त्रिनेत्रं च त्रियायुधम्।\nत्रिजन्मपापसंहारं बिल्वपत्रं शिवार्पणम्॥'
      },
      {
        id: 'sh6',
        stepNumber: 6,
        title: 'कर्पूर आरती',
        content: 'कर्पूरगौरं करुणावतारं संसारसारं भुजगेन्द्रहारम्।\nसदा वसन्तं हृदयारविन्दे भवं भवानीसहितं नमामि॥'
      }
    ],
    sections: [
      { sectionId: 's1', sectionType: 'Heading', content: 'Shivratri Rudrabhishek' },
      { sectionId: 's2', sectionType: 'Description', content: 'The great night of Shiva, involves offering Bael leaves, milk, and water to the Shiva Linga.' },
      { sectionId: 's3', sectionType: 'Mantra', content: 'Om Namah Shivaya' },
      { sectionId: 's4', sectionType: 'Mantra', content: 'Mahamrityunjaya Mantra: Om Tryambakam Yajamahe...' },
    ]
  },
  {
    id: 'p4',
    title: 'Comprehensive Pooja ',
    headerTitle: 'सम्पूर्ण पूजा',
    titleHindi: 'सम्पूर्ण देव पूजा पद्धति',
    subtitleHindi: 'षोडशोपचार क्रम',
    breadcrumbs: 'पूजा विधि  /  सम्पूर्ण पूजा',
    navAnchors: ['सामग्री', 'प्रारंभ', 'ध्यान', 'आवाहन', 'उपचार'],
    category: 'All',
    subCategory: 'Complete Setup',
    samagriList: [
      'कलश, रोली, मौली, अक्षत, धूप, दीप, कपूर, चंदन, पुष्पमाला',
      'पंचामृत, फल, मिठाई, पान-सुपारी, लौंग, इलायची, दक्षिणा'
    ],
    stepsList: [
      {
        id: 'cp1',
        stepNumber: 1,
        title: 'आचमन एवं प्राणायाम',
        content: 'ॐ केशवाय नमः, ॐ नारायणाय नमः, ॐ माधवाय नमः से आचमन करें।'
      },
      {
        id: 'cp2',
        stepNumber: 2,
        title: 'संकल्प',
        content: 'देश, काल, गोत्र, नाम का उच्चारण कर सकाम अथवा निष्काम संकल्प लें।'
      },
      {
        id: 'cp3',
        stepNumber: 3,
        title: 'गणेश एवं गौरी पूजन',
        content: 'सर्वप्रथम विघ्नेश्वर भगवान गणेश और माता पार्वती का आवाहन व पूजन करें।'
      },
      {
        id: 'cp4',
        stepNumber: 4,
        title: 'कलश व वरुण पूजन',
        content: 'तीर्थों का आवाहन कर कलश में सभी देवताओं की प्रतिष्ठा करें।'
      },
      {
        id: 'cp5',
        stepNumber: 5,
        title: 'नवग्रह पूजन',
        content: 'सूर्य आदि नवग्रहों का ध्यान कर अक्षत एवं पुष्प अर्पित करें।'
      },
      {
        id: 'cp6',
        stepNumber: 6,
        title: 'प्रधान देव पूजन',
        content: 'इष्टदेव का षोडशोपचार से पूजन कर नैवेद्य एवं आरती संपन्न करें।'
      }
    ],
    sections: [
      { sectionId: 's1', sectionType: 'Heading', content: 'Sankalp' },
      { sectionId: 's2', sectionType: 'Vidhi', content: 'Take water, rice, and flowers in your right hand. State your name, gotra, and the purpose of the pooja.' },
      { sectionId: 's3', sectionType: 'Mantra', content: 'Om Vishnu Vishnu Vishnu... Tithou... Vasare... Sankalpam Aham Karishye.' },
      { sectionId: 's4', sectionType: 'Audio', content: 'sankalp_audio.mp3' },
    ]
  },
  {
    id: 'p5',
    title: 'Navratri Durga Pooja & Chandi Path',
    headerTitle: 'दुर्गा पूजा',
    titleHindi: 'श्री दुर्गा पूजा एवं घटस्थापना',
    subtitleHindi: 'संक्षिप्त दुर्गा सप्तशती पाठ विधि',
    breadcrumbs: 'पूजा विधि  /  दुर्गा पूजा',
    navAnchors: ['सामग्री', 'घटस्थापना', 'ध्यान', 'मंत्र', 'आरती'],
    category: 'Durga Pooja',
    subCategory: 'Shodashopchar Pooja',
    samagriList: [
      'माँ दुर्गा की प्रतिमा / चित्र, लाल वस्त्र, कलश, नारियल, जौ (जवारे)',
      'सिंदूर, कुमकुम, लाल पुष्प / गुड़हल, चुनरी, धूप, दीप, नैवेद्य एवं फल'
    ],
    stepsList: [
      {
        id: 'd1',
        stepNumber: 1,
        title: 'घटस्थापना एवं जौ बोना',
        content: 'शुभ मुहूर्त में मिट्टी के पात्र में जौ बोएं और ऊपर कलश स्थापित करें।'
      },
      {
        id: 'd2',
        stepNumber: 2,
        title: 'माँ दुर्गा ध्यान',
        content: 'सर्वमङ्गलमङ्गल्ये शिवे सर्वार्थसाधिके।\nशरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते॥'
      },
      {
        id: 'd3',
        stepNumber: 3,
        title: 'नवार्ण मंत्र जप',
        content: 'ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे'
      },
      {
        id: 'd4',
        stepNumber: 4,
        title: 'कुंकुमार्चन एवं चुनरी अर्पण',
        content: 'देवी को लाल चुनरी, सिंदूर, अक्षत और लाल पुष्प अर्पित करें।'
      },
      {
        id: 'd5',
        stepNumber: 5,
        title: 'दुर्गा आरती एवं क्षमा प्रार्थना',
        content: 'अम्बे तू है जगदम्बे काली... आरती गाएं एवं क्षमा प्रार्थना करें।'
      }
    ],
    sections: [
      { sectionId: 's1', sectionType: 'Heading', content: 'Durga Sthapana & Avahan' },
      { sectionId: 's2', sectionType: 'Description', content: 'Worship of Maa Durga for strength, spiritual protection, and destruction of negative energies.' },
      { sectionId: 's3', sectionType: 'Dhyan', content: 'Sarva Mangala Mangalye Shive Sarvartha Sadhike\nSharanye Tryambake Gauri Narayani Namostute' },
      { sectionId: 's4', sectionType: 'Heading', content: 'Maa Durga Navarna Mantra' },
      { sectionId: 's5', sectionType: 'Mantra', content: 'Om Aim Hreem Kleem Chamundayai Viche' },
    ]
  },
  {
    id: 'p6',
    title: 'Deepawali Maha Lakshmi Pujan',
    headerTitle: 'लक्ष्मी पूजन',
    titleHindi: 'श्री महालक्ष्मी एवं कुबेर पूजन',
    subtitleHindi: 'दीपावली पूजन क्रम',
    breadcrumbs: 'पूजा विधि  /  लक्ष्मी पूजन',
    navAnchors: ['सामग्री', 'प्रारंभ', 'ध्यान', 'अर्चन', 'आरती'],
    category: 'Lakshmi Pooja',
    subCategory: 'Rajopchar Pooja',
    samagriList: [
      'महालक्ष्मी-गणेश चित्र, कमल पुष्प, कौड़ियां, कमलगट्टा, धनिया, खील-बताशे',
      'दीपक (घी एवं तेल), कुमकुम, अक्षत, पंचामृत, फल, मिष्ठान्न'
    ],
    stepsList: [
      {
        id: 'l1',
        stepNumber: 1,
        title: 'दीप प्रज्ज्वलन एवं शुद्धि',
        content: 'शुभं करोति कल्याणमारोग्यं धनसंपदा।\nशत्रुबुद्धिविनाशाय दीपज्योतिर्नमोऽस्तु ते॥'
      },
      {
        id: 'l2',
        stepNumber: 2,
        title: 'महालक्ष्मी ध्यान',
        content: 'नमस्तेऽस्तु महामाये श्रीपीठे सुरपूजिते।\nशङ्खचक्रगदाहस्ते महालक्ष्मि नमोऽस्तु ते॥'
      },
      {
        id: 'l3',
        stepNumber: 3,
        title: 'कमल एवं कौड़ी अर्पण',
        content: 'माता लक्ष्मी को कमल का फूल, कौड़ियां और कमलगट्टे अर्पित करें।'
      },
      {
        id: 'l4',
        stepNumber: 4,
        title: 'महालक्ष्मी मंत्र',
        content: 'ॐ श्रीं ह्रीं क्लीं महालक्ष्म्यै नमः'
      },
      {
        id: 'l5',
        stepNumber: 5,
        title: 'कुबेर एवं बहीखाता पूजन',
        content: 'धन कुबेर एवं व्यापारिक खाता-पुस्तकों का कुमकुम-अक्षत से पूजन करें।'
      }
    ],
    sections: [
      { sectionId: 's1', sectionType: 'Heading', content: 'Lakshmi-Ganesh Pujan' },
      { sectionId: 's2', sectionType: 'Description', content: 'Invoking Goddess Lakshmi and Lord Kuber for wealth, peace, prosperity and auspiciousness.' },
      { sectionId: 's3', sectionType: 'Dhyan', content: 'Namastestu Mahamaye Shree Peethe Sura Poojite\nShankha Chakra Gada Haste Maha Lakshmi Namostute' },
      { sectionId: 's4', sectionType: 'Heading', content: 'Maha Lakshmi Mantra' },
      { sectionId: 's5', sectionType: 'Mantra', content: 'Om Shreem Hreem Kleem Maha Lakshmyai Namaha' },
    ]
  },
  {
    id: 'p7',
    title: 'Hanuman Janmotsav & Sundarkand',
    headerTitle: 'हनुमान पूजा',
    titleHindi: 'श्री हनुमान जन्मोत्सव एवं सुन्दरकाण्ड',
    subtitleHindi: 'संक्षिप्त हनुमान पूजन क्रम',
    breadcrumbs: 'पूजा विधि  /  हनुमान पूजा',
    navAnchors: ['सामग्री', 'ध्यान', 'सिन्दूर', 'चालीसा', 'आरती'],
    category: 'Hanuman Pooja',
    subCategory: 'Panchopchar Pooja',
    samagriList: [
      'हनुमान जी का चित्र, चमेली का तेल, नारंगी सिन्दूर, लाल लंगोट/वस्त्र',
      'लाल पुष्प (गुड़हल/गेंदा), गुड़-चना, बूंदी के लड्डू, तुलसी पत्ता, धूप, दीप'
    ],
    stepsList: [
      {
        id: 'h1',
        stepNumber: 1,
        title: 'श्री हनुमान ध्यान',
        content: 'मनोजवं मारुततुल्यवेगं जितेन्द्रियं बुद्धिमतां वरिष्ठम्।\nवातात्मजं वानरयूथमुख्यं श्रीरामदूतं शरणं प्रपद्ये॥'
      },
      {
        id: 'h2',
        stepNumber: 2,
        title: 'सिन्दूर एवं चमेली तेल लेपन',
        content: 'सिन्दूरं शोभनं रक्तं सौभाग्यं सुखवर्धनम्।\nशुभदं कामदं चैव सिन्दूरं प्रतिगृह्यताम्॥'
      },
      {
        id: 'h3',
        stepNumber: 3,
        title: 'हनुमान मूल मंत्र',
        content: 'ॐ नमो हनुमते रुद्रावताराय सर्वशत्रुसंहारणाय स्वाहा'
      },
      {
        id: 'h4',
        stepNumber: 4,
        title: 'श्री हनुमान चालीसा पाठ',
        content: 'श्रीगुरु चरन सरोज रज निज मनु मुकुरु सुधारि। बरनउँ रघुबर बिमल जसु जो दायकु फल चारि॥'
      },
      {
        id: 'h5',
        stepNumber: 5,
        title: 'आरती कीजै हनुमान लला की',
        content: 'आरती कीजै हनुमान लला की। दुष्ट दलन रघुनाथ कला की॥'
      }
    ],
    sections: [
      { sectionId: 's1', sectionType: 'Heading', content: 'Shri Hanuman Avahan' },
      { sectionId: 's2', sectionType: 'Description', content: 'Offering Sindoor, Chameli oil, and red flowers to Bajrangbali for courage, strength and protection.' },
      { sectionId: 's3', sectionType: 'Dhyan', content: 'Manojavam Maruta Tulya Vegam Jitendriyam Buddhimatam Varishtham\nVatatmajam Vanara Yootha Mukhyam Shrirama Dootam Sharanam Prapadye' },
      { sectionId: 's4', sectionType: 'Heading', content: 'Mool Mantra' },
      { sectionId: 's5', sectionType: 'Mantra', content: 'Om Namo Hanumate Rudravataraya Sarvashatru Samharanaya Swaha' },
    ]
  }
];
