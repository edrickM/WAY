// import ENV from './enviroment.cjs'
// const express = require('express');
// const jwt = require('jsonwebtoken');
// const log = require('tracer').colorConsole();
// const PORT = process.env.PORT || 19000;

// const CHANNEL_ID = ENV.CHANNEL_ID;
// const CHANNEL_SECRET = ENV.CHANNEL_SECRET;

// log.log({CHANNEL_ID, CHANNEL_SECRET});

// if (!CHANNEL_ID) {
//   log.error('Please provide a CHANNEL_ID environmental variable');
//   process.exit();
// }
// if (!CHANNEL_SECRET) {
//   log.error('Please provide a CHANNEL_SECRET environmental variable');
//   process.exit();
// }

// const app = express();
// app.set('view engine', 'ejs'); // EJS is used to inject channelID into the html file
// app.use(express.static('public'));

// app.get('/', function (req, res) {
//   res.render('index', {CHANNEL_ID});
// });

// app.get('/auth/:clientId', function (req, res) {
//   if (hasChannelAccess(req)) {
//     const payload = {
//       client: req.params.clientId,
//       channel: CHANNEL_ID,
//       permissions: {
//         '^myroom$': {
//           publish: true,
//           subscribe: true,
//           History: 50,
//         },
//       },
//       exp: Math.floor(Date.now() / 1000) + 60 * 3, // client has to use this token within 3 minutes
//     };
//     const token = jwt.sign(payload, CHANNEL_SECRET, {algorithm: 'HS256'});
//     res.status(200).end(token);
//   } else {
//     res.status(403).end('Sorry! You are not allowed.');
//   }
// });

// function hasChannelAccess(req) {
//   const {clientId, name} = req.body;
//   if (!clientId || clientId.lenght < 1) {
//     res.status(400).send('Invalid Id');
//   }
//   if (!name || name.lenght < 1) {
//     res.status(400).send('Invalid Name');
//   }
//   return true;
// }

// app.listen(PORT);
// log.info(`Server is running on port ${PORT}. Visit http://localhost:${PORT}`);

const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const SCALEDRONE_CHANNEL_ID = require('./scaledrone_channel_id.json');
const SCALEDRONE_CHANNEL_SECRET = require('./scaledrone_channel_secret.json');

const app = express();
app.use(express.json());
 app.set('view engine', 'ejs'); // EJS is used to inject channelID into the html file

app.post(
  'https://994b-2605-ad80-30-841a-fcf6-fad2-4b64-198a.ngrok.io',
  async (req, res, next) => {
    let {ClientId, name} = req.body;

    if (!clientId || clientId.lenght < 1) {
      res.status(400).send('Invalid Id');
    }
    if (!name || name.lenght < 1) {
      res.status(400).send('Invalid Name');
    }

    let token;
    try {
      //Creating jwt token
      token = jwt.sign(
        {
          client: ClientId,
          channel: SCALEDRONE_CHANNEL_ID,
          data: {
            name,
          },
          Permissions: {
            '^obserbable-locations$': {
              publish: true,
              subscribe: true,
              history: 50,
            },
          },
          exp: Math.floor(Date.now() / 1000) + 60 * 5,
        },
        SCALEDRONE_CHANNEL_SECRET,
      );
    } catch (err) {
      console.log(err);
      const error = new Error('Error! Something went wrong.');
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: {
        token: token,
      },
    });
  },
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
