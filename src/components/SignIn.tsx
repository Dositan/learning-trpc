import { signIn } from 'next-auth/react';
import { ACTION_BUTTON, CARD } from '~/styles';

const SignIn = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className={CARD}>
        <h1 className="text-3xl font-extrabold mb-4">Not Authorized</h1>
        <button className={ACTION_BUTTON} onClick={() => signIn()}>
          Sign In
        </button>
      </div>
    </div>
  );
};

export default SignIn;
