import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import Cards from "../Cards";
import TransactionForm from "../TransactionForm";
import React, { useEffect, useState } from "react";

import { MdLogout } from "react-icons/md";
import { useMutation, useQuery } from "@apollo/client";
import { LOGOUT_USER } from "../../graphql/mutations/User.mutation";
import toast from "react-hot-toast";
import { GET_TRANSACTION_STATISTICS } from "../../graphql/queries/Transaction.query";
import { GET_AUTHENTICATED_USER } from "../../graphql/queries/User.queries";

ChartJS.register(ArcElement, Tooltip, Legend);



const HomePage : React.FC = () => {
	const {data} = useQuery(GET_TRANSACTION_STATISTICS);
	const { data: authUserData } = useQuery(GET_AUTHENTICATED_USER);
	
	const [chartData,setChartData] = useState({
		labels: [],
		datasets: [
			{
				label:"%",
				data: [],
				backgroundColor: [],
				borderColor: [],
				borderWidth: 1,
				borderRadius: 30,
				spacing: 10,
				cutout: 130,
			},
		],
	});
	
	useEffect(()=>{
		if(data?.getTransactionStatistics){
			const categories = data.getTransactionStatistics.map((stat:any)=>stat.category);
			const totalAmounts = data.getTransactionStatistics.map((stat:any)=>stat.totalAmount);
			
			const backgroundColors : string[] = [];
			const borderColors : string[] = [];

			categories.forEach((category:string) => {
				if(category === "Saving"){
					backgroundColors.push("rgba(75, 192, 192)")
					borderColors.push("rgba(75, 192, 192)")
				} else if(category === "Expense"){
					backgroundColors.push("rgba(255, 99, 132)")
					borderColors.push("rgba(255, 99, 132)")
				} else if(category === "Investment"){
					backgroundColors.push("rgba(54, 162, 235)")
					borderColors.push("rgba(54, 162, 235, 1)")
				}
			});

			setChartData((prev:any) => ({
				labels: categories,
				datasets: [
					{
						...prev.datasets[0],
						data: totalAmounts,
						backgroundColor: backgroundColors,
						borderColor: borderColors,
					},
				],
			}));
		}

	},[data]);

    const [logout,{loading,client}] = useMutation(LOGOUT_USER,{
		refetchQueries:['GETAUTHENTICATEDUSER']
	})

	const handleLogout = async () => {
		try {
			await logout();
			client.resetStore()
			toast.success('Logout Sucessfull')
		} catch (error:any) {
			toast.error(error.message);
		}
	};

	

	return (
		<>
			<div className='flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 relative justify-center'>
				<div className='flex items-center'>
					<p className='md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text'>
						Spend wisely, track wisely
					</p>
					<img
						src={authUserData?.authUser.profilePicture}
						className='w-11 h-11 rounded-full border cursor-pointer'
						alt='Avatar'
					/>
					{!loading && <MdLogout className='mx-2 w-5 h-5 cursor-pointer' onClick={handleLogout} />}
					{/* loading spinner */}
					{loading && <div className='w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin'></div>}
				</div>
				<div className='flex flex-wrap w-full justify-center items-center gap-6'>
				{data?.getTransactionStatistics.length > 0 && (
						<div className='h-[330px] w-[330px] md:h-[360px] md:w-[360px]  '>
							<Doughnut data={chartData} />
						</div>
					)}


					<TransactionForm />
				</div>
				<Cards />
			</div>
		</>
	);
};
export default HomePage;
