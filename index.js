require('dotenv').config();
const express=require('express');
const body_parser=require('body-parser');
const axios=require('axios');

const app=express().use(body_parser.json());
const verify_token=process.env.VERIFY_TOKEN;
const myToken=process.env.MY_TOKEN;

app.listen(process.env.PORT, () => {
  console.log('Webhook is running on port 7000');
});

app.get('/webhook', (req, res) => {
  let mode=req.query("hub.mode");
  let challenge=req.query("hub.challenge");
  let verify_token=req.query("hub.verify_token");


  if (mode==="subscribe" && verify_token === myToken) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }

});

app.post('/webhook', (req, res) => {
  let body_param=req.body;

  console.log(JSON.stringify(body_param, null, 2));

  if (body_param.object) {
    if (body_param.entry && 
        body_param.entry[0].changes && 
        body_param.entry[0].changes[0].value.messages && 
        body_param.entry[0].changes[0].value.messages[0]
    ) {
        let phone_number_id=body_param.entry[0].changes[0].value.metadata.phone_number_id;
        let from=body_param.entry[0].changes[0].value.messages[0].from;
        let msg_body=body_param.entry[0].changes[0].value.messages[0].text.body;

        axios({
            method:"POST",
            url:"https://graph.facebook.com/v25.0/"+phone_number_id+"/message?access_token="+verify_token,
            data:{
                messaging_product:"whatsapp",
                to:from,
                text:{
                    body:"Hello, its waff"
                }
            },
            headers: {
                "Content-Type": "application/json"
            }
        });

        res.sendStatus(200);
    }else {
        res.sendStatus(404);
      }
  }
});

app.get('/', (req, res) => {
  res.status(200).send("Hello its waff");
});