import { auth } from "@clerk/tanstack-react-start/server";

import { createServerFn } from "@tanstack/react-start";

export const fetchClerkAuth = createServerFn({ method: "GET" }).handler(
	async () => {
		const { userId, getToken } = await auth();
		const token = await getToken();

		// if (!isAuthenticated) {
		// 	// This will error because you're redirecting to a path that doesn't exist yet
		// 	// You can create a sign-in route to handle this
		// 	// See https://clerk.com/docs/tanstack-react-start/guides/development/custom-sign-in-or-up-page
		// 	throw redirect({
		// 		to: "/sign-in/$",
		// 	});
		// }

		return {
			userId,
			token,
		};
	},
);
