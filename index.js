const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

morgan.token('body', (req, res) => {
  if (Object.keys(req.body).length !== 0) {
    return JSON.stringify(req.body);
  }
});

app.use(express.static('dist'));
app.use(cors());
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id); 

  response.status(204).end();
});

const generateId = () => {
  let min = 0;
  let max = 100000000;
  return Math.floor(Math.random() * (max - min) + min);
}

app.post('/api/persons', (request, response) => {
  const body = request.body; 
  let person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  if (!person.name || !person.number) {
    response.status(400).json( {
      error: "Missing name or number."
    })
  } else if (persons.some(per => per.name === person.name)) {
    response.status(400).json( {
      error: "Person already exists."
    });
  } else {
    persons.push(person);
    response.json(person);
  }
});

app.get('/api/persons/:id', (request, response) => {
   const id = Number(request.params.id);
   const person = persons.find(person => person.id === id);

   if (person) {
    response.json(person);
   } else {
    response.status(404).end();
   }
});

app.get('/', (request, response) => {
  response.send('<h1>Hello There</h1>');
});

app.get('/info', (request, response) => {
  const dateOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'long'
  }
  const date = new Date().toLocaleDateString("en-US", dateOptions);

  const responseText = 
  `<p>Phonebook has info for ${persons.length} people.</p>
  ${date}`  

  response.end(responseText);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});