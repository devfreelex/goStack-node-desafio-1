const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const id = uuid()
  const likes = 0
  const { title, url, techs } = request.body
  const newRepository = { id, title, url, techs, likes}

  repositories.push(newRepository)

  response.json(newRepository)
});

app.put("/repositories/:id", (request, response) => {

  const { title, url, techs } = request.body

  const newData = { title, url, techs }

  const repository = repositories.find( repository => {
    if(repository.id === request.params.id) return repository
  })

  if(!repository) return response.status(400).json({error: 'Repository not found.'})

  Object.assign(repository, newData)

  response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const id = request.params.id
  const repositoryIndex = repositories.findIndex( repository => repository.id === id)
  
  if(repositoryIndex < 0) response.status(400).json({error: 'Repository not found.'})

  repositories.splice(repositoryIndex, 1)
  
  response.status(204).send()

});

app.post("/repositories/:id/like", (request, response) => {
  const id = request.params.id 

  if(!isUuid(id)) response.status(400).json({error: 'Invalid repository UUID.'})

  const repository = repositories.find( repository => repository.id === id)
  repository.likes = repository.likes + 1

  response.json(repository)

});

module.exports = app;
