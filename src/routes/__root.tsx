import { ClerkProvider, useAuth } from "@clerk/tanstack-react-start";
import type { ConvexQueryClient } from "@convex-dev/react-query";
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
	useRouteContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import type { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import Crosshair from "#/components/crosshair";
import Navbar from "#/components/navbar";
import { fetchClerkAuth } from "#/server/clerk";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
	convexClient: ConvexReactClient;
	convexQueryClient: ConvexQueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Skild -The registry for Agentic Intelligence",
			},
			{
				name: "description",
				content:
					"Discover,publish and operate reusable agentic capabalities from a route-driven workspace",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
	beforeLoad: async (ctx) => {
		// fetchClerkAuth handles getting the auth state on both server/client
		const { userId, token } = await fetchClerkAuth();

		// During SSR only (the only time serverHttpClient exists),
		// set the Clerk auth token to make HTTP queries with.
		// SSR Auth injection for Convex
		if (token) {
			ctx.context.convexQueryClient.serverHttpClient?.setAuth(token);
		}

		return {
			userId,
			token,
		};
	},
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const context = useRouteContext({ from: Route.id });
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<ClerkProvider>
					<ConvexProviderWithClerk
						client={context.convexClient}
						useAuth={useAuth}
					>
						<div id="root-layout">
							<header>
								<div className="frame">
									<Navbar />
									<Crosshair />
									<Crosshair />
								</div>
							</header>

							<main>
								<div className="frame">{children}</div>
							</main>
						</div>

						<TanStackDevtools
							config={{
								position: "bottom-right",
							}}
							plugins={[
								{
									name: "Tanstack Router",
									render: <TanStackRouterDevtoolsPanel />,
								},
								TanStackQueryDevtools,
							]}
						/>
					</ConvexProviderWithClerk>
				</ClerkProvider>
				<Scripts />
			</body>
		</html>
	);
}
