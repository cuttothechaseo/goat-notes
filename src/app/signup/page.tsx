import AuthForm from "@/components/AuthForm";
import { Card, CardTitle, CardHeader } from "@/components/ui/card";

function SignUpPage() {
  return (
    <div className="mt-20 flex flex-1 flex-col items-center">
      <Card className="w-full max-w-md">
        <CardHeader className="mb-4">
          <CardTitle className="text-center text-3xl">Sign Up</CardTitle>
        </CardHeader>
        <AuthForm type="signup" />
      </Card>
    </div>
  );
}

export default SignUpPage;
