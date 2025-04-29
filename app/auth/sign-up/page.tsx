"use client";
import { useSearchParams } from "next/navigation";
import MaintainerSignup from "./_components/maintainer-signup";
import ManagerSignup from "./_components/manager-signup";
import ProviderSignup from "./_components/provider-signup";
import SignupSelector from "./_components/signup-selector";
import TenantSignup from "./_components/tenant-signup";

export default function SignupPage() {
  const searchParams = useSearchParams();
  const userType = searchParams.get("type") as string | undefined;

  // Validate user type
  const validUserTypes = ["tenant", "manager", "maintainer", "provider"];

  // If no valid user type is prcovided, show the selector
  if (!userType || !validUserTypes.includes(userType)) {
    return <SignupSelector />;
  }

  // Render the appropriate signup form based on user type
  switch (userType) {
    case "tenant":
      return <TenantSignup />;
    case "manager":
      return <ManagerSignup />;
    case "maintainer":
      return <MaintainerSignup />;
    case "provider":
      return <ProviderSignup />;
    default:
      // This should never happen due to the validation above
      return <SignupSelector />;
  }
}
