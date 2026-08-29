import { CommunityPost } from '../types';

export const initialCommunityPosts: CommunityPost[] = [
  {
    id: 'post-101',
    authorName: 'Shantaram Jadhav',
    authorAvatar: '👨🏽‍🌾',
    authorLocation: 'Wardha, Maharashtra',
    authorRole: 'Farmer',
    timestamp: '2 hours ago',
    cropTag: 'cotton',
    category: 'question',
    title: 'कापसाच्या पाठीमागे पांढरी माशी खूप वाढली आहे, काय उपाय करावा? (Heavy whitefly infestation behind cotton leaves)',
    content: 'गेल्या ४ दिवसांत पाऊस थांबल्यावर अचानक पांढरी माशीचा प्रादुर्भाव वाढला आहे. मी पिवळे चिकट सापळे लावले आहेत पण अजून काही फवारणी करावी लागेल का? (After rain stopped, whitefly spiked. I installed yellow sticky traps, is spraying needed?)',
    imageUrl: 'https://images.unsplash.com/photo-1598512752271-33f913a5af13?w=800&auto=format&fit=crop&q=80',
    upvotes: 24,
    hasUpvoted: false,
    commentsCount: 3,
    comments: [
      {
        id: 'c-1',
        author: 'Dr. Pravin Shinde',
        role: 'KVK Expert',
        text: 'हवामान पाहता उद्या पाऊस येऊ शकतो, त्यामुळे रासायनिक फवारणी टाळा. ५% निंबोळी अर्क (NSKE 5%) किंवा अझाडिरॅक्टिन १०,००० ppm २ मिली/लिटर सकाळी फवारा. (Avoid chemical spray before rain. Spray NSKE 5% in morning).',
        timestamp: '1 hour ago',
        isExpertReply: true
      },
      {
        id: 'c-2',
        author: 'Ramesh Patil',
        role: 'Farmer',
        text: 'मी एकरी १० पिवळे चिकट ट्रॅप लावले आहेत, चांगला परिणाम मिळतोय.',
        timestamp: '45 mins ago'
      }
    ]
  },
  {
    id: 'post-102',
    authorName: 'Gurpreet Singh Dhillon',
    authorAvatar: '👳🏽‍♂️',
    authorLocation: 'Ludhiana, Punjab',
    authorRole: 'Farmer',
    timestamp: '4 hours ago',
    cropTag: 'wheat',
    category: 'buy_sell_equipment',
    title: '🚜 For Sale: Super Seeder (7.5 Feet) — 2 Seasons Used in Mint Condition',
    content: 'Selling my Shaktiman Super Seeder with double disc drill. Maintained with zero wear on blades. Fits 50+ HP tractor. Direct sowing in standing paddy stubble with zero smoke/burning.',
    equipmentPrice: '₹1,35,000 (Negotiable / Kisan P2P EMI available)',
    imageUrl: 'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?w=800&auto=format&fit=crop&q=80',
    upvotes: 42,
    hasUpvoted: true,
    commentsCount: 5,
    comments: [
      {
        id: 'c-3',
        author: 'Harpreet Singh',
        role: 'Farmer',
        text: 'Where is your village? Can I inspect it this Sunday?',
        timestamp: '2 hours ago'
      },
      {
        id: 'c-4',
        author: 'Gurpreet Singh Dhillon',
        role: 'Farmer',
        text: 'Near Samrala bypass. You can call me on 98140-XXXXX.',
        timestamp: '1 hour ago'
      }
    ]
  },
  {
    id: 'post-103',
    authorName: 'Satyanarayana Murthy',
    authorAvatar: '👨🏾‍🌾',
    authorLocation: 'Rajahmundry, Andhra Pradesh',
    authorRole: 'Farmer',
    timestamp: '1 day ago',
    cropTag: 'rice',
    category: 'success_story',
    title: 'Paddy Direct Seeding (DSR) saved 38% water & ₹4,500/acre in nursery labor!',
    content: 'Sharing my results with direct seeded paddy using drum seeder. Soil aeration is better, tillers average 22 per hill, and no transplanting shock. Happy to guide fellow farmers on seed treatment!',
    imageUrl: 'https://images.unsplash.com/photo-1536939459926-301728717817?w=800&auto=format&fit=crop&q=80',
    upvotes: 68,
    hasUpvoted: false,
    commentsCount: 8,
    comments: [
      {
        id: 'c-5',
        author: 'Suresh Reddy',
        role: 'Farmer',
        text: 'Very inspiring Murthy garu! What weedicide did you apply at 15-20 DAS?',
        timestamp: '18 hours ago'
      },
      {
        id: 'c-6',
        author: 'Dr. K. Rao',
        role: 'Agronomist',
        text: 'Bispyribac sodium @ 100ml/acre is effective for grass and sedge weeds in DSR at 2-3 leaf stage.',
        timestamp: '12 hours ago',
        isExpertReply: true
      }
    ]
  }
];
