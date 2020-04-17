import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });

import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { prisma } from "../generated/prisma-client";

const jwtOption = {
  // Authorization 헤더에서 jwt를 찾는 역할
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

/** passport.use를 사용하여 Strategy 실행 **/
// passport.use(new Strategy(jwtOption), callback)
// JWT는 토큰을 입력받고 정보를 해석함. 해석한 정보를 callback 함수로 전달

/* callback function*/
// done: function which is called when we found matched user
const verifyUser = async (payload, done) => {
  try {
    const user = await prisma.user({ id: payload.id });
    if (user !== null) {
      // when it works, there is no error or null
      return done(null, user);
    } else {
      return done(null, false);
      // or you could create a new account
    }
  } catch (error) {
    return done(error, false);
  }
};

passport.use(new Strategy(jwtOption, verifyUser));
