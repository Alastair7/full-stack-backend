require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const mongoose = require("mongoose");
morgan.token("person", (req) => {
  return JSON.stringify(req.body);
});

const app = express();
app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(morgan(":method :url :status - :response-time ms :person"));

if (process.argv.length < 1) {
  console.log("Give password as argument");
  process.exit(1);
}
if (process.argv.length === 5) {
  person.save().then((result) => {
    console.log("Person saved.");
    mongoose.connection.close();
  });
}

if (process.argv.length === 3) {
  Persons.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
}

app.get("/", (request, response) => {
  response.send(`<h1>Hello World!</h1>`);
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((result) => {
    response.json(result);
  });
});
app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => response.json(person));
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Content Missing",
    });
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    console.log("SavedPerson:", savedPerson);
    response.json(person);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.get("/info", (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date()}</p>`);
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
