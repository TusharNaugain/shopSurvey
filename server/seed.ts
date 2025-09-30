import { storage } from "./storage";

const DEFAULT_QUESTIONS = [
  {
    text: 'How satisfied are you with our products?',
    type: 'rating_5',
    required: 1,
    order: 1
  },
  {
    text: 'How fair are the prices compared to similar retailers?',
    type: 'rating_5',
    required: 1,
    order: 2
  },
  {
    text: 'How satisfied are you with the value for money of your purchase?',
    type: 'rating_5',
    required: 1,
    order: 3
  },
  {
    text: 'On a scale of 1-10 how would you recommend us to your friends and family?',
    type: 'rating_10',
    required: 1,
    order: 4
  },
  {
    text: 'What could we do to improve our service?',
    type: 'text',
    required: 0,
    order: 5
  }
];

export async function seedDatabase() {
  try {
    const existingQuestions = await storage.getQuestions();
    
    if (existingQuestions.length === 0) {
      console.log('Seeding database with default questions...');
      
      for (const question of DEFAULT_QUESTIONS) {
        await storage.createQuestion(question);
      }
      
      console.log('Database seeded successfully!');
    } else {
      console.log('Database already has questions, skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}
