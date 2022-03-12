require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyparser = require('body-parser')
const mongoose=require('mongoose')
const dns=require('dns')
const urlParser=require('url')
// Basic Configuration
const port = process.env.PORT || 3000;

mongoose.connect(process.env.DB_URI,{ useNewUrlParser: true }).then(()=>{console.log("success")}).
  catch(error => console.log(error));


  const schema=mongoose.Schema({url:'String'})
  const Url=mongoose.model('Url',schema)


app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});



// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  const {url}=req.body
  dns.lookup(urlParser.parse(url).hostname,(err,data)=>{
    if(err){console.log(err)
    return res.json({ error: 'invalid url' })}
    console.log(data);


    Url.create({url}, function (err, data) {
      if (err) { console.log(err);}
      console.log(data);
     
      res.json({original_url:data.url,
      short_url:data.id})

    });
  })

});

app.get('/api/shorturl/:id',(req,res)=>{
  const {id}=req.params
  Url.findById(id,(err,data)=>{
    if(err){
      console.log(err);
    }
    res.redirect(data.url)
  })
})




app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
