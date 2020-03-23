let awsIot = require('aws-iot-device-sdk');
let express = require('express');
var body_parser = require("body-parser");
let cors = require('cors');
let pg = require('pg');


let app = express();
let client = new pg.Client(process.env.DB);
let connected;

app.use(cors());
app.use(express.json());
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }))

let device = awsIot.device({
  keyPath: __dirname + "/certs/private-key.pem.key",
 certPath: __dirname + "/certs/device.pem.crt",
   caPath: __dirname + "/certs/aws-root-cert.pem",
 clientId: 'thing',
     host: process.env.HOST,
});

connect();
client.connect(function(err){
  if(err){
    console.log('db not connected');
  }else{
    console.log('db connected');
  }
})

app.get('/', (req, res) => {
  res.status(200).send({message: "Welcome to Chatte's server"});
})

app.post('/fetch_messages', (req, res) => {
  let query = {
    name: 'fetch_messages',
    text: 'SELECT * FROM messages WHERE room = $1;',
    values: [req.body.room]
  }
  client.query(query, function(err, result){
    if(err){
      res.status(500).send(err);
    }
      res.status(200).send(result.rows);
  })
})

app.post('/message', (req, res) => {
  device.publish(req.body.room, JSON.stringify(req.body.message));
  let query = {
    name: 'message',
    text: 'INSERT INTO messages (room, chatter, message) VALUES ($1, $2, $3);',
    values: [req.body.room, req.body.chatter,req.body.message]      
  }
  client.query(query, function(err, result){
    if(err){
      res.status(500).send(JSON.stringify(err));
    }else{
      res.status(200).send(JSON.stringify(`sent: ${req.body.message}`))
    }
  })
})

app.listen(3000);

// <MQTT>
function connect() {
  device.on('error', (err) => {
    console.log('device error 1:', err);
    device.end();
  })

  device.on('connect', () => {
    console.log(`connected!`);
  })

  device.on('message', (topic, payload) => {
    console.log(payload.toString());
  })

  device.on('close', () => {
    connect();
  })
}
// </MQTT>