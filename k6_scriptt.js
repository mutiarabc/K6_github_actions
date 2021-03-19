import http from "k6/http";
//import { sleep } from "k6";
import { Counter, Rate } from "k6/metrics";
import encoding from "k6/encoding";
import { group } from 'k6';

const VU = 4;
const MAX_BATCH_PER_HOST = 5;

let errorRate = new Rate("errors");
let errorCounter = new Counter("error_counter");
let successCounter = new Counter("success_counter");


export let optionss = {
    vus: VU,
    iterations: 1 * VU,
    
};

export let options = {
    // vus: VU,
    // iterations: 10 * VU,
    // discardResponseBodies: true,
    thresholds: {
        // http_req_duration: ['p(90) < 50', 'p(95) < 100', 'p(99.9) < 200'],
        http_req_failed: ['rate<0.01'],   // http errors should be less than 1% 
        //http_req_duration: ['p(95)<500'], // 95% of requests should be below 200ms

        },
    stages: [
    { duration: "3s", target:  Math.round(VU/4) },
    { duration: "3s", target:  Math.round(VU/4) },
    { duration: "3s", target: Math.round(VU/2) },
    { duration: "3s", target: Math.round(VU/2) },
     { duration: "3s", target: VU },
     { duration: "3s", target: Math.round(VU/2) },
     { duration: "3s", target: Math.round(VU/2) },
     { duration: "3s", target: Math.round(VU/4) },
     { duration: "3s", target: Math.round(VU/4) },
        { duration: "3s", target: 0 },
    ]
};

export function setup() {
   
    let data = {
        BASE_URL:  'https://test-api.k6.io/',
        //PARAMS: params,
    }

    return data;
}

export default function (data) {
    group("Transaction", function() {
        let params = {
            headers: {
                'Content-Type': 'application/json'

            },
            timeout: 5000,
        };

        let res = http.request('GET', `${data.BASE_URL}public/crocodile/`, null, params,{
            tags: { type: 'API' },
        });

         if (res.status === 200) {
             successCounter.add(1)
             errorRate.add(0)
         }

         else {
             errorRate.add(1)
             console.log("error token:", res.status, "error code:", res.error_code, "-", res.error);
             if(res.error === "context deadline exceeded") {
                 errorCounter.add(1, {errorType: 'deadline_exceeded'});
             }
             else if(res.error.endsWith("connection reset by peer")) {
                 errorCounter.add(1, {errorType: 'connection_reset'});
             }
             else if(res.error.endsWith("timeout")) {
                 errorCounter.add(1, {errorType: 'timeout'});
             }
             else if(res.error.endsWith("gateway")) {
                 errorCounter.add(1, {errorType: 'bad_gateway'});
             }
             else {
                 errorCounter.add(1, {errorType: 'unknown_error'})
             }
         }
        //  let token = res.json('data.access_token');
        //     //console.log("prduct id ", product_id);
            let res1 = http.request('GET', `${data.BASE_URL}public/crocodiles/1/`, null, params,{
                tags: { type: 'API' },
            });

            if (res1.status === 200) {
                successCounter.add(1)
                errorRate.add(0)
            }
            else {
                errorRate.add(1)
                console.log("error token:", res1.status, "error code:", res1.error_code, "-", res1.error);
                if(res1.error === "context deadline exceeded") {
                    errorCounter.add(1, {errorType: 'deadline_exceeded'});
                }
                else if(res1.error.endsWith("connection reset by peer")) {
                    errorCounter.add(1, {errorType: 'connection_reset'});
                }
                else if(res1.error.endsWith("timeout")) {
                    errorCounter.add(1, {errorType: 'timeout'});
                }
                else if(res1.error.endsWith("gateway")) {
                    errorCounter.add(1, {errorType: 'bad_gateway'});
                }
                else {
                    errorCounter.add(1, {errorType: 'unknown_error'})
                }
            }
        });
    }

