import { SignUp } from "@clerk/tanstack-react-start";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/sign-up/$")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
	  <div id="sign-up">
		<SignUp
		  routing="path"
		  path="/sign-up"
		  signInUrl="/sign-in"
		  fallbackRedirectUrl="/"
		/>
	  </div>
	);
  }
