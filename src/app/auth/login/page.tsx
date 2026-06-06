import { AuthScreen } from "@/components/auth/AuthScreen";

export const metadata = { title: "Log in · VersaVid" };

export default function LoginPage() {
  return <AuthScreen mode="login" />;
}
