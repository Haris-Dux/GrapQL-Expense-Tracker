import TransactionModel from "../database/models/transaction.model.js";
import UserModel from "../database/models/user.model.js";

const transactionResolver = {
  Query: {
    transactions: async (_, __, context) => {
      try {
        if (!context.getUser()) throw new Error("unauthorized");
        const userId = await context.getUser().id;
        const transactions = await TransactionModel.findAll({
          where: { userId: userId },
        });
        return transactions;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    getTransaction: async (_, { transactionId }) => {
      try {
        const transaction = await TransactionModel.findOne({
          where: { id: transactionId },
        });
        return transaction;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    getTransactionStatistics: async (_,__,context) => {
      if(!context.getUser()) throw new Error('Unauthorized');
      const userId = context.getUser().id;
      const transactions = await TransactionModel.findAll({where:{userId}});
      const categoryMap = {};

      transactions.forEach((transaction) => {
        if(!categoryMap[transaction.category]){
          categoryMap[transaction.category] = 0
        }
        categoryMap[transaction.category] += transaction.amount
      })
      return Object.entries(categoryMap).map(([category,totalAmount]) => ({category,totalAmount}))
    }
  },
  Mutation: {
    createTransaction: async (_, { input }, context) => {
   
      try {
        const newTransaction = await TransactionModel.create({
          ...input,
          userId: await context.getUser().id,      
        });
       
        return newTransaction;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    updateTransaction: async (_, { input }) => {
      try {
        const [rowsAffected, updatedTransaction]  = await TransactionModel.update(input, {
          where: { id: input.transactionId },
          returning: true,
        });
        if (rowsAffected === 0) {
            throw new Error('Transaction not found or no updates applied.');
        }
        return updatedTransaction[0];
      } catch (error) {
        throw new Error(error.message);
      }
    },
    deleteTransaction: async (_, { transactionId  }) => {
        try {
           await TransactionModel.destroy({
            where:{id:transactionId }
          })
          return { success: true };
        } catch (error) {
          throw new Error(error.message);
        }
      }
  },
};

export default transactionResolver;
