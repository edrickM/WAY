const express = require('express');
const bodyParser = require('body-parser');
const jwt = require ('jsonwebtoken');
const SCALEDRONE_CHANNEL_ID = require ('PMPs48ZjR8VGrTSE');
const SCALEDRONE_CHANNEL_SECRET = require ('uL47oyetYkE2cLUMIkPBNYX66PWlpAnN');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/auth', (req, res) => {
    const {clientId, name} = req.body;
    if (!clientId || clientId.lenght < 1){
        res.status(400).send('Invalid Id');
    }
    if (!name || name.lenght < 1){
        res.status(400).send('Invalid Name');
    }
    const token = jwt.sign({
        client: clientId,
        channel: SCALEDRONE_CHANNEL_ID,
        Permissions: {
            "^obserbable-locations$": {
                publish: true,
                subscribe: true,
                history: 50,
            }
        },
        data: {
            name,
        },
        //message expires in 5 minutes
        exp: Math.floor(Date.now() / 1000) + 60 * 5
    }, SCALEDRONE_CHANNEL_SECRET);
});

app.listen(3000, () => console.log('Server listening on port 3000'))