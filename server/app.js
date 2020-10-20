const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const dbService = require('./dbService');
const { response, request } = require('express');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : false}));

// create

app.post('/insert', (req , res) =>{
    const db = dbService.getDbServiceInstance();
    const  {name } = req.body; 
    console.log(name);
    const result = db.insertNewName(name);
    result
    .then(data =>{ res.json({data :data})
    console.log(data);
    })
    .then(err => console.log(err));
});

// read
app.get('/getAll' , (req , res) =>{
    const db = dbService.getDbServiceInstance();
   const result =  db.getAllData();
   result.then(data => res.json({data : data}))
   .catch(err => console.log(err));
   
})

app.delete('/delete/:id' ,  (req , res) =>{
   const {id} = req.params;
   console.log(id);
   const db = dbService.getDbServiceInstance();
   const result =  db.deleteRowById(id);
   result.then(data => res.json({success :data}))
   .catch(err => console.log(err));
})


app.patch('/update' , (req , res ) =>{
     const {id , name} = req.body;
    console.log(id);
    console.log(name);
    const db = dbService.getDbServiceInstance();
    const result =  db.updateNameById(id , name);
    result.then(data => {
        res.json({success :data})
        console.log(data);
    }
        )
    .catch(err => console.log(err));
    console.log(req.body);
})

app.listen(process.env.PORT , ()=>{
    console.log('app is running');
})


