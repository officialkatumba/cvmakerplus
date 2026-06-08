const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');

require('dotenv').config();

const { normalizeMongoUri } = require('./utils/mongo_uri');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    const mongoUri = await normalizeMongoUri(process.env.MONGODB_URI);
    process.env.MONGODB_URI = mongoUri;

    const app = require('./app');
    const connectDB = require('./config/db');

    await connectDB(mongoUri);

    app.listen(PORT, () => {
      console.log(`CV Maker Plus listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
