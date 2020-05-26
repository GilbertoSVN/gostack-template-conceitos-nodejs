const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateUniqueId(request, response, next) {
  const { id } = request.params;

  console.log(id);

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid ID' });
  }

  return next();
}

app.use('/repositories/:id', validateUniqueId);

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const project = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(project);

  return response.status(200).json(project);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex <= 0) {
    return response.status(400).json({ error: 'Bad request' });
  }

  repositories[repoIndex].title = title;
  repositories[repoIndex].url = url;
  repositories[repoIndex].techs = techs;

  return response.status(200).json(repositories[repoIndex]);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex <= 0) {
    return response.status(400).json({ error: 'Bad request ' });
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex <= 0) {
    return response.status(400).json({ error: 'Bad request ' });
  }

  repositories[repoIndex].likes += 1;

  return response.status(200).json(repositories[repoIndex]);
});

module.exports = app;
