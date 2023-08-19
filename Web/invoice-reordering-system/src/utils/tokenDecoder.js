import jwtDecode from "jwt-decode";

export default {
  getUserNameFromToken,
  getRoleNameFromToken
}

function getUserNameFromToken() {
  var token = sessionStorage.getItem('token').toString();
  var decoded = jwtDecode(token);
  var userName = decoded.given_name;
  return userName;
}

function getRoleNameFromToken() { 
  var token = sessionStorage.getItem('token').toString(); 
  var decoded = jwtDecode(token); 
  var roleName = decoded.roleName; 
  return roleName;
}

