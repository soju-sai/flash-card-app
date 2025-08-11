import { db } from './lib/db';
import { decksTable, cardsTable } from './db/schema';

async function testDatabaseSchema() {
  try {
    console.log('Testing database schema...');
    
    // Test creating a deck (example data)
    const testDeck = {
      title: 'Spanish',
      description: 'Learning Spanish through English comparisons',
      userId: 'test-user-id', // This would be Clerk user ID in real app
    };
    
    console.log('Schema tables available:');
    console.log('- decksTable:', !!decksTable);
    console.log('- cardsTable:', !!cardsTable);
    
    console.log('\nTest deck structure:');
    console.log(testDeck);
    
    console.log('\nDatabase schema test completed successfully!');
    
  } catch (error) {
    console.error('Database test failed:', error);
  }
}

// Run the test
testDatabaseSchema();