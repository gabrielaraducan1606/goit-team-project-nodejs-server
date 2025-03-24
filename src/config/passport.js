import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import dotenv from "dotenv";
import User from "../lib/models/user.js";

dotenv.config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.TOKEN_SECRET,
};

passport.use(
  new JwtStrategy(options, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) return done(null, user);
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);
