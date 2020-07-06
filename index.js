var express = require('express');
var app = express();
var Animal = require('./Animal.js');
var Toy = require('./Toy.js');

// Server Basic Entry Point
app.all('/', (req, res) => {
    res.json({ msg : 'It works!' });
    //res.redirect('/create.html')
    //res.send('<html><body><h1>Hello World</h1></body></html>');
    });

// Create Toy Router
app.use('/AddToy', (req, res) => {

    var toyData = new Toy({ // schema defined in Toy.js
                            id: '456',
                            name: 'Dog pillow',
                            price: 25.99
                          });

    toyData.save( (err) => { // Saving Schema object to MongoDB
                                if(err){
                                res.type('html');
                                res.status(500);
                                res.send('Error :'+ err);
                                }
                                else{
                                    console.log('Toy was saved successfully');
                                }
    });
});

// Create Animal Router
app.use('/AddAnimal', (req, res) => {

    var AnimalData = new Animal({ // schema defined in Toy.js
        name: 'Felix',
        species: 'Cat',
        breed: 'Tuxedo',
        gender: 'male',
        traits: ['funny','loyal'],
        age: 98
    });

    AnimalData.save( (err) => { // Saving Schema object to MongoDB
        if(err){
            res.type('html');
            res.status(500);
            res.send('Error :'+ err);
        }
        else{
            console.log('Animal was saved successfully');
        }
    });
});

// This is '/FindToy' API
app.use('/findToy', (req, res) => {
    var toy_Id = req.query.id;//req.query.id;
    var query = { id: toy_Id };

    if(!query.id){
        res.json({});
    }

    Toy.find(query, (err, result) => {
        if(err){
            res.type('html');
            res.status(500);
            res.send('Error: ' + err);
        }
        else if(!result){
            res.type('html');
            res.status(200);
            res.json({});
        }
        else{
            console.log(result)
            res.json(result);
        }
    });
});

// This is '/findAnimal' API
app.use('/findAnimals', (req, res) =>{
    var query = {};

    if(req.query.species)
        query.species = req.query.species;
    if(req.query.trait)
        query.traits = req.query.trait;
    if(req.query.gender)
        query.gender = req.query.gender;

    if(Object.keys(query).length == 0)
        res.json({});

    Animal.find(query, (err, results) => {
        if(err){
            res.type('html');
            res.status(500);
            res.send('Error: '+err);
        }
        else if(!results){
            res.type('html');
            res.status(200);
            res.json({});
        }
        else{
            var apiResults = [];
            results = [].concat(results);
            console.log(results);
            results.forEach( (perAnimal) => {
                var perAnimalObj = {};
                perAnimalObj.name = perAnimal.name;
                perAnimalObj.species = perAnimal.species;
                perAnimalObj.breed = perAnimal.breed;
                perAnimalObj.gender = perAnimal.gender;
                perAnimalObj.age = perAnimal.age;

                apiResults.push(perAnimalObj);
            });

            res.json(apiResults);
        }
    });

});

app.use('/animalsYoungerThan', (req, res) =>{
    var query = {};

    if(req.query.age)
        query.age = { $lt: req.query.age};
    else if(!req.query.age)
        res.json({});

    if(isNaN(req.query.age) == true)
        res.json({});

    Animal.find(query, (err, results) =>{
        if(err){
            res.type('html');
            res.status(500);
            res.send('Error: '+ err);
        }
        else if(!results){
            res.type('html');
            res.status(200);
            res.json({count: 0});
        }
        else{
            console.log(results);
            var apiResults = { count: results.length,
                               name: []
                             };
            results.forEach((animal) =>{
                apiResults.name = apiResults.name.concat([(animal.name)]);
            });

            if(apiResults.count == 0) delete apiResults.name;
            res.json(apiResults);
        }
    });
});

app.use('/calculatePrice', (req, res) => {
    var idArray;
    var qtyArray;
    var m = new Map();

    if(req.query.id.length)
        idArray = req.query.id;
    if(req.query.qty.length)
        qtyArray = req.query.qty;

    if(!idArray.length || !qtyArray.length || (idArray.length != qtyArray.length))
        res.json({});

    idArray.forEach((id, index) => {
        if(m.has(id) && !isNaN(qtyArray[index]) && qtyArray[index] > 0){
            m.set(id, m.get(id) + qtyArray[index]);
        }
        if(qtyArray[index] > 0 && !isNaN(qtyArray[index])){
            m.set(id, qtyArray[index]);
        }
    });

    if(m.size == 0)
        res.json({});

    var apiResult = { item: [], totalPrice: 0 };
    var finalResults = {};
    var index = 0;

    m.forEach( (value, key, map) =>{
        Toy.find( {id: key}, (err, results) =>{
                if(err){
                    res.type('html');
                    res.status(500);
                    res.send('Error in id: ' + key + ' Error Message: '+ err);
                }
                else if(!results || !results.length){
                    if(index == m.size-1) res.json(apiResult);
                    // if(Query.isEmptyObject(apiResult) == false){
                    //     finalResults = apiResult;
                    // }
                }
                else{
                    // console.log('Data for Current ID: ')
                    // console.log(results);
                    var subItemObj = { item: key,
                                       qty: value,
                                       subtotal: (value * results[0].price)
                                     }
                    apiResult.item = apiResult.item.concat(subItemObj);
                    apiResult.totalPrice = apiResult.totalPrice + (value * results[0].price);
                    ++index;
                    // console.log('API Results is: ')
                    // console.log(apiResult);
                    //
                    // if(Object.keys(apiResult).length != 0){
                    //     console.log(Object.keys(apiResult).length != 0);
                    //     finalResults = apiResult;
                    // }
                    if(index == m.size) res.json(apiResult);
                }
        });
    });
    // console.log(finalResults);
    // res.json(finalResults);
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});

// Please do not delete the following line; we need it for testing!
module.exports = app;