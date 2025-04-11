import { shadow } from "@/styles/utils";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { ModeToggle } from "./DarkModeToggle";
import LogOutButton from "./LogOutButton";

function Header() {
  const user = 1;
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

        <h1 className="flex flex-col pb-1 text-2xl font-semibold leading-6">
          GOAT <span>Notes</span>
        </h1>
      </Link>

      <div className="flex gap-4">
        {user ? (
          <LogOutButton />
        ) : (
          <>
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/signup" className="hidden sm:block">
                Sign Up
              </Link>
            </Button>
          </>
        )}
        <ModeToggle />
      </div>
    </header>
  );
}

export default Header;
