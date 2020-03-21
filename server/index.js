let awsIot = require('aws-iot-device-sdk');
let express = require('express');
let cors = require('cors');

let app = express();

app.use(cors());
app.use(express.json());
app.listen(3000);

let device = awsIot.device({
  keyPath: './certs/private-key.pem.key',
 certPath: './certs/device.pem.crt',
   caPath: './certs/aws-root-cert.pem',
 clientId: 'thing-2',
     host: 'a3t6mh767rbx1y-ats.iot.us-west-2.amazonaws.com',
});

app.get("/", (req, res) => {
  res.json({
    message: "This is the chatte server!"
  })
})

app.post('/connect', (req, res) => {
  device.clientId = req.body.username;
  device.on('connect', function() {
    device.subscribe(`${req.body.room}`);
  });
});

app.post('/message', (req, res) => {
  device.on('message', function(topic, payload) {
    res.send(payload);
  });
});