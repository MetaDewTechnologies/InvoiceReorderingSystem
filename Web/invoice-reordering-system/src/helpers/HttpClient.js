import axios from "axios";

// var serviceUrl = "https://api.matadewkiha.com";
var serviceUrl = "http://localhost:8080";
// var serviceUrl = "https://kihabeach.azurewebsites.net"

export const CommonGetAxios = async (url, queryString) => {
  const bearerToken = sessionStorage.getItem("token");
  let originURL;
  const header = {
    "Content-type": "application/json; charset=utf-8",
    "Access-Control-Allow-Methods": "*",
    "Accept-Language": "en-US",
    Authorization: `Bearer ${bearerToken}`,
  };

  if (queryString != null) {
    originURL = serviceUrl + url + "/" + queryString;
  } else {
    originURL = serviceUrl + url;
  }
  return await axios.get(originURL, [header]).then((response) => {
    if (response.statusText === "Token Time Exceed") {
      window.logout.logout();
    } else {
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        return response.statusText;
      }
    }
  });
};

export const CommonPostAxios = async (url, queryString, body) => {
  let originURL;
  const options = {
    headers: {
      "Content-type": "application/json; charset=utf-8",
      "Access-Control-Allow-Methods": "*",
      "Accept-Language": "en-US",
    },
  };

  if (queryString != null) {
    originURL = serviceUrl + url + "/" + queryString;
  } else {
    originURL = serviceUrl + url;
  }
  return await axios.post(originURL, body, options).then((response) => {
    if (response.statusText === "Token Time Exceed") {
      window.logout.logout();
    } else {
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        return response.statusText;
      }
    }
  });
};
