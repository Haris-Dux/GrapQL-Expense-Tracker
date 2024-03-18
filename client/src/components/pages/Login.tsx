import { Link } from "react-router-dom";
import React,{ ChangeEvent, useState } from "react";
import InputField from "../InputField";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../../graphql/mutations/User.mutation";
import toast from "react-hot-toast";

interface LoginData {
  userName: string;
  password: string;
}

const LoginPage : React.FC = () => {
	const [loginData, setLoginData] = useState<LoginData>({
		userName: "",
		password: "",
	});

	const handleChange = (e : ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setLoginData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const [login , {loading}] = useMutation(LOGIN_USER,{
		refetchQueries:['GETAUTHENTICATEDUSER']
	});

	const handleSubmit = async (e : ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			await login({
				variables:{
					input : loginData
				}
			});
			toast.success('Successfully logged in!');
		} catch (error:any) {
			toast.error(error.message)
		}
	};

	return (
		<div className='flex justify-center items-center h-screen'>
			<div className='flex rounded-lg overflow-hidden z-50 bg-gray-300'>
				<div className='w-full bg-gray-100 min-w-80 sm:min-w-96 flex items-center justify-center'>
					<div className='max-w-md w-full p-6'>
						<h1 className='text-3xl font-semibold mb-6 text-black text-center'>Login</h1>
						<h1 className='text-sm font-semibold mb-6 text-gray-500 text-center'>
							Welcome back! Log in to your account
						</h1>
						<form className='space-y-4' onSubmit={handleSubmit}>
							<InputField
								label='Username'
								id='userName'
								name='userName'
								value={loginData.userName}
								onChange={handleChange}
								required
							/>

							<InputField
								label='Password'
								id='password'
								name='password'
								type='password'
								value={loginData.password}
								onChange={handleChange}
								required
							/>
							<div>
								<button
								disabled={loading}
									type='submit'
									className='w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black  focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300
										disabled:opacity-50 disabled:cursor-not-allowed
									'
								>
									 <div className=" flex justify-center items-center">
                    {loading ? (
                      <div className=" w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin"></div>
                    ) : (
                      "Login"
                    )}
                  </div>
								</button>
							</div>
						</form>
						<div className='mt-4 text-sm text-gray-600 text-center'>
							<p>
								{"Don't"} have an account?{" "}
								<Link to='/signup' className='text-black hover:underline'>
									Sign Up
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;
