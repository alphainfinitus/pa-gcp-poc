// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

"use server";

import { headers } from "next/headers";
import { getEnvVars } from "@/utils/getEnvVars";
import { ENetwork } from "@/types";
import { EAppEnv } from "@/types";
import { isValidNetwork } from "./isValidNetwork";

export async function getNetworkFromHeaders(): Promise<ENetwork> {
	const readonlyHeaders = await headers();

	const { NEXT_PUBLIC_APP_ENV, NEXT_PUBLIC_DEFAULT_NETWORK: defaultNetwork } =
		getEnvVars();

	const headerNetwork = readonlyHeaders.get("x-network");
	const host = readonlyHeaders.get("host");
	const xForwardedHost = readonlyHeaders.get("x-forwarded-host");
	const subdomain = host?.split(".")?.[0] || xForwardedHost?.split(".")?.[0];

	// Try to determine network from x-network header or subdomain
	const network = isValidNetwork(headerNetwork as ENetwork)
		? (headerNetwork as ENetwork)
		: isValidNetwork(subdomain as ENetwork)
		? (subdomain as ENetwork)
		: null;

	if (network) {
		console.log("Found valid network from headers:", network);
		return network;
	}

	// Check if it is preview link (without subdomain) or dev environment
	const isDevelopmentOrPreviewEnv = NEXT_PUBLIC_APP_ENV !== EAppEnv.PRODUCTION;

	// In development or special environments, use default network
	if (isDevelopmentOrPreviewEnv) {
		console.log("Not production env, using default network:", defaultNetwork);
		return defaultNetwork as ENetwork;
	}

	// If we get here, we couldn't determine a valid network
	console.log("Failed to determine network from headers");
	throw new Error("Invalid network in request headers");
}
