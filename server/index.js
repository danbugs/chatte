let awsIot = require('aws-iot-device-sdk');
let express = require('express');
var body_parser = require("body-parser");
let cors = require('cors');
let pg = require('pg');


let app = express();
let client = new pg.Client('postgres://hyxctnqj:Q1has7QEPH78hOFBUnA_jLyzwv8zQyeh@drona.db.elephantsql.com:5432/hyxctnqj');

app.use(cors());
app.use(express.json());
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }))

let device = awsIot.device({
  keyPath: __dirname + "/certs/private-key.pem.key",
 certPath: __dirname + "/certs/device.pem.crt",
   caPath: __dirname + "/certs/aws-root-cert.pem",
 clientId: 'thing',
     host: 'a3t6mh767rbx1y-ats.iot.us-west-2.amazonaws.com',
});

connect();
client.connect(function(err){
  if(err){
    console.log(err);
  }else{
    console.log('db connect OK');
  }
})

app.get('/', (req, res) => {
  client.query('SELECT * FROM messages', function(err, result){
    if(err){
      res.status(500).send(JSON.stringify(err));
    }
    else{
      console.log(result.rows);
      res.status(200).send(result.rows);
    }
  })
})

app.post('/message', (req, res) => {
  device.publish(req.body.room, JSON.stringify(req.body.message));

  let query = {
    name: 'message',
    text: 'INSERT INTO messages (room, message) VALUES ($1, $2);',
    values: [req.body.room, req.body.message]      
  }
  client.query(query, function(err, result){
    if(err){
      console.log(err);
    }else{
      res.status(200).send(JSON.stringify(`sent: ${req.body.message}`))
    }
  })
})

app.listen(3001);

// <MQTT>
function connect() {
  device.on('error', (err) => {
    console.log(err);
    device.end();
  })

  device.on('connect', () => {
    console.log(`connected!`);
  })

  device.on('message', (topic, payload) => {
    console.log(payload.toString());
  })

  device.on('close', () => {
    console.log('closed!')
  })
}
// </MQTT>