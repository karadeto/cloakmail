import { redirect } from "next/navigation";

const CallbackPage = async () => {
  return redirect("/dashboard");
};

export default CallbackPage;
