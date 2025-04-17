import express from "express";
import { client } from "./stream-client.js";

const router = express.Router();

router.post("/google", async (req, res) => {
  const { id, username, name, image } = req.body;

  if (!username || !id || !name || !image) {
    return res.status(400).json({ message: "Username, name, id, and image are required" });
  }

  const newUser = {
    id,
    role: "user",
    name,
    image,
  };

  try {
    await client.upsertUsers({
      users: {
        [newUser.id]: newUser,
      },
    });

    const expiry = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
    const token = client.createToken(id, expiry);

    res.status(200).json({ token, id, name });
  } catch (error) {
    console.error("Backend Error:", error); // Log error details
    res.status(500).json({ message: "Error creating user", error });
  }
});

export default router;
