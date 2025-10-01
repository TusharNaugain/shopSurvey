import { storage } from "./storage";

const DEFAULT_QUESTIONS = [
  {
    text: 'How satisfied are you with our products?',
    type: 'rating_5',
    order: 1
  },
  {
    text: 'How fair are the prices compared to similar retailers?',
    type: 'rating_5',
    order: 2
  },
  {
    text: 'How satisfied are you with the value for money of your purchase?',
    type: 'rating_5',
    order: 3
  },
  {
    text: 'On a scale of 1-10 how would you recommend us to your friends and family?',
    type: 'rating_10',
    order: 4
  },
  {
    text: 'What could we do to improve our service?',
    type: 'text',
    order: 5
  }
];

export async function seedDatabase() {
  try {
    console.log('Seeding database with default questions...');
    const existingQuestions = await storage.getQuestions();
    for (const question of existingQuestions) {
      await storage.deleteQuestion(question.id);
    }

    for (const question of DEFAULT_QUESTIONS) {
      await storage.createQuestion(question);
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}
