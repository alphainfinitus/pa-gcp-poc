// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DEFAULT_PROPOSAL_TYPE } from "@/constants";
import { getNetworkFromHeaders } from "@/utils/getNetworkFromHeaders";
import { OffChainDbService } from "@/utils/offChainDb.service";
import { OnChainDbService } from "@/utils/onChainDb.service";
import { withErrorHandling } from "@/utils/withErrorHandling";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const zodParamsSchema = z.object({
	index: z.coerce.number().min(0),
});

export const GET = withErrorHandling(
	async (
		req: NextRequest,
		{ params }: { params: Promise<{ index: string }> }
	): Promise<NextResponse> => {
		const { index } = zodParamsSchema.parse(await params);
		const network = await getNetworkFromHeaders();

		const onChainInfo = await OnChainDbService.GetOnChainPostInfo({
			network,
			index,
			proposalType: DEFAULT_PROPOSAL_TYPE,
		});

		const offChainPostData = await OffChainDbService.GetOffChainPostData({
			network,
			index,
			proposalType: DEFAULT_PROPOSAL_TYPE,
		});

		const post = {
			...offChainPostData,
			network,
			proposalType: DEFAULT_PROPOSAL_TYPE,
			onChainInfo,
		};

		return NextResponse.json(post);
	}
);
