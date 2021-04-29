import { sleep, check } from "k6";
import http from "k6/http";

import jsonpath from "https://jslib.k6.io/jsonpath/1.0.2/index.js";

export const options = {
  stages: [
    { duration: "1m", target: 10 },
    { duration: "1m", target: 10 },
    { duration: "1m", target: 20 },
    { duration: "1m", target: 20 },
    { duration: "1m", target: 0 },
  ],
  ext: {
    loadimpact: {
      distribution: {
        "amazon:us:ashburn": { loadZone: "amazon:us:ashburn", percent: 100 },
      },
    },
  },
};

export default function main() {
  let response;

  const vars = {};

  // Fetch public items
  response = http.get("https://test-api.k6.io/public/crocodiles/");
  check(response, {
    "status equals 200": response => response.status.toString() === "200",
  });

  // Authenticate
  response = http.post(
    "https://test-api.k6.io/user/register/",
    '{\n  "first_name": "Bat",\n  "last_name": "Man",\n  "username": "Batman",\n  "password": "password"\n}\n',
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  check(response, {
    "$.access exists": response =>
      jsonpath.query(response.json(), "$.access").length > 0,
  });

  vars["userToken"] = jsonpath.query(response.json(), "$.access")[0];

  // Fetch private items
  response = http.get("https://test-api.k6.io/my/crocodiles/", {
    headers: {
      Authorization: `Bearer ${vars["userToken"]}`,
    },
  });

  // Automatically added sleep
  sleep(1);
}
