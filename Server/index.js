
const express = require('express');
const jwt = require('jsonwebtoken');
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
app.listen(19002, () => console.log('Server listening on port 19002'));
