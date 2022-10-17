
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const colors = require('./colors')
const cors = require('cors');
const SCALEDRONE_CHANNEL_ID = ('PMPs48ZjR8VGrTSE');
const SCALEDRONE_CHANNEL_SECRET = ('uL47oyetYkE2cLUMIkPBNYX66PWlpAnN');

const app = express();
app.use(express.json()); 
app.use(cors());

app.post('/auth', (req, res) => {
    const {clientId, name} = req.body;

    if (!clientId || clientId.lenght < 1) {
      res.status(400).send('Invalid Id');
    }
    if (!name || name.lenght < 1) {
      res.status(400).send('Invalid Name');
    }
      //Creating jwt token
     const token = jwt.sign(
        {
          client: clientId,
          channel: SCALEDRONE_CHANNEL_ID,
          data: {
            name,
            color: colors.get()
          },
          permissions: {
            "^observable-locations$": {
              publish: true,
              subscribe: true,
              history: 50,
            },
          },
          exp: Math.floor(Date.now() / 1000) + 60 * 5,
        },
        SCALEDRONE_CHANNEL_SECRET);
        res.send(token);
    } 
);

//If clientId and name are valid, we generate a token with clients data
// app.post(
//   'https://2274-2605-ad80-30-841a-5003-bd0a-46cc-8ac.ngrok.io',
//   (req, res) => {
//     let {clientId, name} = req.body;
//     if (!clientId || clientId.lenght < 1) {
//       res.status(400).send('Invalid Id');
//     }
//     if (!name || name.lenght < 1) {
//       res.status(400).send('Invalid Name');
//     }
//     var token = jwt.sign(
//       {
//         client: clientId,
//         channel: SCALEDRONE_CHANNEL_ID,
//         data: {
//           name,
//         },
//         Permissions: {
//           '^obserbable-locations$': {
//             publish: true,
//             subscribe: true,
//             history: 50,
//           },
//         },
//         exp: Math.floor(Date.now() / 1000) + 60 * 5,
//       },
//       SCALEDRONE_CHANNEL_SECRET,
//     );

//     if (err) {
//       const error = new Error("Error! Something went wrong.");
//       return next(error);
//     }

//     res.send(token);

//   },
// );

app.listen(19002, () => console.log('Server listening on port 19002'));
