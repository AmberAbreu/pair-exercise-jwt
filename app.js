const express = require('express');
const app = express();
app.use(express.json());
const { models: { User, Note } } = require('./db');
const path = require('path');


app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.post('/api/auth', async (req, res, next) => {
  try {
    res.send({ token: await User.authenticate(req.body) });
  }
  catch (ex) {
    next(ex);
  }
});

app.get('/api/auth', async (req, res, next) => {
  try {
    res.send(await User.byToken(req.headers.authorization));
  }
  catch (ex) {
    next(ex);
  }
});


app.get('/api/users/:id/notes', async (req, res, next) => {
  try {
    const user = await User.byToken(req.headers.authorization)
    console.log("this is user", user.id)
    console.log(req.params.id)

    if (user.id === req.params.id){
      const notes = await Note.findAll({where: {userId: req.params.id}})
      console.log("user checks out")
      res.send(notes);

    }else{
      res.status(401).send("Incorrect login!")
    }
  }
  catch (ex) {
    next(ex);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send({ error: err.message });
});

module.exports = app;
