import bcrypt from "bcryptjs";
import UserModel from "../database/models/user.model.js";
import TransactionModel from "../database/models/transaction.model.js";

const userResolver = {
  Query: {
    authUser: async (_,__,context) => {
    try {
      const user =  await context.getUser();
      return user;
    } catch (error) {
      throw new Error(error.message)
    }
    },
    User: async (_, { userId }) => {
    try {
      const user = await UserModel.findOne({where:{id:userId}});
      return user;
    } catch (error) {
      throw new Error(error.message)
    }
    },
    //build relationship
  },
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { userName, name, password, gender } = input;
        if (!userName || !name || !password || !gender) {
          throw new Error("please fill all fields");
        }
        const user = await UserModel.findOne({ where: { userName } });
        if (user) {
          throw new Error("User already exists");
        }
        const hasheedPassword = await bcrypt.hash(password, 10);
        const maleAvatar = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
        const femaleAvatar = `https://avatar.iran.liara.run/public/girl?username=${userName}`;

        const newUser = await UserModel.create({
          userName,
          name,
          password:hasheedPassword,
          gender,
          profilePicture: gender === 'Male' ? maleAvatar : femaleAvatar
        });
        await context.login(newUser);
        return newUser;
      } catch (error) {
        throw new Error(error.message) 
      }
    },
    login: async (_,{input},context) => {
     try {
      const {password,userName} = input;
       const username = userName;
      if (!username || !password) throw new Error("All fields are required");
      const { user   } = await context.authenticate("graphql-local", {username, password});
      await context.login(user);   
      return user;
     } catch (error) {
      throw new Error(error.message)
     }
    },
    logout: async (_,__,context) => {
      try {
        await context.logout();
        context.req.session.destroy((error) => {
          if(error) throw error;
        });
        context.res.clearCookie('connect.sid');
        return {message:"Logout Sucessfull"}
      } catch (error) {
        throw new Error(error.message)
      }
    }
  },
  User:{
    transactions : async (parent) => {
      try {
        const transactions = await TransactionModel.findAll({where:{userId:parent.id}});
        return transactions;
      } catch (error) {
        throw new Error(error.message)
      }
    }
  }
};

export default userResolver;
