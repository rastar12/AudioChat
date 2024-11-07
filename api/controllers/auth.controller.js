import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { client } from '../stream-client.js'; 

export const Google = async (req, res, next) => {
  try {
    const { email, name, photo } = req.body;

    if (!email || !name || !photo) {
      return res.status(400).json({ error: 'Required user information is missing' });
    }

    const username = name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4);

    // Check if user already exists on Stream
    let userExists;
    try {
      userExists = await client.getUser(username);
    } catch (error) {
      userExists = null;
    }

    let token;

    if (userExists) {
      // User exists: generate Stream token
      const expiry = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // Token valid for 24 hours
      token = client.createToken(username, expiry);
    } else {
      // User does not exist: create a new user
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = {
        id: username,
        role: 'user',
        name,
        image: photo,
      };

      // Create user on Stream
      await client.upsertUsers({
        users: {
          [newUser.id]: newUser,
        },
      });

      // Generate Stream token
      const expiry = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
      token = client.createToken(username, expiry);
    }

    // Set the token in a cookie and return it in the response
    res.cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json({ token, id: username, name, avatar: photo }); // Include token in response
  } catch (error) {
    next(error); // Pass to errorHandler middleware for proper JSON error response
  }
};
