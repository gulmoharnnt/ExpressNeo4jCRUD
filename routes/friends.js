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
