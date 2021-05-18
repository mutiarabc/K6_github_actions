import { sleep, group } from "k6";
import http from "k6/http";
import { tearingdown } from './teardown.js';
import { options } from './options.js'

export const options = {};

export default function main() {
  let response;

  group("page_1 - http://test.k6.io/", function () {
    response = http.get("http://test.k6.io/", {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "max-age=0",
        connection: "keep-alive",
        cookie:
          "_ga=GA1.2.632411891.1610344308; _hjid=ea3ce88e-4239-47e3-bc93-65375c91d7e9; k6_utm=%7B%22utm_campaign%22%3A%22postman%22%2C%20%22utm_source%22%3A%22blog%22%2C%22utm_medium%22%3A%22organic%22%7D; _lfa=LF1.1.d13facfdcb00913e.1619059718867; _gid=GA1.2.1041318581.1619418682; _gat=1",
        host: "test.k6.io",
        "upgrade-insecure-requests": "1",
        "user-agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
      },
    });
    response = http.get("http://test.k6.io/static/css/site.css", {
      headers: {
        accept: "text/css,*/*;q=0.1",
        "accept-encoding": "gzip, deflate",
        "accept-language": "en-US,en;q=0.9",
        connection: "keep-alive",
        cookie:
          "_ga=GA1.2.632411891.1610344308; _hjid=ea3ce88e-4239-47e3-bc93-65375c91d7e9; k6_utm=%7B%22utm_campaign%22%3A%22postman%22%2C%20%22utm_source%22%3A%22blog%22%2C%22utm_medium%22%3A%22organic%22%7D; _lfa=LF1.1.d13facfdcb00913e.1619059718867; _gid=GA1.2.1041318581.1619418682; _gat=1",
        host: "test.k6.io",
        referer: "http://test.k6.io/",
        "user-agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
      },
    });
    response = http.get("http://test.k6.io/static/js/prisms.js", {
      headers: {
        accept: "*/*",
        "accept-encoding": "gzip, deflate",
        "accept-language": "en-US,en;q=0.9",
        connection: "keep-alive",
        cookie:
          "_ga=GA1.2.632411891.1610344308; _hjid=ea3ce88e-4239-47e3-bc93-65375c91d7e9; k6_utm=%7B%22utm_campaign%22%3A%22postman%22%2C%20%22utm_source%22%3A%22blog%22%2C%22utm_medium%22%3A%22organic%22%7D; _lfa=LF1.1.d13facfdcb00913e.1619059718867; _gid=GA1.2.1041318581.1619418682; _gat=1",
        host: "test.k6.io",
        referer: "http://test.k6.io/",
        "user-agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
      },
    });
    response = http.get("http://test.k6.io/static/favicon.ico", {
      headers: {
        accept:
          "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "accept-encoding": "gzip, deflate",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        connection: "keep-alive",
        cookie:
          "_ga=GA1.2.632411891.1610344308; _hjid=ea3ce88e-4239-47e3-bc93-65375c91d7e9; k6_utm=%7B%22utm_campaign%22%3A%22postman%22%2C%20%22utm_source%22%3A%22blog%22%2C%22utm_medium%22%3A%22organic%22%7D; _lfa=LF1.1.d13facfdcb00913e.1619059718867; _gid=GA1.2.1041318581.1619418682; _gat=1",
        host: "test.k6.io",
        pragma: "no-cache",
        referer: "http://test.k6.io/",
        "user-agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
      },
    });
  });

  group("page_2 - http://test.k6.io/flip_coin.php", function () {
    response = http.get("http://test.k6.io/flip_coin.php", {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate",
        "accept-language": "en-US,en;q=0.9",
        connection: "keep-alive",
        cookie:
          "_ga=GA1.2.632411891.1610344308; _hjid=ea3ce88e-4239-47e3-bc93-65375c91d7e9; k6_utm=%7B%22utm_campaign%22%3A%22postman%22%2C%20%22utm_source%22%3A%22blog%22%2C%22utm_medium%22%3A%22organic%22%7D; _lfa=LF1.1.d13facfdcb00913e.1619059718867; _gid=GA1.2.1041318581.1619418682; _gat=1",
        host: "test.k6.io",
        referer: "http://test.k6.io/",
        "upgrade-insecure-requests": "1",
        "user-agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
      },
    });
  });

  group("page_3 - http://test.k6.io/flip_coin.php?bet=heads", function () {
    response = http.get("http://test.k6.io/flip_coin.php?bet=heads", {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate",
        "accept-language": "en-US,en;q=0.9",
        connection: "keep-alive",
        cookie:
          "_ga=GA1.2.632411891.1610344308; _hjid=ea3ce88e-4239-47e3-bc93-65375c91d7e9; k6_utm=%7B%22utm_campaign%22%3A%22postman%22%2C%20%22utm_source%22%3A%22blog%22%2C%22utm_medium%22%3A%22organic%22%7D; _lfa=LF1.1.d13facfdcb00913e.1619059718867; _gid=GA1.2.1041318581.1619418682; _gat=1",
        host: "test.k6.io",
        referer: "http://test.k6.io/flip_coin.php",
        "upgrade-insecure-requests": "1",
        "user-agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
      },
    });
  });

  // Automatically added sleep
  sleep(1);
}

export function teardown() {
  tearingdown();
}