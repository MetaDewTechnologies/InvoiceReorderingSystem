import { CommonPostAxios } from "../../helpers/HttpClient";

export default {
  login,
};

async function login(data) {
  let body = {
    username: data.username,
    password: data.password,
  };
  const response = await CommonPostAxios(
    "/api/v1/auth/authenticate",
    null,
    body
  );
  return response;
}
