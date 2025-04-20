// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { NextRequest, NextResponse } from "next/server";
import { getNetworkFromHeaders } from "./getNetworkFromHeaders";

export const withErrorHandling = (handler: {
	(req: NextRequest, context?: unknown): Promise<NextResponse>;
}) => {
	return async (req: NextRequest, context?: unknown) => {
		try {
			// check if network header is valid, throws error if not
			await getNetworkFromHeaders();
			return await handler(req, context);
		} catch (error) {
			console.log("Error in API at: ", req.nextUrl.href);
			console.error({ error });
			return NextResponse.json(
				{ message: (error as Error).message },
				{ status: 500 }
			);
		}
	};
};
