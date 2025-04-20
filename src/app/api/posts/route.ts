// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withErrorHandling } from "@/utils/withErrorHandling";
import { getNetworkFromHeaders } from "@/utils/getNetworkFromHeaders";
import { OnChainDbService } from "@/utils/onChainDb.service";
import { DEFAULT_LISTING_LIMIT, DEFAULT_PROPOSAL_TYPE } from "@/constants";
import { OffChainDbService } from "@/utils/offChainDb.service";

export const GET = withErrorHandling(async (req: NextRequest) => {
	const zodQuerySchema = z.object({
		page: z.coerce.number().optional().default(1),
		limit: z.coerce
			.number()
			.max(DEFAULT_LISTING_LIMIT)
			.optional()
			.default(DEFAULT_LISTING_LIMIT),
	});

	const searchParamsObject = Object.fromEntries(
		Array.from(req.nextUrl.searchParams.entries()).map(([key]) => [
			key,
			req.nextUrl.searchParams.getAll(key),
		])
	);

	const { page, limit } = zodQuerySchema.parse(searchParamsObject);

	const network = await getNetworkFromHeaders();

	let posts = [];
	let totalCount = 0;

	// 1. get on-chain posts from onchain_db_service, then get the corresponding off-chain data from offchain_db_service for each on-chain post

	const onChainPostsListingResponse =
		await OnChainDbService.GetOnChainPostsListing({
			network,
			proposalType: DEFAULT_PROPOSAL_TYPE,
			limit,
			page,
		});

	// Fetch off-chain data
	const offChainDataPromises = onChainPostsListingResponse.items.map(
		(postInfo: { index: number }) => {
			return OffChainDbService.GetOffChainPostData({
				network,
				index: postInfo.index,
				proposalType: DEFAULT_PROPOSAL_TYPE,
			});
		}
	);

	const offChainData = await Promise.all(offChainDataPromises);

	// Merge on-chain and off-chain data
	posts = onChainPostsListingResponse.items.map(
		(postInfo: Record<string, unknown>, index: number) => ({
			...offChainData[Number(index)],
			network,
			proposalType: DEFAULT_PROPOSAL_TYPE,
			onChainInfo: postInfo,
		})
	);

	totalCount = onChainPostsListingResponse.totalCount;

	const response = {
		items: posts,
		totalCount,
	};

	// 3. return the data
	return NextResponse.json(response);
});
