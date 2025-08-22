const express = require("express");
const app = express();
app.use(express.json());

const VERIFY_TOKEN = "mySecret123"; // Change this to your own token

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("Webhook verified!");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

app.post("/webhook", (req, res) => {
  const data = req.body;

  if (data.entry && data.entry.length > 0) {
    const changes = data.entry[0].changes;
    if (changes && changes.length > 0) {
      const value = changes.value;
      if (value.messages && value.messages.length > 0) {
        const message = value.messages;
        const from = message.from;           // Customer's WhatsApp number
        const text = message.text?.body;     // Customer's message text

        console.log(`Message from ${from}: ${text}`);
      }
    }
  }

  res.sendStatus(200);  // Acknowledge receipt
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
