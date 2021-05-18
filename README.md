# Github Actions for Performance Test Workflows

Ada tiga tahap yang dilakukan ketika menjalankan performance test di Github Actions Workflow

1. Deploy image system ke kubernetes (Deployment dan Service)
2. Run k6 sebagai Job di Kubernetes
3. Ketika selesai, lakukan teardown untuk semua instance yang telah dibuat

Untuk itu, dibuatlah sebuah alur secara garis besar sebagai berikut:

1. Manual trigger dari github 
2. Pilih options seperti jenis test dan max VU
3. Github actions menjalankan `performance_test.yml` (step 1 dan 2) dan menyelesaikan job nya (detach)
4. Test selesai pada kubernetes, menjalankan fungsi teardown dimana melakukan POST Request ke Github Actions
5. Github actions menjalankan `destroy_instance.yml` (step 3)

## Manual Trigger dari Github

Beberapa input berikut dibutuhkan setiap kali melakukan trigger test.

* **test_script_filename**: Test Script Main Filename. Default adalah `main.js`. Dibutuhkan jika ingin memiliki beberapa skenario test.
* **test_options_filename**: Test Options Filename. Default adalah `load_test.js` yang tersimpan pada `k8s/test/performance/options/`. File akan di copy pada folder `scenario` menjadi `options.js` dan diimport oleh `main.js`.
* **vu**: (Opsional) Target Virtual Users. Jika dibutuhkan oleh `options.js`.
* **iteration**: (Opsional) How many times for VU to do their job? Jika dibutuhkan oleh `options.js`.
* **duration**: (Opsional) How long VU they do their job? Jika dibutuhkan oleh `options.js`.

Ada pun input data lain yang bersifat statis berada pada `env`.

* **SYSTEM_NAME**: Nama sistem ini, akan digunakan untuk mengidentifikasi deployment dan service.
* **GCP_PROJECT_ID**: GKE Project ID
* **GCP_SA_KEY**: Service account
* **USER_REPO**: Organization Name
* **REPO_NAME**: Repo Name
* **WORKFLOW_TEARDOWN_FILE_NAME**: Workflow yang akan di trigger untuk melakukan teardown semua instance
* **GITHUB_USER_API**: User yang merequest ke github API
* **GITHUB_TOKEN**: Token user diatas

## Pilih Options

* Load Test: 
  * Ramp up **1/5**
  * Hold **3/5**
  * Ramp Down **1/5**
* Soak Test: 
  * Ramp up **1/8**
  * Hold **6/8**
  * Ramp Down **1/8**
* Spike Test: 
  * Distribusi Load **15%** lalu **100%**
  * Ramp up Pertama **1/8**
  * Hold Pertama **1/8**
  * Ramp up Kedua **1/8**
  * Hold Kedua **4/8**
  * Ramp Down **1/8**
* Stress Test: 
  * Distribusi Load **50%** lalu **100%**
  * Ramp up Pertama **1/5**
  * Hold Pertama **1/5**
  * Ramp up Kedua **1/5**
  * Hold Kedua **1/5**
  * Ramp Down **1/5**

To be added
<!-- TODO tambahkan mengenai executor dan lainnya
https://k6.io/docs/using-k6/scenarios/executors/
-->


## Performance Test Workflow

* **Set up Cloud SDK**: Setup google cloud sdk hingga mendapatkan kube config
* **Deploy System**: Menyesuaikan nama deployment dan service dengan `env` yang telah dituliskan diatas, lalu melakukan `kubectl apply`
* **Configure Test Script**: Memastikan test script dan options menggunakan file yang telah dimasukan diatas lalu memasukan semua file di folder `scenario` sebagai configmap.
* **Secret for Test Script**: To be added. Agar test script dapat menggunakan env yang telah dimasukan.
* **Deploy Test Job**: Menjalankan test script sebagai kubernetes Job.

## Teardown Function

Teardown yang digunakan kurang lebih seperti ini. Dengan catatan secrets dan inputs dijadikan environment variable sehingga dapat diakses oleh K6.

```js
export function tearingdown() {

    const url = basic_url + `/repos/${__ENV.USER_REPO}/${__ENV.REPO_NAME}/actions/workflows/${__ENV.WORKFLOW_FILE_NAME}/dispatches`;

    const payload = JSON.stringify({
      "ref": "main",
      "inputs": {
          "deployment_name": `${__ENV.SYSTEM_NAME}`,
          "job_name": `${__ENV.JOB_NAME}`
      }
    });

    const credentials = `${__ENV.USER_API}:${__ENV.GITHUB_TOKEN}`;
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
```

Kita menggunakan nama workflow file (termasuk ekstensinya) untuk melakukan trigger. Fungsi ini disimpan pada folder `misc` dengan nama `teardown.js` dan fungsi bernama `tearingdown` (perhatikan + `ing`). Pada script yang dijalankan, tambahkan fungsi sebagai berikut.

```diff
import http from "k6/http";
+ import { tearingdown } from './misc/teardown.js';

...

+ export function teardown() {
+  tearingdown();
+ }
```

## Destroy Instance Workflow

Perhatikan data yang dikirimkan pada tahap sebelumnya, yang menandakan kita memberi inputs berupa `deployment_name` dan `job_name`

```json
{
  "ref": "main",
  "inputs": {
      "deployment_name": `${__ENV.SYSTEM_NAME}`,
      "job_name": `${__ENV.JOB_NAME}`
  }
}
```

<!-- TODO Ganti menggunakan kubectl bawaan dan gcloud sdk -->
Untuk melakukan destroy instance, cukup melakukan `kubectl delete`. Contoh dibawah ini jika menggunakan step dari `steebchen/kubectl@master` digabungkan dengan data inputs yang diberikan pada proses sebelumnya.

```yml
name: Destroy Instance
on: 
  workflow_dispatch:
    # Add KUBE_CONFIG_DATA in secrets
    inputs:
      # From previous step (POST request)
      deployment_name: 
        description: 'System Deployment Name'     
        required: true
      job_name:
        description: 'K6 Job Name'
        required: true

jobs:
  destroy:
    runs-on: ubuntu-latest
    steps:
      # https://github.com/marketplace/actions/kubernetes-cli-kubectl
      - name: Delete Deployment and Service
        uses: steebchen/kubectl@master
        env:
          KUBE_CONFIG_DATA: ${{ secrets.KUBE_CONFIG_DATA }}
        with:
          args: delete deployments/${{github.event.inputs.deployment_name}} services/${{github.event.inputs.deployment_name}}-svc

      - name: Delete Job
        uses: steebchen/kubectl@master
        env:
          KUBE_CONFIG_DATA: ${{ secrets.KUBE_CONFIG_DATA }}
        with:
          args: delete job/${{github.event.inputs.job_name}}
```