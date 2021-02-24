const express = require('express');
const cors = require('cors');
const { uuid, isUuid  } = require('uuidv4');

const app = express();

app.use(cors());
app.use(express.json());
// MÉTODOS HTTP:

// GET: Buscar informações no back-end
// POST: Criar Informações no back-end
// PUT/PATCH: Alterar informações no back-end
// DELETE: Deletar informações no back end

// TIPOS DE PARÂMETROS:

// Query Params: Filtros e paginação
// Route Params: Identificar recursos (Atualizar/deletar)
// Request Body: Contéudo na hora criar ou editar um recurso (JSON)

const projects = [];

function logRequests(request, respose, next) {
    const { method, url } = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    
    console.time(logLabel);

     next(); //Prócimo middlewatr

     
    console.timeEnd(logLabel);
}

function validateProjectId(request, response, next){
    const {id} = request.params;

    if (!isUuid(id)){
        return response.status(400).json({ error: 'Invalid project ID.'});
    }

    return next();
}

app.use(logRequests);
app.use('/projects/:id', validateProjectId )

app.get('/projects',  (request, response) => {
    const { title } = request.query;

const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects;

return response.json(results);
});

app.post('/projects', (request, response) => {
    const {title, owner} = request.body;

    const project = {id: uuid(), title, owner}

    projects.push(project);

    return response.json(project)
})

app.put('/projects/:id',  (request, response) => {
    const {id} = request.params;
    const {title, owner} = request.body;

    const projectIndex = projects.findIndex(project => project.id == id);
    
    if (projectIndex <0){
        return response.status(400).json({ error: 'Project not found.'})
    }

    const project = {
        id,
        title,
        owner
    }

    projects[projectIndex] = project;
  
    return response.json(project);
})

app.delete('/projects/:id', (request, response) => {
    const {id} = request.params;

    const projectIndex = projects.findIndex(project => project.id == id);
    
    if (projectIndex <0){
        return response.status(400).json({ error: 'Project not found.'})
    }

    projects.splice(projectIndex, 1);
   
  
    return response.status(204).send();
})


app.listen(3333, () => {
    console.log('🐱‍🏍 Back-End started!');
});