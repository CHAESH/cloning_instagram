import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { prisma } from "../generated/prisma-client";

// passport-jwt 인증에 사용할 옵션
const jwtOption = {
  // header에 bearer스키마에 담겨온 토큰 해석할 것
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // 해당 복호화 방법사용
  secretOrKey: process.env.JWT_SECRET,
};

/** passport.use를 사용하여 Strategy 실행 **/
// passport.use(new Strategy(jwtOption), callback)
// JWT는 토큰을 입력받고 정보를 해석함. 해석한 정보를 callback 함수로 전달

/* 인증 성공시 callback function*/
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

// verifyUser가 호출되고난 후 passport인증
export const authenticateJwt = (req, res, next) =>
  passport.authenticate("jwt", { session: false }, (error, user) => {
    // veryfiyUser에서 user를 찾았다면 서버에게 요청하는 req 객체의 user에 담아서 서버에게 넘겨줌
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);

// jwtOptions를 기반으로한 jwt 전략으로 인증하고 성공시 verifyUser 호출
passport.use(new Strategy(jwtOption, verifyUser));
passport.initialize();
