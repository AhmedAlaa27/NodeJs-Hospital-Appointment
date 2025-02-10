import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import prisma from "../prisma/prismaClient";

interface JwtPayload {
  id: number;
}

const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string,
}

passport.use(new JWTStrategy(jwtOptions, async (jwt_payload: JwtPayload, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: jwt_payload.id },
    });
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));

const authenticate = passport.authenticate('jwt', { session: false });

export { authenticate, passport };
