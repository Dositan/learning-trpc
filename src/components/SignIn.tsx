import { signIn } from 'next-auth/react';

const SignIn = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gray-100 dark:bg-gray-800 p-10 rounded-xl">
        <h1 className="text-4xl font-extrabold my-4">Not Authorized</h1>
        <button
          className="text-2xl px-4 py-2 rounded-md text-white bg-teal-400 hover:bg-teal-500 hover:duration-500"
          onClick={() => signIn()}
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default SignIn;
