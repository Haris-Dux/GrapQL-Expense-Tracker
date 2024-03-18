import { FaLocationDot } from "react-icons/fa6";
import { BsCardText } from "react-icons/bs";
import { MdOutlinePayments } from "react-icons/md";
import { FaSackDollar } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { HiPencilAlt } from "react-icons/hi";
import { Link } from "react-router-dom";
import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { DELETE_TRANSACTION } from "../graphql/mutations/Transaction.mutation";
import toast from "react-hot-toast";
import { GET_AUTHENTICATED_USER, GET_USER_AND_TRANSACTIONS } from "../graphql/queries/User.queries";

interface Transaction {
	id: number;
	description: string;
	paymentType: string;
	category: string;
	location: string;
	date: string;
	amount: number;
	userId: string;
  }

  interface CardProps {
	transaction: Transaction;
  }

const categoryColorMap: Record<string, string>  = {
  Saving: "from-green-700 to-green-400",
  Expense: "from-pink-800 to-pink-600",
  Investment: "from-blue-700 to-blue-400",
};

const Card: React.FC<CardProps> = ({ transaction }) => {
  const [deleteTransaction,{loading}] = useMutation(DELETE_TRANSACTION,{
		refetchQueries:["GETTRANSACTIONS","GETTRANSACTIONSTATISTICS"]
	});
  const { data: authUserData } = useQuery(GET_AUTHENTICATED_USER);
  const {data:userandTransactions} = useQuery(GET_USER_AND_TRANSACTIONS,{
    variables:{
      userId: authUserData?.authUser?.id
    }
  });
  console.log(userandTransactions);
  const cardClass = categoryColorMap[transaction.category];
  const {
    id,
    description,
    paymentType,
    location,
	  category,
    date,
    amount,
  } = transaction;

  const handleDelete = async () => {
	try {
		await deleteTransaction({
			variables:{
				transactionId:id
			}
		});
    toast.success("Transaction deleted successfully")
	} catch (error:any) {
		throw new Error(error.message);
	}
  };

  const formatDate = (timestamp:string) => {
    const date = new Date(parseInt(timestamp));
    const options : Intl.DateTimeFormatOptions = {year:'numeric',month:'long',day:'numeric'};
    return date.toLocaleDateString('en-US', options);
  }
  return (
    <div className={`rounded-md p-4 bg-gradient-to-br ${cardClass}`}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-bold text-white">{category}</h2>
          <div className="flex items-center gap-2">
           {loading ? (
                      <div className=" w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin"></div>
                    ) :  <FaTrash className={"cursor-pointer"} onClick={handleDelete} />}
            <Link to={`/transaction/${id}`}>
              <HiPencilAlt className="cursor-pointer" size={20} />
            </Link>
          </div>
        </div>
        <p className="text-white flex items-center gap-1">
          <BsCardText />
          Description: {description}
        </p>
        <p className="text-white flex items-center gap-1">
          <MdOutlinePayments />
          Payment Type: {paymentType}
        </p>
        <p className="text-white flex items-center gap-1">
          <FaSackDollar />
          Amount: ${amount}
        </p>
        <p className="text-white flex items-center gap-1">
          <FaLocationDot />
          Location: {location}
        </p>
        <div className="flex justify-between items-center">
          <p className="text-xs text-black font-bold">{formatDate(date)}</p>
          <img
            src={authUserData?.authUser.profilePicture}
            className="h-8 w-8 border rounded-full"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};
export default Card;
