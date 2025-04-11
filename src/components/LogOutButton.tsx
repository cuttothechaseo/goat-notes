"use client";

import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function LogOutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleLogout = async () => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const errorMessage = null;

    if (!errorMessage) {
      toast.success("Logged out successfully");
      router.push("/login");
    } else {
      toast.error(errorMessage);
    }
    setLoading(false);
  };

  return (
    <Button
      variant="outline"
      className="w-24"
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? <Loader2 className="animate-spin" /> : "Log Out"}
    </Button>
  );
}

export default LogOutButton;
