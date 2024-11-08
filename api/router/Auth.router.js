// routes/auth.js
import express from "express";
import { client } from "./stream-client.js";

const router = express.Router();

router.post("/google", async (req, res) => {
  const { id,username, image } = req.body;

  if (!username || !id || !image) {
    return res.status(400).json({ message: "Username, name, and image are required" });
  }

 
  const newUser = {
    id,
    role: "user",
    name:username,
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

    res.status(200).json({ token,  id, name:username });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
});

export default router;
