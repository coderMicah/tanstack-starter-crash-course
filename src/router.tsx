import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	const CONVEX_URL = (import.meta as any).env.VITE_CONVEX_URL!;
	if (!CONVEX_URL) {
		console.error("missing envar VITE_CONVEX_URL");
	}

	//ConvexReactClient -> talks to convex backend
	// It handles:
	// connecting to your Convex deployment
	// websocket / realtime sync
	// auth session communication
	// mutations and queries
	// live updates when data changes
	const convexClient = new ConvexReactClient(CONVEX_URL, {
		unsavedChangesWarning: false,
	});

	//This wraps the Convex client so it works nicely with TanStack Query’s cache system.
	const convexQueryClient = new ConvexQueryClient(convexClient);

	const queryClient: QueryClient = new QueryClient({
		defaultOptions: {
			queries: {
				queryKeyHashFn: convexQueryClient.hashFn(),
				queryFn: convexQueryClient.queryFn(),
				// gcTime:5000
			},
		},
	});
	convexQueryClient.connect(queryClient);

	const router = createTanStackRouter({
		routeTree,
		context: { queryClient, convexClient, convexQueryClient },
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
		Wrap: ({ children }) => (
			<ConvexProvider client={convexQueryClient.convexClient}>
				<QueryClientProvider client={queryClient}>
					{children}
				</QueryClientProvider>
			</ConvexProvider>
		),
	});

	setupRouterSsrQueryIntegration({ router, queryClient });

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
