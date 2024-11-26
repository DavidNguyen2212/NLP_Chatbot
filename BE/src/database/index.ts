import { connect, ConnectOptions, set } from 'mongoose';
import { NODE_ENV, DB_URI, DB_DATABASE } from '@config';

export const dbConnection = async () => {
  const dbConfig = {
    url: `${DB_URI}/${DB_DATABASE}`,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as ConnectOptions,
  };

  if (NODE_ENV !== 'production') {
    set('debug', true);
  }

  try {
    await connect(dbConfig.url, dbConfig.options);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    console.log(dbConfig.url)
  }
}
