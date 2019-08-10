const Pool = require('pg').Pool;
// const connectionString = process.env.DATABASE_URL 
//|| 'postgres://fpaycuqbirsmrx:0f353fda665bb22033a912f4c6ee88b970d28613228e45156e1bbce9fd31a847@ec2-75-101-128-10.compute-1.amazonaws.com:5432/ddlsac6c42g4d4';

// console.log(`DATABASE_URL: ${connectionString}`);

// const pool = new Pool({
//   connectionString: connectionString,
// });

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'project7',
  password: 'postgres',
  port: 5432,
})

let current = null;
let asc = true;

/*
CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  firstname VARCHAR(100) NOT NULL,
  lastname VARCHAR(100) NOT NULL,
  age integer NOT NULL,
  email VARCHAR(100) NOT NULL
);
*/

const getUsers = (req, res) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (err, results) => {
    if (err) {
      throw err
    }
    // res.status(200).json(results.rows);

    res.render('pages/users', {
      users: results.rows
    })
  })
}

const getUserById = (req, res) => {
  const id = parseInt(req.params.id)

  console.log(id);

  pool.query('SELECT * FROM users WHERE id = $1', [id], (err, results) => {
    if (err) {
      throw err
    }
    res.status(200).json(results.rows)
  })
}

const getEditUser = (req, res) => {
  const id = req.params.id;
  current = req.params.id;

  // console.log(id);

  pool.query('SELECT * FROM users WHERE id = $1', [id], (err, results) => {
    if (err) {
      throw err
    }
    console.log("RESULTS: ");
    console.log(results.rows[0]);
    res.render('pages/edit', {
      user: results.rows[0],
    });
  })
}

const createUser = (req, res) => {
  const { firstname, lastname, age, email } = req.body;
  // console.log(`${name}, ${age}, ${email}`);
  
  let userAge = parseInt(age, 10);
  if (isNaN(userAge)){ 
    userAge = 0;
  }

  pool.query('INSERT INTO users (firstname, lastname, age, email) VALUES ($1, $2, $3, $4) RETURNING *', [firstname, lastname, userAge, email], (err, results) => {
    if (err) {
      throw err
    }
    console.log(`id: ${JSON.stringify(results.rows[0])}`);  //id: {"id":9,"name":"Peter","age":25,"email":"pjohnson@mtech.org"}
    // res.status(201).send(`User added with ID: ${results.rows[0].id}  `)
    res.redirect('/users');
  })
}

const updateUser = (req, res) => {
  const id = current;
  const { firstname, lastname, age, email } = req.body;
  let userAge = parseInt(age, 10);

  pool.query(
    'UPDATE users SET firstname = $1, lastname = $2, age = $3, email = $4 WHERE id = $5',
    [firstname, lastname, userAge, email, id],
    (err, results) => {
      if (err) {
        throw err
      }
      res.redirect('/users');
    }
  )
}

const deleteUser = (req, res) => {
  const id = req.params.id;

  pool.query('DELETE FROM users WHERE id = $1', [id], (err, results) => {
    if (err) {
      throw err
    }
    res.redirect('/users');
  })
}

const searchUser = (req, res) => {
  const { firstname, lastname } = req.body;
  console.log('NAME: ')
  console.log(firstname + lastname);

  if(firstname && lastname) {
    pool.query('SELECT * FROM users WHERE firstname = $1 AND lastname = $2', [firstname, lastname], (err, results) => {
      if (err) {
        throw err
      }
      console.log(results.rows);
      res.render('pages/foundUser', {
        users: results.rows,
        firstname: firstname,
        lastname: lastname,
      })
    })
  }
  else if(firstname) {
    pool.query('SELECT * FROM users WHERE firstname = $1', [firstname], (err, results) => {
      if (err) {
        throw err
      }
      console.log(results.rows);
      res.render('pages/foundUser', {
        users: results.rows,
        firstname: firstname,
      })
    })
  }
  else if(lastname) {
    pool.query('SELECT * FROM users WHERE lastname = $1', [lastname], (err, results) => {
      if (err) {
        throw err
      }
      console.log(results.rows);
      res.render('pages/foundUser', {
        users: results.rows,
        lastname: firstname,
      })
    })
  }

}

const sortUsers = (req, res) => {
  asc = !asc;
  if(asc) {
    pool.query('SELECT * FROM users ORDER BY lastname DESC', (err, results) => {
      if (err) {
        throw err;
      }
      res.render('pages/users', {
        users: results.rows
      })
    })
  }
  else {
    pool.query('SELECT * FROM users ORDER BY lastname ASC', (err, results) => {
      if (err) {
        throw err;
      }
      res.render('pages/users', {
        users: results.rows
      })
    })
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  getEditUser,
  updateUser,
  deleteUser,
  searchUser,
  sortUsers
}