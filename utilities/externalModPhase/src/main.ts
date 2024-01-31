import { config } from "dotenv";
import express, { json } from "express";

const run = async () => {
  config();

  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 7000;
  const HOST = process.env.HOST ? process.env.HOST : "localhost";

  const app = express();
  app.use(json());

  app.get("/", (req, res) => {
    res.status(200).send("external mod phase tester");
  });

  app.post("/api/approve", (req, res) => {
    console.log(req.body);

    const result = {
      status: "APPROVED",
    }

    res.send(result);
  });

  app.post("/api/reject", (req, res) => {
    const result = {
      moderationAction: {
        status: "REJECTED",
      },
      status: "REJECTED",
    }

    res.send(result);
  });

  app.post("/api/rejectWithReason", (req, res) => {
    const result = {
      moderationAction: {
        status: "REJECTED",
        rejectionReason: {
          code: "ABUSIVE",
          legalGrounds: "some legal grounds",
          detailedExplanation: "a detailed explanation",
          customReason: "some custom reason",
        },
      },
      status: "REJECTED",
    }

    res.send(result);
  });

  app.listen(PORT, HOST, () => {
    console.log(`external mod phase tester is listening on "${HOST}:${PORT}"...`);
  });
};

void run();
