var express = require('express');
var app = express();
const func = require("./js/functions.js");
var bodyParser = require("body-parser");

//Partie qui gère les headers des requetes http
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

app.post('/product-api/', function (req, res) {
  product = func.getProduct(req.body,function(err,data){
    if (err) {
      console.log("ERROR : ",err);
    } else {
      // code to execute on data retrieval
      res.end( JSON.stringify(data[0]) );
    }
  });
})

app.post('/category-api/', function (req, res) {
  product = func.getCategory(req.body,function(err,data){
    if (err) {
      console.log("ERROR : ",err);
    } else {
      // code to execute on data retrieval
      res.end( JSON.stringify(data) );
    }
  });
})

app.post('/welcome/', function (req, res) {
  product = func.welcome(req.body,function(err,data){
    if (err) {
      console.log("ERROR : ",err);
    } else {
      // code to execute on data retrieval
      res.end( JSON.stringify(data) );
    }
  });
})

app.post('/my-product-list/', function (req, res) {
  product = func.my_product_list(req.body,function(err,data){
    if (err) {
      console.log("ERROR : ",err);
    } else {
      // code to execute on data retrieval
      res.end( JSON.stringify(data) );
    }
  });
})

app.post('/delete-product/', function (req, res) {
  product = func.delete_product(req.body,function(err,data){
    if (err) {
      console.log("ERROR : ",err);
    } else {
      // code to execute on data retrieval
      res.end( JSON.stringify(data) );
    }
  });
})

app.post('/my-favorites/', function (req, res) {
  product = func.getFavorites(req.body,function(err,data){
    if (err) {
      console.log("ERROR : ",err);
    } else {
      // code to execute on data retrieval
      res.end( JSON.stringify(data) );
    }
  });
})

app.post('/new-favorite/', function (req, res) {
  product = func.setFavorites(req.body,function(err,data){
    if (err) {
      console.log("ERROR : ",err);
    } else {
      // code to execute on data retrieval
      res.end( JSON.stringify(data) );
    }
  });
})

app.post('/remove-favorite/', function (req, res) {
  product = func.deleteFavorite(req.body,function(err,data){
    if (err) {
      console.log("ERROR : ",err);
    } else {
      // code to execute on data retrieval
      res.end( JSON.stringify(data) );
    }
  });
})

app.post('/create-account-api/', function (req, res) {
  product = func.createAccount(req.body,function(err,data){
    if (err) {
      console.log("ERROR : ",err);
    } else {
      res.end( JSON.stringify(data) );
    }
  });
})

app.post('/upload-api/', func.upload);

app.post('/connect-api/', function (req, res) {
  console.log(req.body);
  login = func.logIn(req.body[0], req.body[1],function(err,data){
    if (err) {
      console.log("ERROR : ",err);
    } else {
      if(data[0] == ''){
        res.end(JSON.stringify('Mot de passe ou identifiant erroné'));
      }else{
        if(data[0] == null || data[0] == undefined){
          console.log('Connexion Failed, no account');
          console.log(data[0]);
          res.end(JSON.stringify(data[0]));
        }else{
          console.log('Connexion Sucessfull');
          console.log(data[0]);
          res.end(JSON.stringify(data[0]));
        }
      }
      // code to execute on data retrieval
    }
  });
})


app.get('/images-api/:imageName', function (req, res) {
  res.sendFile(__dirname + '/userpictures/' + req.params.imageName);
});

app.post('/create-product-api/'/*':product_parameters'*/, function (req, res) {
  product = func.createProduct(req.body,function(err,data){
    if (err) {
      console.log("ERROR : ",err);
    } else {
      // code to execute on data retrieval
      res.end( JSON.stringify(data) );
    }
  });
})

app.post('/change-password-api/', function (req, res) {
  product = func.changePassword(req.body,function(err,data){
    if (err) {
      console.log("ERROR : ",err);
    } else {
      res.end( JSON.stringify(data) );
    }
  });
})

app.post('/change-address-api/', function (req, res) {
  product = func.changeAddress(req.body,function(err,data){
    if (err) {
      console.log("ERROR : ",err);
    } else {
      // code to execute on data retrieval
      res.end( JSON.stringify(data) );
    }
  });
})

app.post('/contact-api/', function (req, res) {
  product = func.setcontact(req.body,function(err,data){
    if (err) {
      console.log("ERROR : ",err);
    } else {
      // code to execute on data retrieval
      res.end( JSON.stringify(data[0]) );
    }
  });
})

app.post('/getcontact-api/', function (req, res) {
  product = func.getcontact(req.body,function(err,data){
    if (err) {
      console.log("ERROR : ",err);
    } else {
      // code to execute on data retrieval
      res.end( JSON.stringify(data) );
    }
  });
})

app.post('/show_contact-api/', function (req, res) {
  product = func.showcontact(req.body,function(err,data){
    if (err) {
      console.log("ERROR : ",err);
    } else {
      // code to execute on data retrieval
      res.end( JSON.stringify(data[0]) );
    }
  });
})

app.post('/get_product_commentary/', function (req, res) {
  product = func.product_commentary(req.body,function(err,data){
    if (err) {
      console.log("ERROR : ",err);
    } else {
      // code to execute on data retrieval
      res.end( JSON.stringify(data) );
    }
  });
})

app.post('/set_product_commentary/', function (req, res) {
  product = func.setproduct_commentary(req.body,function(err,data){
    if (err) {
      console.log("ERROR : ",err);
    } else {
      // code to execute on data retrieval
      res.end( JSON.stringify(data) );
    }
  });
})

app.post('/new-profile-pic/', function (req, res) {
  product = func.setNewProfilePic(req.body,function(err,data){
    if (err) {
      console.log("ERROR : ",err);
    } else {
      // code to execute on data retrieval
      res.end( JSON.stringify(data) );
    }
  });
})

app.post('/confirm_account/', function (req, res) {
  product = func.confirmAccount(req.body,function(err,data){
    if (err) {
      console.log("ERROR : ",err);
    } else {
      func.validateAccount(data,function(err,data2){
        if (err) {
          console.log("ERROR : ",err);
          res.end( JSON.stringify('ERROR') );
        };
        if(data2 == 'TRUE'){
          res.end( JSON.stringify(data2) );
        };
        if(data2 == 'FALSE'){
          res.end( JSON.stringify('ERROR') );
        }
      });
      // code to execute on data retrieval
      // res.end( JSON.stringify(data) );
    }
  });
})

var server = app.listen(7777, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("trocGlisse server listening at http://%s:%s", host, port)
})

server.on('close', function () {
  db.connection.end();
});
