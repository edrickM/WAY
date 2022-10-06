const express = require('express');
const jwt = require('jsonwebtoken');
const envy = require('envy');
const log = require('tracer').colorConsole();
const {CHANNEL_ID, CHANNEL_SECRET} = envy();
const PORT = process.env.PORT || 19000;

log.log({CHANNEL_ID, CHANNEL_SECRET});


if (!CHANNEL_ID) {
  log.error('Please provide a CHANNEL_ID environmental variable');
  process.exit();
}
if (!CHANNEL_SECRET) {
  log.error('Please provide a CHANNEL_SECRET environmental variable');
  process.exit();
}

const app = express();
app.set('view engine', 'ejs'); // EJS is used to inject channelID into the html file
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index', {CHANNEL_ID});
});

app.get('/auth/:clientId', function (req, res) {
  if (hasChannelAccess(req)) {
    const payload = {
      client: req.params.clientId,
      channel: CHANNEL_ID,
      permissions: {
        '^myroom$': {
          publish: true,
          subscribe: true,
          History: 50,
        },
      },
      exp: Math.floor(Date.now() / 1000) + 60 * 3, // client has to use this token within 3 minutes
    };
    const token = jwt.sign(payload, CHANNEL_SECRET, {algorithm: 'HS256'});
    res.status(200).end(token);
  } else {
    res.status(403).end('Sorry! You are not allowed.');
  }
});

function hasChannelAccess(req) {
  const {clientId, name} = req.body;
  if (!clientId || clientId.lenght < 1) {
    res.status(400).send('Invalid Id');
  }
  if (!name || name.lenght < 1) {
    res.status(400).send('Invalid Name');
  }
  return true;
}

app.listen(PORT);
log.info(`Server is running on port ${PORT}. Visit http://localhost:${PORT}`);

// const express = require('express');
// const bodyParser = require('body-parser');
// const jwt = require ('jsonwebtoken');
// const cors = require('cors');
// const SCALEDRONE_CHANNEL_ID = require ('PMPs48ZjR8VGrTSE');
// const SCALEDRONE_CHANNEL_SECRET = require ('uL47oyetYkE2cLUMIkPBNYX66PWlpAnN');

// const app = express();
// app.use(bodyParser.json());
// app.use(cors());

// //If clientId and name are valid, we generate a token with clients data
// app.post('/generateToken', function(req, res) {
//     const {clientId, name} = req.body;
//     if (!clientId || clientId.lenght < 1){
//         res.status(400).send('Invalid Id');
//     }
//     if (!name || name.lenght < 1){
//         res.status(400).send('Invalid Name');
//     }
//     const token = jwt.sign({
//         client: clientId,
//         channel: SCALEDRONE_CHANNEL_ID,
//         Permissions: {
//             "^obserbable-locations$": {
//                 publish: true,
//                 subscribe: true,
//                 history: 50,
//             }
//         },
//         data: {
//             name,
//         },
//         //message expires in 5 minutes
//         exp: Math.floor(Date.now() / 1000) + 60 * 5
//     }, SCALEDRONE_CHANNEL_SECRET);
//     res.send(token);
// });
// app.listen(19000, () => console.log('Server listening on port 3000') )
