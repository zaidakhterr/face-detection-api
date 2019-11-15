const express = require('express');
const mongoose = require('mongoose');

const User = require('./models/User');
const UserCredential = require('./models/UserCredential');

let app = express();

//Bcrypt Config
const bcrypt = require('bcrypt');
const saltRounds = 8;

//CORS middleware
const cors = require('cors');
app.use(cors());

//Bodyparser middleware
app.use(express.json());

//DB Config
const dbConnString =
  'mongodb+srv://zaidakhterr:zaid1202@face-detection-e9pm3.mongodb.net/FaceDetection?retryWrites=true&w=majority';

//Connect to MongoDB
mongoose
  .connect(dbConnString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

mongoose.connection.on('error', err => console.log(err));

app.get('/', (req, res) => res.send('Hello'));

//@route POST /Register
//@desc Register A User
//@access Public
app.post('/Register', (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err) console.log(err);
    if (!user) {
      const newUser = new User({ name, email });
      newUser.save().then(user => res.json({ success: true, ...user._doc }));

      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) console.log(err);
        if (hash) {
          const newUserCredential = new UserCredential({ hash, email });
          newUserCredential.save();
        }
      });
    } else {
      res.json({
        success: false,
        msg: 'User with email already exists. Use another email',
      });
    }
  });
});

//@route POST /SignIn
//@desc SignIn A User
//@access Public
app.post('/SignIn', (req, res) => {
  const { email, password } = req.body;

  UserCredential.findOne({ email }, (err, result) => {
    if (err) console.log(err);
    if (result) {
      bcrypt.compare(password, result.hash, (err, isCorrect) => {
        if (err) console.log(err);
        if (isCorrect) {
          User.findOne({ email }).then(user =>
            res.json({ success: true, ...user._doc })
          );
        } else
          res.json({
            success: false,
            msg: 'Incorrect password. The password does not match the email.',
          });
      });
    } else
      res.json({
        success: false,
        msg:
          'User does not exist. Make sure you enter the correct email/password.',
      });
  });
});

//@route Get /User/:email
//@desc Get incremented entries of user
//@access Public
app.get('/User/:email', (req, res) => {
  const { email } = req.params;

  User.findOneAndUpdate(
    { email },
    { $inc: { entries: 1 } },
    { new: true },
    (err, user) => {
      if (err) console.log(err);
      if (user) {
        const { entries } = user._doc;
        res.json({ entries });
      }
    }
  );
});

//Listening to PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT} ...`));
