const async = require("async");
const db = require("./dbConnect.js");
var formidable = require('formidable');
var fs = require("fs");
var express = require('express');
var path = require('path');
var fse = require('fs-extra');
var bodyParser = require('body-parser');
const mail = require("./sendEmail.js");
const encrypt = require("./encrypt.js");

async function getProduct(product_identifier,callback){

  var queryString = 'SELECT p.Name,p.Teaser,p.description,p.price,p.FileName1,p.FileName2,p.FileName3,p.FileName4,p.FileName5,p.user_id,p.id,f.products_id' +
  ' FROM product p LEFT JOIN favorites f ON p.id = f.products_id where id= ?';

  db.connection.query(queryString, product_identifier ,function(err, rows) {
    if (err) throw err;
    callback(null,rows);
  });
}

async function getCategory(category_identifier,callback){
  var queryString = 'SELECT prod.Teaser as product_description,prod.FileName1 as product_picture,prod.id as product_id ' +
  'FROM product prod ' +
  'LEFT JOIN categories cat ' +
  'ON prod.product_category = cat.category_id ' +
  'WHERE cat.category_name= ? ' +
  'AND prod.region = ?';

  console.log(queryString);

  db.connection.query(queryString, [category_identifier[0],category_identifier[1]] , function(err, rows) {
    if (err) throw err;
    console.log(rows);
    callback(null,rows);
  });
}

async function getAccount(account_identifier,callback){
  var queryString = 'SELECT id,Name,Surname,Mail,Address,Avatar ' +
  'FROM user where id= ?';

  db.connection.query(queryString, account_identifier ,function(err, rows) {
    if (err) throw err;
    callback(null,rows);
  });
}

async function createAccount(account_parameters,callback){

  //  account_parameters[2], is never called while creating an account

  var queryString = 'SELECT * FROM user WHERE Name = ? AND Mail = ?';

  console.log(queryString);

  var queryStringInsert;
  var queryStringValues;
  var requestParametersInOrder = [];
  if(account_parameters[0] != null || account_parameters[0] != undefined){
    queryStringInsert = 'INSERT INTO user (Name,';
    queryStringValues = 'VALUES (?,';
    requestParametersInOrder[0] = account_parameters[0];

    console.log(queryStringInsert);
    console.log(queryStringValues);
    console.log(requestParametersInOrder);
  }else{
    console.log('Name is missing');
    callback(null,'NAME_MISSING');
  }
  queryStringInsert = queryStringInsert + 'Surname,';
  queryStringValues = queryStringValues + '?,';
  if(account_parameters[1] != null || account_parameters[1] != undefined){
    requestParametersInOrder[1] = account_parameters[1];
  }else{
    requestParametersInOrder[1] = 'Newbie';
    console.log('surname is missing, added Newbie default');
  }
  console.log(queryStringInsert);
  console.log(queryStringValues);
  console.log(requestParametersInOrder);
  if(account_parameters[3] != null || account_parameters[3] != undefined){
    queryStringInsert = queryStringInsert + 'Mail,';
    queryStringValues = queryStringValues + '?,';
    requestParametersInOrder[2] = account_parameters[3];
  }else{
    console.log('Mail is missing');
    callback(null,'MAIL_MISSING');
  }
  console.log(queryStringInsert);
  console.log(queryStringValues);
  console.log(requestParametersInOrder);
  queryStringInsert = queryStringInsert + 'MailList,';
  queryStringValues = queryStringValues + '?,';
  requestParametersInOrder[3] = '1';
  queryStringInsert = queryStringInsert + 'Address,';
  queryStringValues = queryStringValues + '?,';
  if(account_parameters[5] != null || account_parameters[5] != undefined){
    requestParametersInOrder[4] = account_parameters[5];
  }else{
    requestParametersInOrder[4] = 'No address given';
    console.log('address is missing, added default message');
  }
  console.log(queryStringInsert);
  console.log(queryStringValues);
  console.log(requestParametersInOrder);
  queryStringInsert = queryStringInsert + 'Avatar,';
  queryStringValues = queryStringValues + '?,';
  if(account_parameters[6] != null || account_parameters[6] != undefined){
    requestParametersInOrder[5] = account_parameters[6];
  }else{
    requestParametersInOrder[5] = 'default.jpg';
    console.log('No Avatar given, added default one');
  }
  console.log(queryStringInsert);
  console.log(queryStringValues);
  console.log(requestParametersInOrder);
  if(account_parameters[4] != null || account_parameters[4] != undefined){
    queryStringInsert = queryStringInsert + 'password,';
    queryStringValues = queryStringValues + '?,';
    requestParametersInOrder[6] = account_parameters[4];
  }else{
    console.log('password is missing');
    callback(null,'PASSWORD_MISSING');
  }
  console.log(queryStringInsert);
  console.log(queryStringValues);
  console.log(requestParametersInOrder);
  queryStringInsert = queryStringInsert + 'validated) ';
  queryStringValues = queryStringValues + '?)';
  requestParametersInOrder[7] = '0';

  //should be looking that way for requestParametersInOrder
  /*[account_parameters[0],
  account_parameters[1],
  account_parameters[3],
  '1',
  account_parameters[5],
  account_parameters[6],
  account_parameters[4],
  '0']*/
  var queryString = queryStringInsert + queryStringValues;

  console.log(queryStringInsert);
  console.log(queryStringValues);
  console.log(requestParametersInOrder);
  console.log(queryString);

  db.connection.query(queryString, [account_parameters[0],
    account_parameters[3]] ,function(err, rows) {
      console.log('premiere requète réussie');
      if (rows === undefined || rows.length == 0) {
        db.connection.query(queryString, requestParametersInOrder,function(err, rows) {
          if (err) {
            console.log('ERROR creating account');
            console.log(err);
            callback(null,'FALSE');
          }else{
            var uniqueIdentifier = account_parameters[3] + ',' + account_parameters[0] + ',' + account_parameters[1];
            uniqueIdentifier = encrypt.generateHash(uniqueIdentifier).substr(1,16);
            console.log('UID is: ' + uniqueIdentifier);

            var queryString = 'INSERT INTO validate (token, account_mail) ' +
            'VALUES (?, ?)';

            db.connection.query(queryString, [uniqueIdentifier,account_parameters[3]] ,function(err, rows) {
              if (err) {
                console.log('ERROR setting up unique link in DB');
                console.log(err);
                callback(null,'ERROR_UNIQUE_LINK');
              }else{
                console.log('Unique link got successfully added in database');
              }
            });
            console.log('test UID ' + uniqueIdentifier);
            var mailOptions = {
              from: 'trocglisse@gmail.com',
              to: account_parameters[3],
              subject: 'Inscription à trocGlisse',
              //text: 'That was easy!'
              html: 'Bonjour ' + account_parameters[0] + ' ' + account_parameters[1] + ' !<br>' +
              'Merci pour ton inscription à TrocGlisse, nous espérons que tu y trouvera ton bonheur !<br>' +
              'Clique sur le lien suivant afin de confirmer ton compte: https://localhost:7777/mail_confirmation/' +
              uniqueIdentifier + ' <br>' +
              'Ajouter ICI footer TrocGlisse'
            };

            mail.sendAccountCreationMail(mailOptions,function(err,data)
            {
              console.log('err: ' + err);
              console.log('data: ' + data);
              if(err != null){
                console.log('ERROR sending mail');
                callback(null,'ERROR_SENDING_MAIL');
              }
              if(data == 'TRUE') {
                console.log('DONE creating account');
                callback(null,data);
              }
            });
          }
        });
      }else{
        console.log('Account already exist');
        callback(null,'ALREADY_EXIST');
      }
    });
  }

  async function createProduct(product_parameters,callback){
    website_expiration = Math.floor(Date.now() / 1000) + 604800;
    website_suppression = Math.floor(Date.now() / 1000) + 1209600;
    var queryString = 'INSERT INTO product (Name, description, Teaser, price, website_expiration,website_suppression, user_id, ' +
    'product_category, FileName1, FileName2, FileName3, FileName4, FileName5,region) ' +
    'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)';

    db.connection.query(queryString, [
      product_parameters[0],
      product_parameters[2],
      product_parameters[1],
      product_parameters[10],
      website_expiration,
      website_suppression,
      product_parameters[8],
      product_parameters[9],
      product_parameters[3],
      product_parameters[4],
      product_parameters[5],
      product_parameters[6],
      product_parameters[7],
      product_parameters[11]
    ],function(err, rows) {
      if (err) {
        console.log('ERROR creating product');
        console.log(err);
      }
      else{
        console.log('DONE creating product');
        callback(null,'TRUE');
      }
    });
  }

  var app = express();
  app.use(express.static(path.join(__dirname, 'public')));
  /* ==========================================================
  bodyParser() required to allow Express to see the uploaded files
  ============================================================ */
  //https://stackoverflow.com/questions/23691194/node-express-file-upload
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  async function upload(req, res, next){

    var form = new formidable.IncomingForm();
    //Formidable uploads to operating systems tmp dir by default
    form.uploadDir = "./userpictures";       //set upload directory
    form.keepExtensions = true;     //keep file extension

    form.parse(req, function(err, fields, files) {
      res.writeHead(200, {'content-type': 'text/plain'});

      //Formidable changes the name of the uploaded file
      //Rename the file to its original name
      fs.rename(files.file.path, './userpictures/' + files.file.name, function(err) {
        if (err)
        throw err;
      });
      res.end();
    });
  }

  async function logIn(login,pwd,callback){

    var queryString = 'SELECT Name,Surname,Mail,id,Address,Avatar,password,role FROM user WHERE ' +
    'Name = ? AND password = ?';
    db.connection.query(queryString, [login,pwd], function(err, rows) {
      if (err) callback(err,null);
      callback(null,rows);
    });
    //res.end( JSON.stringify(rows) );
  }

  async function changePassword(parameters,callback){
    var queryString = 'UPDATE user ' +
    'SET password = ? WHERE id = ?';

    db.connection.query(queryString, [parameters[0],parameters[1]] ,function(err, rows) {
      if (err) {
        console.log('ERROR changing password');
        callback(null,'FALSE');
      }else{
        console.log('DONE changing password');
        callback(null,'TRUE');
      }
    });
  }

  async function changeAddress(parameters,callback){
    var queryString = 'UPDATE user ' +
    'SET Address = ? WHERE id = ?';

    var params = [parameters[0],parameters[1]]

    db.connection.query(queryString, params ,function(err, rows) {
      if (err) {
        console.log('ERROR changing address');
        callback(null,'FALSE');
      }else{
        console.log('DONE changing address');
        callback(null,'TRUE');
      }
    });
  }

  async function setcontact(contact_informations,callback){

    console.log(contact_informations);

    var queryString = 'INSERT INTO contact ' +
    '(object, message, userId, status) ' +
    'VALUES (?, ?, ?, ?)';

    console.log(queryString);

    if(contact_informations[2] == null || contact_informations[2] == undefined){
      contact_informations[2] = '0';
    }

    db.connection.query(queryString, [
      contact_informations[0],
      contact_informations[1],
      contact_informations[2],
      0
    ], function(err, rows) {
      if (err) callback(err,null);
      callback(null,rows);
    });
    //res.end( JSON.stringify(rows) );
  }

  async function getcontact(contact_informations,callback){

    var queryString = 'SELECT * FROM `contact` c ';

    db.connection.query(queryString, contact_informations, function(err, rows) {
      if (err) callback(err,null);
      callback(null,rows);
    });
    //res.end( JSON.stringify(rows) );
  }

  async function showcontact(contact_informations,callback){

    var queryString = 'SELECT c.object,c.message,u.Name,u.Surname,u.id FROM `contact` c ' +
    'INNER JOIN user u ' +
    'ON u.id = c.userId ' +
    'WHERE c.id = ?';

    db.connection.query(queryString, contact_informations, function(err, rows) {
      if (err) callback(err,null);
      callback(null,rows);
    });
    //res.end( JSON.stringify(rows) );
  }

  async function product_commentary(product_identifier,callback){

    var queryString = 'SELECT * FROM `product_commentary` ' +
    'WHERE product_id = ?';

    db.connection.query(queryString, product_identifier, function(err, rows) {
      if (err) callback(err,null);
      console.log(rows);
      callback(null,rows);
    });
    //res.end( JSON.stringify(rows) );
  }

  async function setproduct_commentary(message_informations,callback){

    current_timestamp = Math.floor(Date.now() / 1000);

    var queryString = 'INSERT INTO product_commentary ' +
    '(product_id, title, message, publication_time) ' +
    'VALUES (?, ?, ?, ?)';

    console.log(queryString);

    db.connection.query(queryString, [
      message_informations[0],
      message_informations[1],
      message_informations[2],
      current_timestamp
    ], function(err, rows) {
      if (err) callback(err,null);
      callback(null,rows);
    });
    //res.end( JSON.stringify(rows) );
  }

  async function welcome(product_identifier,callback){

    var queryString = 'SELECT Name,Teaser,price,FileName1,user_id,id as product_id,website_expiration,region,product_category as id_category ' +
    'FROM product limit 5';

    db.connection.query(queryString ,function(err, rows) {
      if (err) throw err;
      callback(null,rows);
    });
  }

  async function my_product_list(user_identifier,callback){
    var queryString = 'SELECT * FROM product where user_id = ?';

    db.connection.query(queryString, user_identifier ,function(err, rows) {
      if (err) throw err;
      callback(null,rows);
    });
  }

  async function delete_product(product_id,callback){
    var queryString = 'DELETE FROM product where id = ?';

    db.connection.query(queryString, product_id ,function(err, rows) {
      if (err) {
        callback(null,'FALSE');
      }else{
        callback(null,'TRUE');
      }
    });
  }

  async function getFavorites(client_id,callback){
    var queryString = 'SELECT * FROM product p' +
    ' JOIN favorites f on f.products_id = p.id' +
    ' WHERE f.user_id = ?';

    db.connection.query(queryString, client_id ,function(err, rows) {
      if (err) throw err;
      callback(null,rows);
    });
  }

  async function setFavorites(selection_array,callback){
    var queryString = 'INSERT INTO favorites ' +
    '(user_id, products_id) ' +
    'VALUES (?, ?)';

    db.connection.query(queryString, [
      selection_array[0],
      selection_array[1]
    ],function(err, rows) {
      if (err) throw err;
      callback(null,rows);
    });
  }

  async function deleteFavorite(selection_array,callback){
    var queryString = 'DELETE FROM favorites WHERE user_id = ? AND products_id = ?';

    db.connection.query(queryString, [
      selection_array[0],
      selection_array[1]
    ],function(err, rows) {
      if (err) throw err;
      callback(null,rows);
    });
  }

  async function setNewProfilePic(picture_change,callback){
    var queryString = 'UPDATE user SET Avatar = ? WHERE id = ?';

    db.connection.query(queryString, [
      picture_change[0],
      picture_change[1]
    ],function(err, rows) {
      if (err) {
        throw err
      }else{
        callback(null,'TRUE');
      }
    });
  }

  async function confirmAccount(confirm_token,callback){
    var queryString = 'SELECT * FROM validate where token = ?';

    db.connection.query(queryString, [confirm_token],function(err, rows) {
      if (err){
        console.log('ERROR_CONFIRM_ACCOUNT');
        callback(err,null);
      }else{
        callback(null,rows);
      };
    });
  }

  async function validateAccount(data,callback){
    data = data[0];
    if(data === undefined || data === null){
      callback(null,'FALSE');
    }else{
      var queryString = 'DELETE FROM validate where token = ?';

      db.connection.query(queryString, [data['token']],function(err, rows) {
        if (err){
          console.log('ERROR_TOKEN_DELETION');
          callback(err,null);
        }else{
          var queryString = 'UPDATE user SET validated = ? WHERE Mail = ?'
          db.connection.query(queryString, ['1',data['account_mail']],function(err, rows) {
            if (err){
              console.log('ERROR_USER_UPDATE');
              callback(err,null);
            }else{
              console.log('user successfully updated');
              callback(null,'TRUE')
            }}
          );
        };
      });
    }
  }

  exports.getProduct = getProduct;
  exports.getCategory = getCategory;
  exports.getAccount = getAccount;
  exports.createAccount = createAccount;
  exports.upload = upload;
  exports.logIn = logIn;
  exports.createProduct = createProduct;
  exports.changePassword = changePassword;
  exports.changeAddress = changeAddress;
  exports.setcontact = setcontact;
  exports.getcontact = getcontact;
  exports.showcontact = showcontact;
  exports.product_commentary = product_commentary;
  exports.setproduct_commentary = setproduct_commentary;
  exports.welcome = welcome;
  exports.my_product_list = my_product_list;
  exports.delete_product = delete_product;
  exports.getFavorites = getFavorites;
  exports.setFavorites = setFavorites;
  exports.deleteFavorite = deleteFavorite;
  exports.setNewProfilePic = setNewProfilePic;
  exports.confirmAccount = confirmAccount;
  exports.validateAccount = validateAccount;
