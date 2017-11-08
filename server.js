var express = require('express')
var path = require('path');
var ejs = require('ejs');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
mongoose.connect('mongodb://localhost/dolphins');

var dolphinSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 3},
    color: {type: String, required: true, minlength: 2}
});
mongoose.model('Dolphin', dolphinSchema);
// mongoose has is similar to Python ORM and will rename colection to be plural and lowercase
// make collection called Dolphin that has the dolphinSchema
var Dolphin = mongoose.model('Dolphin');
// create variable that is the collection Dolphin that you can grab onto and utilize in the js file
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
// render template that displays all dolphins
app.get('/', function(req, res){
    Dolphin.find({}, function(err, dolphins){
        // function must take two arguments!!!!!!
        console.log(dolphins)
        res.render('index', {dolphins: dolphins})
    })
})

// render form to create new dolphin
app.get('/dolphins/new', function(req, res){
    res.render('new')
})
// render template that displays information about specific dolphin
app.get('/dolphins/:id', function(req,res){
    // id is can be a number or a letter. Therefore id was picking up the new route
    Dolphin.find({_id : req.params.id}, function(err, dolphin){
        if(err){
            console.log("something bad happened");
            res.redirect('index', {errors: dolphin.errors});
        }
        var dol = {dolphin: dolphin[0]}
        console.log(dol)
        res.render('profile', {dolphin: dolphin[0]})
// Only needed name at edit because passing in object {}. Here, passing in {dolphin: {}}
    })
})
//*****use request in the beginning and response in the end***

// submit info to database and then return back to index to display info
app.post('/dolphins', function(req, res){
    var dolphin = new Dolphin(req.body)
    dolphin.save(function(err){
        if(err){
            console.log("Opps you dun messed up");
            res.render('/dolphins/new', {errors: dolphin.errors});
        }
        else{
            console.log("You made a dolphin")
            res.redirect('/')
        }
    })
})
// render edit template
app.get('/dolphins/edit/:id', function(req, res){
    Dolphin.findOne({_id: req.params.id}, function(err, dolphin){
        console.log(dolphin);
        if(err){
            console.log('Error error error')
            res.render('/dolphins/edit/:id', {errors: dolphins.errors})

        }
        console.log("success")
        console.log(dolphin)
        return res.render('edit', dolphin)
        // Only need name here because passing in object {}, in profile, passing in {dolphin: {}}
        // JS goes into object, so to call info, simply say _id or name, not dolphin._id or dolphin.name *****
    })

})
// update dolphin
app.post('/dolphins/edit/:id', function(req, res){
    Dolphin.update({_id: req.params.id}, req.body, function(err, dolphin){
        if(err){
            console.log("somethings wrong");
            res.render('dolphins/edit/:id', {errors: dolphin.errors})
        }
        else{
            console.log("Yay you edited it")
        }
    })
    res.redirect('/');
    // insert 

})
app.get('/dolphins/delete/:id', function(req, res){
    Dolphin.remove({_id: req.params.id}, function(err, dolphin){
        res.redirect('/');
    })
})
app.listen(8000, function(){
    console.log("listening on port 8000")
})