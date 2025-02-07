const express = require('express');
const {Client} = require('pg')
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json())

const con = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'demodb',
  password: 'lunix12',   
  port: 5432,
});

con.connect().then(() => console.log("connected"))


app.post('/postData', async (req, res) => {
  const { name, age, address } = req.body;
  try {
    const result = await con.query(
      'INSERT INTO student (name, age, address) VALUES ($1, $2, $3) RETURNING *',
      [name, age, address]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/getData', async(req,res) => {
    try {
        const result = await con.query('SELECT * FROM student');
        res.json(result.rows)
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/getOne/:id', async (req, res) => {
  const { id }  = req.params;
  try {
    const result = await con.query('SELECT * FROM student WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put('/updateData/:id', async(req,res) => {
    const {id} = req.params;
    const {name,age,address} = req.body;

    try {
       const result = await con.query('UPDATE student SET name = $1, age = $2, address = $3 WHERE id = $4 RETURNING *',
        [name,age,address,id]
       );
       res.json(result.rows[0]); 
    } catch (error) {
        res.status(500).json(error.message);
    }
  });


app.delete('/deleteData/:id', async(req,res) => {
   const {id} = req.params;
   try {
    await con.query('DELETE FROM student WHERE id = $1', [id]);
    res.sendStatus(200);
   } catch (error) {
    res.status(500).send(error.message);
   }
});



const PORT = 3005;
app.listen(PORT,() => console.log(`server running on:${PORT}`));
