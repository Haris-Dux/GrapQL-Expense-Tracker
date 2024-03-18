import passport from "passport";
import UserModel from "../database/models/user.model.js";
import { GraphQLLocalStrategy } from "graphql-passport";
import bcrypt from "bcryptjs"



export const configurePassport = async () => {
    // Serialize user into the session
    passport.serializeUser((user,done)=>{
        done(null,user.id);
    });

    // Deserialize user 
    passport.deserializeUser( async (id,done)=>{
       try {
        const user = await UserModel.findOne({where:{id}});
        done(null,user);
       } catch (error) {
        done(error);
       }
    });

    passport.use(
		new GraphQLLocalStrategy(async (username, password, done) => {
			try {
                if (!username || !password) throw new Error("All fields are required");
				const user = await UserModel.findOne({ where : {userName : username } });
				if (!user) {
					throw new Error("Invalid username or password");
				}
				const validPassword = await bcrypt.compare(password, user.password);

				if (!validPassword) {
					throw new Error("Invalid username or password");
				}

				return done(null, user);
			} catch (err) {
				return done(err);
			}
		})
	);
};

