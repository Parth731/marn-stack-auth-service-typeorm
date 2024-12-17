import { MongoClient } from 'mongodb';

export const connectToDatabase = async (): Promise<void> => {
  // Define the connection URI and types
  const uri: string = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}.aiqxk.mongodb.net/${process.env.MONGODB_DB}`;

  // Create a new MongoClient instance with proper typing
  const client: MongoClient = new MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log('Connected to MongoDB Atlas!');

    // Get a reference to the database and collection
    // const database: Db = client.db('<dbname>');
    // const collection: Collection = database.collection('<collectionName>');

    // Example operation: Insert a document with proper typing
    // const document = { name: 'John Doe', age: 30 };
    // const result: InsertOneResult = await collection.insertOne(document);

    // console.log('Document inserted with _id:', result.insertedId);
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
  }
};

// Call the function
