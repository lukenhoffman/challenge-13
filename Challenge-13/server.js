const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection'); // Import the Sequelize connection

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// Sync sequelize models to the database, then turn on the server
sequelize.sync({ force: false }).then(() => {
  // If you set "force: true", it will drop and recreate all tables on every app restart.
  // Only use "force: true" for development and testing purposes.

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
  });
});
