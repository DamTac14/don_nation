// REQUIRES AND IMPORT MODULES CALLS
// We must install all of this module
const sql = require('mysql2/promise');
const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken');
const session = require('express-session')

const multer = require('multer')
const path = require('path');



//CONSTRUCTION OF MY PORT, MY ENVIRONMENT
const port = 7005;
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'client', 'public')));

// Enable CORS requests
app.use(cors({
    origin: `http://localhost:7000`,
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    credentials: true
  }));


/* Use of the express library with the session module which allows the creation of a cookie and the storage
  a token from the API server */
  app.use(session({
    name:'token',
    secret: process.env.ACCESS_TOKEN_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      SameSite:'lax',
      secure: false,
      maxAge: 7200000
    }
  }));


// Configure the link with the database
const config = require('./configuration/configuration.json');
console.log(config);
const pool_connection = sql.createPool(config);



// LOGIN, ACCESS TOKEN GENERATION AND LOGOUT FUNCTIONS

// Function to generate a JWT access token
function generateAccessToken(email) {
    const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
    return token;
  }
  



// Connection function  
  app.post('/api/userConnection', async function loginData(req, res) {
  
    // Recover client side email and password written in the same way
    const { email, password } = req.body;
    
   // Check if it matches between the two
    const [rows] = await pool_connection.query(
          `SELECT * FROM users WHERE email=? AND password=?`,
          [email, password]
        );

        // Condition to check if the user is in the database, this will return a row in table format because in the rows variable we used table brackets

        if (rows.length === 1) {

          // If it matches, then we create a token token that will serve as authentication for access to pages
          const token = generateAccessToken(email);
          req.session.token = token;

          // A message is returned here to say that the connection worked, as well as the id_user which will be used to be retrieved with
          // Other API functions
          res.json({ serverReturn: "OK", id_user: rows[0].id_user});
          console.log(rows[0].id_user)
          console.log(req.session); 
        } else {
          // Message returned NOT OK when identifiers was not on database
          res.json({ serverReturn: "NOT OK" });
        }
    })




    // Logout function

    app.post('/api/Logout', function (req, res) {
        req.session.destroy(function(err) {
          // Destruction of token
            res.clearCookie('token');
            res.sendStatus(200); // Réponse 200 OK
            console.log('You are disconnected')
        });
      });




    // middleware used to verify the user and if the token matches them for added security
  function authenticateToken(req, res, next) {

      // Recovery of the token generated during the connection
      const token = req.session.token

      // Verification process that it is not null, expired, corresponds to the user email
      if (token == null) {
        return res.sendStatus(401); 
      }
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, token_decode) => {
          if (err) {
              return res.sendStatus(401);
          }
          if (token_decode.exp < (Date.now() / 1000)) {
              return res.sendStatus(401);
          }
          if (!token_decode.email) {
              return res.sendStatus(401);
          }
        next(); 
      });
    }  





    // Registration function 

   app.post('/api/Registration', async function Registration(req,res) 
    {
      // Function that will add information to two data tables by retrieving the information expected for
      // avoid constraint blocking
      try 
      { 
          // We add location first because of database and table constraints
          const insertLocationColumns = `INSERT INTO localisations (country_localisation, postal_code) VALUES (?, ?)`
          const insertLocationValues = [req.body.country_localisation, req.body.postal_code]
          
          // Sending the request through the connection
          const [response] = await pool_connection.query(insertLocationColumns, insertLocationValues);

          // We retrieve the id_localisation
          const id_localisation = response.insertId

          // We then add the users data while having the id_location
          const insertUserColumns = `INSERT INTO users (name, firstname, email, password, id_localisation) VALUES (?, ?, ?, ?, ?)`
          const insertUserValues = [req.body.name, req.body.firstname, req.body.email, req.body.password, id_localisation]
          
          // Sending the request through the connection
          await pool_connection.query(insertUserColumns, insertUserValues)
          console.log('User was adding')

      }
      catch(error)
      {
          console.error(error);
          res.status(500).send({ error: error }); 
      }
    })



    // Adding donations function

    // Configuring the Destination Folder for Downloaded Files



    const storageConfiguration = multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, path.join(__dirname, '../../public/uploads'));
      },
      filename: function (req, file, callback) {
        callback(null, file.originalname);
      }
    });

  const upload = multer({ storage: storageConfiguration });

  app.post('/api/Upload', upload.single('file'), authenticateToken, async (req, res) => {

    try {
      const { title, comment, post_date, id_user } = req.body;
      const file_url = `${req.file.filename}`;
    
      const result = await pool_connection.query(`INSERT INTO donations 
      (title, file, comment, post_date, id_user) VALUES (?, ?, ?, ?, ?)`, 
      [title, file_url, comment, post_date, id_user]);

      res.status(200).send({ success: true, data: result.rows });

    } catch (error) {

      console.log(error)
      console.error(error);

      res.status(500).send({ success: false, error: error.message });
    }
  });
  

  // DISPLAY FUNCTIONS

  // Donation display function

 app.get('/api/ShowDonations', async function showDonationsList(req, res){
    try {

      // SQL request
        const [rows] = await pool_connection.query(`
        SELECT d.id_donation, d.title, d.file, d.comment, d.post_date, u.id_user, u.name, u.firstname, l.id_localisation, l.country_localisation, l.postal_code 
        FROM donations d 
        INNER JOIN users u ON d.id_user = u.id_user 
        INNER JOIN localisations l ON u.id_localisation = l.id_localisation 
        WHERE d.id_donation NOT IN (SELECT r.id_donation FROM reservations r)
        ORDER BY d.post_date DESC;        
  `
  )
        res.json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).send([{ message: error }]);
    }
  })


  // Display function of donations in history by user

  app.get('/api/ShowDonationsHistoric/:id', authenticateToken,  async function showDonationsListHistoric(req, res){
    try {
      // id_user retrieval
      const id = parseInt(req.params.id)

      // SQL request
        const [rows] = await pool_connection.query(`
        SELECT d.id_donation, d.title, d.file, d.comment, d.post_date, u.id_user, u.name, u.firstname, l.id_localisation, l.country_localisation, l.postal_code 
        FROM donations d 
        INNER JOIN users u ON d.id_user = u.id_user 
        INNER JOIN localisations l ON u.id_localisation = l.id_localisation 
        WHERE d.id_user = ?     
  `, [id]
  )
        res.json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).send([{ message: error }]);
    }
  })



// Reservation

app.post('/api/Reservation', authenticateToken, async function Reservation(req,res) 
{
  try 
  {
      // Retrieving json data in UI body
      const {reservation_date, id_user, id_donation} = req.body

      // We add location first because of database and table constraints
      const insertReservationColumn = `INSERT INTO reservations (reservation_date, id_user, id_donation) VALUES (?, ?, ?)`
      const insertReservationValues = [reservation_date, id_user, id_donation]

      // After creating the two variables, we can reuse them more cleanly in our response variable which will send the request
      const response = await pool_connection.query(insertReservationColumn, insertReservationValues);
      console.log(response)
      res.status(200).send("Your donation was reserved");
  }
  catch(error)
  {
      console.error(error);
      res.status(500).send({ error: error }); 
  }
})

  // Function for displaying donations reserved in history by user

  app.get('/api/ShowReservationsHistoric/:id',authenticateToken, async function showReservationsList(req, res){
    try {
      // id_user retrieval
      const id = parseInt(req.params.id)

      // SQL request
        const [rows] = await pool_connection.query(`
        SELECT donations.*, localisations.*, reservations.*,
        users_donor.name AS name, users_donor.firstname AS firstname,
        users_reservations.name AS name_reserve,
        users_reservations.firstname AS firstname_reserve
        FROM donations
        JOIN reservations ON donations.id_donation = reservations.id_donation
        JOIN users AS users_reservations ON reservations.id_user = users_reservations.id_user
        JOIN users AS users_donation ON donations.id_user = users_donation.id_user
        JOIN users AS users_donor ON donations.id_user = users_donor.id_user
        JOIN localisations ON users_donation.id_localisation = localisations.id_localisation
        WHERE reservations.id_user = ?;
  `, [id]
  )
        res.json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).send([{ message: error }]);
    } 
  })


// Listening to the server

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
  })
