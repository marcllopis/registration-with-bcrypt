const express = require('express');
const connection = require('./conf');
const app = express();
const bcrypt = require('bcrypt');
const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

connection.connect((err) => {
  if (err) {
    console.error(`Sorry, your connection to the DB is no possible because of. Error: ${err}`);
    return;
  }
  console.log('Nice! You made it to your DB, you rock!')
})


app.post('/register', (req, res) => {

  bcrypt
    .hash(req.body.password, 10)
    .then((hashedPassword) => {
      let user = {
        username: req.body.username,
        password: hashedPassword,
        description: req.body.description
      }
      connection.query('INSERT INTO user SET ?', user, (err) => {
        if (err) {
          res.status(500).send('Server Error, we could not register that user :(')
        } else {
          res.status(201).send('Successfully registered! :D')
        }
      })
    })
    .catch(hasError => console.error(`Error hashing password. Error: ${hasError}`))

})


app.post('/login', (req,res) => {
  console.log('login!', req.body)

  connection.query(`SELECT * from user WHERE username='${req.body.username}'`, (err,results) => {
    if(err){
      res.status(500).send('We could not find a user with that username :(')
    } else {
      bcrypt
        .compare(req.body.password, results[0].password)
        .then((isThereAMatch) => {
          if(isThereAMatch){
            res.json({
              username: results[0].username,
              description: results[0].description,
              message:'You have successfully logged in!',
              token: '12863vf178dfb1092d8h1º9d'
            })
          } else {
            res.send('Wrong password, get out!')
          }
        })
    }
  })
})




app.listen(port, (err) => {
  if (err) throw new Error('Ups, something is not working as expected :(')
  console.log(`Great, your server is running at port: ${port}`)
})
