export interface Book {
  id: string;
  title: string;
  author: string;
  subTitle: string;
  imageLink: string;
  audioLink: string;
  totalRating: number;
  averageRating: number;
  keyIdeas: number;
  type: string;
  status: string;
  subscriptionRequired: boolean;
  summary: string;
  tags: string[];
  bookDescription: string;
  authorDescription: string;
}

export const mockBooks: Book[] = [
  {
    id: "1",
    title: "The 7 Habits of Highly Effective People",
    author: "Stephen R. Covey",
    subTitle: "Powerful Lessons in Personal Change",
    imageLink: "https://images-na.ssl-images-amazon.com/images/I/51S-M-tzdVL._SX329_BO1,204,203,200_.jpg",
    audioLink: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    totalRating: 12420,
    averageRating: 4.6,
    keyIdeas: 12,
    type: "book",
    status: "completed",
    subscriptionRequired: false,
    summary: "A comprehensive guide to developing personal effectiveness through character-based principles.",
    tags: ["Self-Help", "Productivity", "Leadership"],
    bookDescription: "In The 7 Habits of Highly Effective People, author Stephen R. Covey presents a holistic, integrated, principle-centered approach for solving personal and professional problems.",
    authorDescription: "Stephen R. Covey was an American educator, author, businessman, and keynote speaker."
  },
  {
    id: "2", 
    title: "Atomic Habits",
    author: "James Clear",
    subTitle: "An Easy & Proven Way to Build Good Habits & Break Bad Ones",
    imageLink: "https://images-na.ssl-images-amazon.com/images/I/51B7kuFwLHL._SX329_BO1,204,203,200_.jpg",
    audioLink: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    totalRating: 8950,
    averageRating: 4.8,
    keyIdeas: 15,
    type: "book",
    status: "progress",
    subscriptionRequired: true,
    summary: "A practical guide to building good habits and breaking bad ones through small, incremental changes.",
    tags: ["Self-Help", "Productivity", "Psychology"],
    bookDescription: "Atomic Habits will reshape the way you think about progress and success, and give you the tools and strategies you need to transform your habits.",
    authorDescription: "James Clear is an author and speaker focused on habits, decision making, and continuous improvement."
  },
  {
    id: "3",
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    subTitle: "The Landmark Bestseller Now Revised and Updated",
    imageLink: "https://images-na.ssl-images-amazon.com/images/I/51UoqRcVVmL._SX329_BO1,204,203,200_.jpg",
    audioLink: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    totalRating: 15600,
    averageRating: 4.4,
    keyIdeas: 13,
    type: "book",
    status: "barely-started",
    subscriptionRequired: false,
    summary: "The classic guide to achieving wealth and success through the power of thought and persistence.",
    tags: ["Business", "Success", "Mindset"],
    bookDescription: "Think and Grow Rich has been called the 'Granddaddy of All Motivational Literature.'",
    authorDescription: "Napoleon Hill was an American self-help author who is widely considered to be one of the great writers on success."
  },
  {
    id: "4",
    title: "The Lean Startup",
    author: "Eric Ries",
    subTitle: "How Today's Entrepreneurs Use Continuous Innovation",
    imageLink: "https://images-na.ssl-images-amazon.com/images/I/51T-sMqSMiL._SX329_BO1,204,203,200_.jpg",
    audioLink: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    totalRating: 7800,
    averageRating: 4.3,
    keyIdeas: 11,
    type: "book",
    status: "completed",
    subscriptionRequired: true,
    summary: "A methodology for developing businesses and products through validated learning and iterative design.",
    tags: ["Business", "Entrepreneurship", "Innovation"],
    bookDescription: "The Lean Startup provides a scientific approach to creating and managing successful startups.",
    authorDescription: "Eric Ries is an entrepreneur and author recognized for his work on the lean startup methodology."
  },
  {
    id: "5",
    title: "Mindset",
    author: "Carol S. Dweck",
    subTitle: "The New Psychology of Success",
    imageLink: "https://images-na.ssl-images-amazon.com/images/I/41r2iDQWl8L._SX329_BO1,204,203,200_.jpg",
    audioLink: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    totalRating: 9200,
    averageRating: 4.5,
    keyIdeas: 10,
    type: "book",
    status: "progress",
    subscriptionRequired: false,
    summary: "Explores how our beliefs about our abilities affect our success and how we can develop a growth mindset.",
    tags: ["Psychology", "Self-Help", "Education"],
    bookDescription: "Mindset reveals how great parents, teachers, managers, and athletes can put this idea to use to foster outstanding accomplishment.",
    authorDescription: "Carol S. Dweck is a renowned Stanford University psychologist."
  },
  {
    id: "6",
    title: "The Power of Now",
    author: "Eckhart Tolle",
    subTitle: "A Guide to Spiritual Enlightenment",
    imageLink: "https://images-na.ssl-images-amazon.com/images/I/41VJJlKKOQL._SX329_BO1,204,203,200_.jpg",
    audioLink: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    totalRating: 11500,
    averageRating: 4.7,
    keyIdeas: 8,
    type: "book",
    status: "barely-started",
    subscriptionRequired: true,
    summary: "A spiritual guide to finding peace and happiness by living in the present moment.",
    tags: ["Spirituality", "Mindfulness", "Self-Help"],
    bookDescription: "The Power of Now shows readers how to recognize themselves as the creators of their own pain.",
    authorDescription: "Eckhart Tolle is a spiritual teacher and author who was born in Germany and educated at the Universities of London and Cambridge."
  }
];

export const getRecommendedBooks = (): Book[] => {
  return mockBooks.slice(0, 5);
};

export const getSuggestedBooks = (): Book[] => {
  return mockBooks.slice(2, 6);
};

export const getBookById = (id: string): Book | undefined => {
  return mockBooks.find(book => book.id === id);
};