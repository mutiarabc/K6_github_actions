import http from "k6/http";
import encoding from 'k6/encoding';

export function tearingdown() {
    const basic_url = 'https://api.github.com'
    // const basic_url = 'http://localhost:8080'
    const url = basic_url + `/repos/${__ENV.USER_REPO}/${__ENV.REPO_NAME}/actions/workflows/${__ENV.WORKFLOW_TEARDOWN_FILE_NAME}/dispatches`;

    const payload = JSON.stringify({
        "ref": "main",
        "inputs": {
            "deployment_name": `${__ENV.SYSTEM_NAME}`,
            "job_name": `${__ENV.JOB_NAME}`
        }
    });

    const credentials = `${__ENV.GITHUB_USER_API}:${__ENV.GITHUB_TOKEN}`;
    const encodedCredentials = encoding.b64encode(credentials);
    console.log(encodedCredentials)
    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Basic ${encodedCredentials}`,
        },
    };

    http.post(url, payload, params);
  
}

export function notifyTelegram() {
    // https://gitlab.alterra.id/alterra/evans/jellyfish/hedwig/-/blob/master/swagger.yaml
    // /api/v1/tele/send
    // {
    //     "bot_name": "HachiRokuBot",
    //     "to_group": "GrupBot00,TestBot",
    //     "message": "Place your message here"
    // }
}