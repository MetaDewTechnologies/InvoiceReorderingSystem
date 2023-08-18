import jwtDecode from "jwt-decode";

export default {
  getUserNameFromToken,
  getUserIDFromToken,
  isTokenExists,
  getRoleIDFromToken,
  getRoleLevelFromToken,
  getRoleNameFromToken
}

function getUserNameFromToken() {
  var token = sessionStorage.getItem('token').toString();
  var decoded = jwtDecode(token);
  var userName = decoded.given_name;
  return userName;
}

function getUserIDFromToken() {
  var token = sessionStorage.getItem('token').toString();
  var decoded = jwtDecode(token);
  var userId = parseInt(decoded.nameid);
  return userId;
}

function isTokenExists() {
  var token = sessionStorage.getItem('token');
  if (token == null || token == undefined) {
    return false;
  }
  return true;
}

function getRoleIDFromToken() {
  var token = sessionStorage.getItem('token').toString();
  var decoded = jwtDecode(token);
  var roleID = parseInt(decoded.roleID);
  return roleID;
}

function getRoleLevelFromToken() {
  var token = sessionStorage.getItem('token').toString();
  var decoded = jwtDecode(token);
  var roleLevel = parseInt(decoded.roleLevel);
  return roleLevel;
}

function getRoleNameFromToken() { 
  var token = sessionStorage.getItem('token').toString(); 
  var decoded = jwtDecode(token); 
  var roleName = decoded.roleName; 
  return roleName;
}

