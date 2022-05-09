const express = require('express');
const bodyPayser = require('body-parser');
const app = express();
var MongoClient = require('mongodb').MongoClient

// app.listen(3000,function(){
//         console.log('listening on 3000')
//     })

app.use(bodyPayser.urlencoded({extended: true}))
app.use(bodyPayser.json())
app.use(express.static('public'))

URL = 'mongodb+srv://Hiro:1q2w3e@cluster0.lrztk.mongodb.net/CPA2retryWrites=true&w=majority'
MongoClient.connect(URL, {useUnifiedTopology: true}).then(client => {
    console.log('connected to DataBase')

    const db = client.db('CPA2')
    const quotesCollection = db.collection('quotes')
    app.set('view engine', 'ejs')

    app.post('/quotes', (req, res)=>{
        quotesCollection.insertOne(req.body).then(result =>{res.redirect('/')})
    })

    app.get('/', (req,res)=>{
        db.collection('quotes').find().toArray()
        .then(results => {
        res.render('index.ejs',{quotes:results})
        })
        .catch(error => console.error(error))
        //res.sendFile(__dirname + '/index.html')

    })


    app.put('/quotes', (req, res) => {
        quotesCollection.findOneAndUpdate(
          { name: 'zhang' },
          {
            $set: {
              name: req.body.name,
              place: req.body.quote
            }
          },
          {
            upsert: true
          }
        )
          .then(result => res.json('Success'))
          .catch(error => console.error(error))
      })

      app.delete('/quotes', (req, res) => {
        quotesCollection.deleteOne(
          { name: req.body.name }
        )
          .then(result => {
            if (result.deletedCount === 0) {
              return res.json('No quote to delete')
            }
            res.json('Deleted Darth Vadar\'s quote')
          })
          .catch(error => console.error(error))
      })

    })








//







//})
