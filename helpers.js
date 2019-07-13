const bcrypt = require('bcrypt');

// const getUserByEmail = function (email, database) {
//   let user = undefined;
//   for (let keys in database) {
//     if (database[keys].email === email) {
//       user = keys;
//     }
//   }
//   return user;
// };

function generateRandomString() {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < 6; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const urlsForUser = function(id,urlDatabase) {
  let urlDatabyuser = {};
  for (let keys in urlDatabase) {
    if (urlDatabase[keys].userID === id) {
      urlDatabyuser[keys] = urlDatabase[keys];
    }
  } 
  for (let key in urlDatabyuser) {
    if (!key) {
      return false;
    }
  }

  return urlDatabyuser;
}


module.exports = {  generateRandomString, urlsForUser };