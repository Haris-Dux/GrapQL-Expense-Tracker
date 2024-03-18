import { Sequelize } from "sequelize";




const config = process.env.DATABASE_URL ;

const sequelize = new Sequelize(config,{logging:false});

export default sequelize;

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({alter:true});
        console.log("Connection to the Database successfull");
    } catch (error) {
        console.log('unable to connect',error.message);
    }
};