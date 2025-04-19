import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  stages: [
    { duration: "1m", target: 50 },
    { duration: "2m", target: 100 },
    { duration: "1m", target: 0 },
  ],

  thresholds: {
    data_received: ["count>800000"],

    "http_req_duration{type:API}": [
      {
        threshold: "p(90) < 300", // Plus réaliste pour le cloud
        abortOnFail: true,
        delayAbortEval: "5s",
      },
    ],

    http_req_failed: [
      {
        threshold: "rate < 0.02", // 2% max d'échecs
        abortOnFail: true,
        delayAbortEval: "3s",
      },
    ],

    http_req_blocked: ["avg < 50"],
    iteration_duration: ["avg < 1500"],
    http_req_connecting: ["avg < 100"],
    http_req_receiving: ["avg < 30", "p(95) < 80", "max < 290"],
    http_req_tls_handshaking: ["avg < 20"],
    http_req_waiting: ["avg < 100"],
  },

  ext: {
    loadimpact: {
      projectID: 3743895, // ID du projet K6 Cloud
      name: "Test (30/01/2025-18:57:10)", // Nom du test dans K6 Cloud
    },
  },
};

export default function () {
  const res = http.get("https://demoblaze.com");

  check(res, {
    "Status 200": (r) => r.status === 200,
    "Connection time < 64ms": (r) => r.timings.connecting < 64,
    "Duration < 450ms": (r) => r.timings.duration < 450,
    "Waiting time < 450ms": (r) => r.timings.waiting < 450,
    "TLS handshake < 550ms": (r) => r.timings.tls_handshaking < 550,
    "Receiving time < 130ms": (r) => r.timings.receiving < 130,
  });

  console.log(`Data received: ${res.body.length} bytes`);
  sleep(1);
}
