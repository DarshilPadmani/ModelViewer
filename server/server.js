const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const modelRoutes = require('./routes/modelRoutes');
const Model = require('./models/Model');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/model-viewer-ar';

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve static .glb models from /public/models
const publicDir = path.join(__dirname, 'public');
app.use('/models', express.static(path.join(publicDir, 'models')));

// API routes
app.use('/api/models', modelRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');

    // Seed a default model record if none exists so the frontend has something to load
    const count = await Model.countDocuments();
    if (count === 0) {
      await Model.create({
        name: 'Astronaut',
        // This assumes you place Astronaut.glb into server/public/models/Astronaut.glb
        modelUrl: '/models/Astronaut.glb'
      });
      console.log('Seeded default Astronaut model');
    }

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

