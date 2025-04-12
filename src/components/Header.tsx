import { shadow } from "@/styles/utils";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { ModeToggle } from "./DarkModeToggle";
import LogOutButton from "./LogOutButton";
import { getUser } from "@/auth/server";

async function Header() {
  const user = await getUser();
  return (
    <header
      className="bg-popover relative flex h-24 w-full items-center justify-between px-3 sm:px-8"
      style={{
        boxShadow: shadow,
      }}
    >
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/goat.png"
          height={60}
          width={60}
          alt="Goat Notes"
          className="rounded-full"
          priority
        />

        <h1 className="flex flex-col pb-1 text-2xl leading-6 font-semibold">
          GOAT <span>Notes</span>
        </h1>
      </Link>

      <div className="flex gap-4">
        {user ? (
          <LogOutButton />
        ) : (
          <>
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/signup" className="hidden sm:block">
              <Button variant="outline">Sign Up</Button>
            </Link>
          </>
        )}
        <ModeToggle />
      </div>
    </header>
  );
}

export default Header;
