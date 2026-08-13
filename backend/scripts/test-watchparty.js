// Script test manual: simulasi 2 client konek ke room yang sama,
// client A kirim "play" di detik 10, verifikasi client B nerima event itu.
const WebSocket = require("ws");

const ROOM = process.argv[2];
const BASE = "ws://localhost:8000/ws/watchparty";

const clientA = new WebSocket(`${BASE}?room=${ROOM}&client=clientA`);
const clientB = new WebSocket(`${BASE}?room=${ROOM}&client=clientB`);

let bReceived = false;

clientB.on("message", (data) => {
  console.log("[clientB menerima]", data.toString());
  bReceived = true;
});

clientA.on("open", () => {
  console.log("[clientA] terkoneksi");
});
clientB.on("open", () => {
  console.log("[clientB] terkoneksi");
  setTimeout(() => {
    console.log("[clientA] mengirim event play di detik 10...");
    clientA.send(JSON.stringify({ currentTime: 10, isPlaying: true, updatedBy: "clientA" }));
  }, 500);
});

setTimeout(() => {
  console.log(bReceived ? "\n✅ TEST LOLOS: clientB menerima broadcast dari clientA" : "\n❌ TEST GAGAL: clientB tidak menerima apa-apa");
  clientA.close();
  clientB.close();
  process.exit(bReceived ? 0 : 1);
}, 2000);
