# CRUD Operation Using ExpressJS and Neo4j

I will write a simple CRUD services Web-app by using ExpressJS and Neo4j as a persistence data store.

## ExpressJS

ExpressJS is a server-side web framework for NodeJS. It builds on the top of NodeJS. One of the important strength of ExpressJS is, it makes routing very easy. Furthermore, it is the most popular web framework in NodeJS world.

## Neo4j

Neo4j is a graph database management system developed by Neo4j, Inc. Described by its developers as an ACID-compliant transactional database with native graph storage and processing¹. It supports Cypher Query Language (CQL) to manipulate data in graph database. For this article, I will use docker to run neo4j instance.

```
docker run -p 7474:7474 -p 7687:7687 volume=$HOME/neo4j/data:/data neo4j
```

## Use Case

For this use case, I will create a USER service that can insert, update, list and delete a User data. The data will be stored as a graph inside Neo4j. And Will create a FRIEND service to create a friend relation between two users

### Step 1: Create Express App

I will create an express app with name _expressneo4jcrud_. First, I need to install express-generator in order to install a wizard to create project setup.

```
npm install express-generator -g
```

We can create a directory outline just by typing:

```
express --view=ejs expressneo4jcrud
```

It will generate files and folders that are necessary for express to run. Then type

```
cd expressneo4jcrud && npm install
npm start
```

Open a browser http://localhost:3000 to validate that your express is up and running.

### Step 2: Installing Modules

There are some modules that are necessary in order to make our service run based on its functionalities. For example, neo4j-driver module for database driver. There are many more modules to be installed.

```
npm install compression config express express-async-errors helmet neo4j-driver nodemon winston --save

npm install jest supertest eslint eslint-config-airbnb eslint-config-prettier eslint-plugin-import eslint-plugin-prettier eslint-plugin-react lint-staged prettier --save-dev
```

### Step 3: Setup Configuration Variables

We are using the _config_ npm package to configure our DB connection or other environment variables. Setup the configuration file to configure database connection parameters and several initial values.

```
// file: config/development.json
{
  "dbHost": "bolt://localhost:7687",
  "dbUser": "neo4j",
  "dbPass": "admin"
}

```

### Step 4: Database Connection Utility

For getting database session easier, I will create a utility file for database connectivity.

```
// file: startup/config.js

const config = require('config');

module.exports = function() {
  if (!config.get('dbHost')) {
    throw new Error('FATAL ERROR: dbHost is not defined.');
  }
};

```

### Step 5: Model

Now create a model as a persistence layer to graph database.

```
// file: middleware/graphDBConnect.js
const neo4j = require('neo4j-driver').v1;
const config = require('config');

const uri = config.get('dbHost');
const user = config.get('dbUser');
const password = config.get('dbPass');

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
  maxConnectionLifetime: 3 * 60 * 60 * 1000, // 3 hours
  maxConnectionPoolSize: 50,
  connectionAcquisitionTimeout: 2 * 60 * 1000, // 120 seconds
  disableLosslessIntegers: true
});

const session = driver.session();

async function executeCypherQuery(statement, params = {}) {
  try {
    const result = session.run(statement, params);
    session.close();
    return result;
  } catch (error) {
    throw error; // we are logging this error at the time of calling this method
  }
}

module.exports = { executeCypherQuery };
```

### Step 6: Routes

Create a router.js file in startup folder to include all the routes.

```
// startup/routes.js
const express = require('express');
const users = require('../routes/users');
const friends = require('../routes/friends');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  app.use('/api/users', users);
  app.use('/api/friends', friends);
  app.use(error);
};

```

Create a function to Users route service endpoint.

```
// routes/users.js
const express = require('express');
const router = express.Router();
const graphDBConnect = require('../middleware/graphDBConnect');

function formatResponse(resultObj) {
  const result = [];
  if (resultObj.records.length > 0) {
    resultObj.records.map(record => {
      result.push(record._fields[0].properties);
    });
  }
  return result;
}

router.post('/', async function(req, res) {
  const { id, name, email } = req.body;
  if (!id || id < 1 || !name || !email) {
    return res.status(400).send('Invalid Inputs');
  }

  const query = `CREATE (n:Users {id:$id, name:$name, email: $email}) RETURN n`;
  const params = {
    id: parseInt(id),
    name,
    email
  };
  const resultObj = await graphDBConnect.executeCypherQuery(query, params);
  const result = formatResponse(resultObj);
  res.send(result);
});
router.get('/', async function(req, res) {
  const query = 'MATCH (n:Users) RETURN n LIMIT 100';
  const params = {};
  const resultObj = await graphDBConnect.executeCypherQuery(query, params);
  const result = formatResponse(resultObj);
  res.send(result);
});

router.get('/:id', async function(req, res) {
  const { id } = req.params;
  const query = 'MATCH (n:Users {id: $id}) RETURN n LIMIT 100';
  const params = { id: parseInt(id) };
  const resultObj = await graphDBConnect.executeCypherQuery(query, params);
  const result = formatResponse(resultObj);
  res.send(result);
});
router.patch('/:id', async function(req, res) {
  const { id } = req.params;
  const { name, email } = req.body;
  let strName = name ? ` n.name = '${name}' ` : '';
  let strEmail = email ? ` n.email = '${email}' ` : '';
  if (strName && strEmail) {
    strEmail = ',' + strEmail;
  }

  const query = `MATCH (n:Users {id: $id}) SET ${strName} ${strEmail} RETURN n`;
  const params = { id: parseInt(id) };
  const resultObj = await graphDBConnect.executeCypherQuery(query, params);
  const result = formatResponse(resultObj);
  res.send(result);
});
router.delete('/:id', async function(req, res) {
  const { id } = req.params;
  const query = 'MATCH (n:Users {id: $id}) DELETE n';
  const params = { id: parseInt(id) };
  const resultObj = await graphDBConnect.executeCypherQuery(query, params);
  res.send('Delete success');
});

module.exports = router;

```

Create a function to Friends route service endpoint.

```
// routes/friends.js
const express = require('express');
const router = express.Router();
const graphDBConnect = require('../middleware/graphDBConnect');

function formatResponse(resultObj) {
  const result = [];
  if (resultObj.records.length > 0) {
    resultObj.records.map(record => {
      result.push(record._fields[0].properties);
    });
  }
  return result;
}

router.post('/add', async (req, res) => {
  const { source, destination } = req.body;
  if (!source || source < 1 || !destination || destination < 1) {
    return res.status(400).send('Invalid Inputs');
  }

  const query = `MATCH (n:Users {id:$source}), (f:Users {id:$destination}) CREATE (n)-[:FRIEND]->(f) RETURN n`;
  const params = {
    source,
    destination
  };
  const resultObj = await graphDBConnect.executeCypherQuery(query, params);
  const result = formatResponse(resultObj);
  res.send('Friends relation created successfully');
});

router.get('/list/:id', async (req, res) => {
  const { id } = req.params;
  const query = 'MATCH (n:Users {id: $id})-[:FRIEND]-(f) RETURN f LIMIT 100';
  const params = { id: parseInt(id) };
  const resultObj = await graphDBConnect.executeCypherQuery(query, params);
  const result = formatResponse(resultObj);
  res.send(result);
});

router.post('/delete', async (req, res) => {
  const { source, destination } = req.body;
  if (!source || source < 1 || !destination || destination < 1) {
    return res.status(400).send('Invalid Inputs');
  }
  const query =
    'MATCH (n:Users {id:$source})-[r:FRIEND]-(f:Users {id:$destination}) DELETE r';
  const params = {
    source,
    destination
  };
  const resultObj = await graphDBConnect.executeCypherQuery(query, params);
  const result = formatResponse(resultObj);
  res.send('Friends relation deleted successfully');
});

module.exports = router;

```

### Step 7: Error Logging

For logging we are using _winston_ package. We log all the errors in a file

```
// startup/logging.js
const winston = require('winston');
require('express-async-errors');

module.exports = function() {
  winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: 'uncaughtExceptions.log' })
  );

  process.on('unhandledRejection', ex => {
    throw ex;
  });

  winston.add(
    new winston.transports.File({
      filename: 'logfile.log',
      handleExceptions: true
    })
  );
};

```

### Step 8: app.js

And add the router to app.js

```
const express = require('express');
const winston = require('winston');

const app = express();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/config')();

const port = 7000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;

```

### Step 9: Execute and Run

```
npm run dev
```

Open a browser http://localhost:7000 to validate that your express is still up and running.
Now you can test the API's using any rest client like postman.

### Sample Code

That’s from me now. You can see complete source code, on my [github](https://github.com/gulmoharnnt/ExpressNeo4jCRUD).
