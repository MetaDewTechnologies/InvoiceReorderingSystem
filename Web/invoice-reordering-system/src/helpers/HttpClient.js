import axios from "axios";

var serviceUrl =
  "http://Env-new-env.eba-ivwrktva.us-east-1.elasticbeanstalk.com";

// export const CommonGet = (url, queryString) => {
//   return new Promise((resolve, reject) => {
//     let request = new XMLHttpRequest();
//     if (queryString != null) {
//       request.open("GET", serviceUrl + url + "?" + AESEncryption(queryString));
//     } else {
//       request.open("GET", serviceUrl + url);
//     }

//     request.setRequestHeader("Content-type", "application/json; charset=utf-8");
//     request.setRequestHeader("Access-Control-Allow-Methods", "*");
//     request.setRequestHeader("Accept-Language", "en-US");
//     request.onload = () => {
//       if (request.response === "Token Time Exceed") {
//         window.logout.logout();
//       } else {
//         if (request.status >= 200 && request.status < 300) {
//           resolve(JSON.parse(AESDecryption(request.response)));
//         } else {
//           reject(request.statusText);
//         }
//       }
//     };
//     request.onerror = () => {
//       reject(request.statusText);
//     };
//     request.send();
//   });
// };

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

// export const CommonPost = (url, queryString, body) => {
//   const bearerToken = sessionStorage.getItem("token");
//   return new Promise((resolve, reject) => {
//     let request = new XMLHttpRequest();
//     if (queryString != null) {
//       request.open("POST", serviceUrl + url + "?" + AESEncryption(queryString));
//     } else {
//       request.open("POST", serviceUrl + url);
//     }
//     request.setRequestHeader("Content-type", "application/json; charset=utf-8");
//     request.setRequestHeader("Access-Control-Allow-Methods", "*");
//     request.setRequestHeader("Accept-Language", "en-US");
//     request.setRequestHeader("Authorization", `Bearer ${bearerToken}`);
//     request.setRequestHeader("Access-Control-Allow-Origin", "*");
//     request.onload = () => {
//       if (request.response === "Token Time Exceed") {
//         window.logout.logout();
//       } else {
//         if (request.status >= 200 && request.status < 300) {
//           resolve(JSON.parse(request.response));
//         } else {
//           reject(request.statusText);
//         }
//       }
//     };
//     request.onerror = () => {
//       reject(request.statusText);
//     };
//     request.send(body);
//   });
// };

// export const CommonPost = (url, queryString, body) => {
//     const bearerToken = sessionStorage.getItem('token');
//     let data = JSON.stringify(body);
//     console.log("body", body);
//     let originURL;
//     if (queryString != null) {
//         originURL = serviceUrl + url + "?" + AESEncryption(queryString);
//     } else {
//         originURL = serviceUrl + url;
//     }
//     let config = {
//     method: 'post',
//     maxBodyLength: Infinity,
//     url: originURL,
//     headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${bearerToken}`
//     },
//         data : data
//     };
//     console.log("config ",config)
//     axios.request(config)
//     .then((response) => {
//     console.log(JSON.stringify(response.data));
//     })
//     .catch((error) => {
//     console.log(error);
//     });
//     }

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
