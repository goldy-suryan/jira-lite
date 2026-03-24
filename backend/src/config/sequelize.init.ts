import { Sequelize } from 'sequelize';

export class DBConfig {
  static readonly sequelize = new Sequelize({
    username: process.env.SEQUEL_USERNAME!,
    password: process.env.SEQUEL_PASSWORD!,
    database: process.env.SEQUEL_DATABASE!,
    dialect: 'postgres',
    host: 'localhost',
    pool: {
      max: 10,
    },
    port: 5432,
  });

  async connectDB() {
    try {
      await DBConfig.sequelize.authenticate();
      console.log('Connected to DB');
    } catch (e) {
      console.log('error connecting DB', e);
      process.exit(1);
    }
  }
}
