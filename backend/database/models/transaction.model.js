import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../db.js";
import UserModel from "./user.model.js";

const TransactionModel = sequelize.define('Transactions', {
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:UserModel,
            key:'id'
        }
    },
    description:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    paymentType:{
        type:DataTypes.ENUM('Cash','Card'),
        allowNull:false,
    },
    category:{
        type:DataTypes.ENUM('Saving','Expense','Investment'),
        allowNull:false,
    },
    location:{
        type:DataTypes.STRING,
        defaultValue:'Unknown'
    },
   amount:{
    type:DataTypes.FLOAT,
    allowNull:false,
   },
   date:{
    type:DataTypes.DATE,
    allowNull:false
   }
});

// Establish the relationship with the User model
TransactionModel.belongsTo(UserModel,{foreignKey:'userId'})

export default TransactionModel;