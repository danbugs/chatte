# yachapp
<p class="box">
  Danilo Chiarlone 34441162
</p>

## Introduction

**yachapp** (short for *"Yes, another chat application"*) allows up to 5 concurrent users to exchange messages via the utilization of MQTT. Beyond that, every message is also published to AWS's IoT core where it can be monitored or be utilized to perform other tasks.

## High-Level Overview

Upon accessing the site at yachapp.now.sh, the user is greated with the following screen:

![Screen Shot 2020-03-23 at 4.56.24 PM](/assets/Screen%20Shot%202020-03-23%20at%204.56.24%20PM.png)

The user has to enter:
1. their room name (the topic in IoT terms), and
1. their name, which serves no purpose other than visually distinguishing the source of messages that are sent.

After entering their info, the site will it store in a session and the user will be redirected to their chat page:

![Screen Shot 2020-03-23 at 5.04.15 PM](/assets/Screen%20Shot%202020-03-23%20at%205.04.15%20PM.png)

Here, I entered a room called *readme*. This page makes a `POST` request to the server every two seconds trying to fetch from a relational database$^1$ every message in that room. As this room hasn't been used before, there are no messages.

When posting a message, the backend will publish it to our AWS device and insert it into the database so it can be fetched later.

Check this [link](https://drive.google.com/file/d/1TQm6e0xqLFk9fRMjoIhLqKz21M_xPBMW/view) for a video demo of the walkthrough.

## Technical Overview

- Database setup:
```SQL
CREATE TABLE messages(
  mid SERIAL NOT NULL,
  room VARCHAR(16) NOT NULL,
  chapper VARCHAR(16) NOT NULL,
  message VARCHAR(128) NOT NULL,
  PRIMARY KEY (mid)
);
```

- Fetching messages$^2$:
```JS
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
```

- Messaging:
```JS
app.post('/message', (req, res) => {
  device.publish(req.body.room, JSON.stringify(req.body.message));
  let query = {
    name: 'message',
    text: 'INSERT INTO messages (room, chapper, message) VALUES ($1, $2, $3);',
    values: [req.body.room, req.body.chapper,req.body.message]      
  }
  client.query(query, function(err, result){
    if(err){
      res.status(500).send(JSON.stringify(err));
    }else{
      res.status(200).send(JSON.stringify(`sent: ${req.body.message}`))
    }
  })
})
```

$1:$ Here I am using PostgreSQL with the free tier ElephantSQL, which allows for 5 concurrent users.
$2:$ Here I am using ExpressJS/NodeJS for server-side programming.
$* :$ In terms of DevOps, I am utilizing `now` where I am separately deploying the backend and the frontend.
