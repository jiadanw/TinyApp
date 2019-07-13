const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const password = "purple-monkey-dinosaur"; // found in the req.params object
const hashedPassword = bcrypt.hashSync(password, 10);
const {  generateRandomString, urlsForUser } = require('./helpers');
// function generateRandomString() {
//     var result           = '';
//     var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     var charactersLength = characters.length;
//     for ( var i = 0; i < 6; i++ ) {
//        result += characters.charAt(Math.floor(Math.random() * charactersLength));
//     }
//     return result;
//  }
 

 app.use(cookieSession({
  name: 'session',
  keys: ['key'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
///////////////////
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

// const urlsForUser = function(id) {
//   let urlDatabyuser = {};
//   for (let keys in urlDatabase) {
//     if (urlDatabase[keys].userID === id) {
//       urlDatabyuser[keys] = urlDatabase[keys];
//     }
//   } 
//   for (let key in urlDatabyuser) {
//     if (!key) {
//       return false;
//     }
//   }

//   return urlDatabyuser;
// }


const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
 });
 
 app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
 });


 app.get("/urls", (req, res) => {
  let user_id = req.session['user_id']
  let urls = {};

  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === user_id){
      urls[shortURL] = {longURL: shortURL.longURL}
    }
  }
  let templateVars = { urls:urlsForUser(req.session['user_id'],urlDatabase), user : users[req.session['user_id']]}
  res.render("urls_index", templateVars);
});


app.get("/hello", (req, res) => {
  let templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
  
});

app.get("/urls/new", (req, res) => {

  let user_id = req.session['user_id']
  let templateVars = { user_id: req.session['user_id'],urls: urlDatabase, user : users[req.session['user_id']]}; 
  if (user_id) {
    res.render("urls_new", templateVars);
  }
  res.redirect("/login");
});

app.get("/urls/:shortURL", (req, res) => {
  let user_id = req.session['user_id']                         
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user : users[req.session['user_id']]};
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;

  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  let templateVars = { user : users[req.session['user_id']] };
  res.render("urls_register", templateVars); 
  
  
});

app.get("/login", (req, res) => {
  
  
  let templateVars = { user : users[req.session['user_id']]};
  
  res.render("urls_login", templateVars)
  
});

app.post("/login", (req, res) => {
  
  for (const key in users) {
    if (users[key].email === req.body.email && bcrypt.compareSync(req.body.password, users[key].password)) {
      req.session.user_id = key;
      res.redirect("/urls");
      return;
    }
  }
  res.status(403).send("Wrong user_id or password");
});

app.post("/register", (req, res) => {
  
  let randomUserId = generateRandomString();
  const { email, password} = req.body;
  for( let i in users){
  if (req.body.email === users[i]["email"]){
     res.status(403).send("Email exists");
   }}
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  users[randomUserId] = {
    id: randomUserId,
    email:email,
    password:hashedPassword
  }
  if (!email  || !password ) {
      res.status(400).send("Not Valid");
      //res.redirect()
    }
  
  req.session.user_id = randomUserId;
  res.redirect("/urls");
});


app.post("/urls/:shortURL/delete",(req, res) => {
  
  delete urlDatabase[req.params.shortURL];
  
  res.redirect("/urls")
  
})

app.post("/urls/:shortURL/edit",(req, res) => {
  
  urlDatabase[req.params.shortURL] = {longURL : req.body.longURL, userID: req.session["user_id"]}
    
  
  res.redirect(`/urls/${req.params.shortURL}`) 
})

app.post('/logout',(req,res)=>{
  req.session.user_id = null;
  res.redirect('/urls')
})


app.post("/urls", (req, res) => {
  urlDatabase[generateRandomString()] ={longURL: req.body.longURL, userID: req.session["user_id"]}
  res.redirect("/urls");
});


