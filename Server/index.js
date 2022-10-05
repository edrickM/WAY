const express = require('express');
const bodyParser = require('body-parser');
const jwt = require ('jsonwebtoken');
const cors = require('cors');
const SCALEDRONE_CHANNEL_ID = require ('PMPs48ZjR8VGrTSE');
const SCALEDRONE_CHANNEL_SECRET = require ('uL47oyetYkE2cLUMIkPBNYX66PWlpAnN');

const app = express();
app.use(bodyParser.json());
app.use(cors());

//If clientId and name are valid, we generate a token with clients data
app.post('/auth', function(req, res) {
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
    res.send(token);
});
app.listen(19000, () => console.log('Server listening on port 3000') )