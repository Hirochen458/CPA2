const express = require('express');
const bodyPayser = require('body-parser');
const app = express();
var mongoose = require('mongodb').mongoose


// app.listen(3000,function(){
//         console.log('listening on 3000')
//     })
const port = process.env.PORT || "27017";
console.log('connecting on port ' + port);
app.set("port", port)

app.use(bodyPayser.urlencoded({extended: true}))
app.use(bodyPayser.json())
app.use(express.static('public'))

URL = process.env.mongodb_URL //'mongodb+srv://Hiro:1q2w3e@cluster0.lrztk.mongodb.net/CPA2retryWrites=true&w=majority'
mongoose.connect(URL, {useUnifiedTopology: true, useNewUrlParser: true}).then(client => {
    console.log('connected to DataBase')

    mongoose.set('useFindAndModify', false)
    mongoose.set('useCreateIndex', true)

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
