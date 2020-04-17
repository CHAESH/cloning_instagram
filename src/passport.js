import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });

import passport from "passport";
import JwtStrategy from "passport-jwt";

const jwtOption = {
    // Authorization 헤더에서 jwt를 찾는 역할
    jwtFromRequest = JwtStrategy.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secret = process.env.JWT_SECRET
};

/** passport.use를 사용하여 JwtStrategy 실행 **/
// passport.use(new JwtStrategy(jwtOption), callback)
// JWT는 토큰을 입력받고 정보를 해석함. 해석한 정보를 callback 함수로 전달

/* callback function*/
// done: function which is called when we found matched user
const verifyUser = (payload, done) => {
    try{

    }catch
};

passport.use(new JwtStrategy(jwtOption),)