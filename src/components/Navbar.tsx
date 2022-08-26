import { signIn, useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

const Navbar = () => {
  const { data: session } = useSession();
  return (
    <nav className="flex items-center justify-between my-2 mx-4">
      <Link href="/">
        <a className="text-2xl font-semibold">qaldyr</a>
      </Link>
      {session ? (
        <div className="flex items-center gap-4">
          <Link href="/profile">
            <a>My Posts</a>
          </Link>
          <button onClick={() => signOut()}>Sign Out</button>
        </div>
      ) : (
        <button onClick={() => signIn()}>Sign In</button>
      )}
    </nav>
  );
};

export default Navbar;
