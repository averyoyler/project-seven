const express = require('express');
const path = require('path');
const app = express();
const db = require('./query');

// this needs 'dotenv'
const PORT = process.env.PORT || 5050;

app.use(express.json()); // like body-parser
app.use(express.urlencoded({ extended: true }));
//app.use(cookieParser());



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('pages/index');
});

app.get('/form', (req, res) => {
  res.render('pages/form');
});

app.get('/search', (req, res) => {
  res.render('pages/search');
});


app.get('/sort', db.sortUsers);
app.get('/deleteuser/:id', db.deleteUser);
app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.get('/edituser/:id', db.getEditUser)
app.post('/addUser', db.createUser)
app.post('/updateUser', db.updateUser)
app.post('/removeUser', db.deleteUser)
app.post('/search', db.searchUser);


app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}.`)
});