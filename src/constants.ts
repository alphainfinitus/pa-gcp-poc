import { ENetwork } from "./types";

export const SUBSQUID_URLS: Record<ENetwork, string> = {
	[ENetwork.POLKADOT]:
		"https://squid.subsquid.io/polkadot-polkassembly/graphql",
	[ENetwork.KUSAMA]: "https://squid.subsquid.io/kusama-polkassembly/graphql",
};

export const DEFAULT_PROPOSAL_TYPE = "ReferendumV2";
export const DEFAULT_LISTING_LIMIT = 10;
