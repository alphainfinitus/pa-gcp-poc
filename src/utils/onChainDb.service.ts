import { SUBSQUID_URLS } from "@/constants";
import { ENetwork } from "@/types";
import { cacheExchange, Client as UrqlClient, fetchExchange } from "@urql/core";

export class OnChainDbService {
	private static GET_PROPOSALS_LISTING_BY_TYPE_QUERY = `
		query GetProposalsListingByType($limit: Int!, $offset: Int!, $type_eq: ProposalType!) {
			proposals(limit: $limit, offset: $offset, where: {type_eq: $type_eq}, orderBy: index_DESC) {
				createdAt
				description
				index
				origin
				proposer
				reward
				status,
				curator,
				hash,
				preimage {
					proposedCall {
						args
					}
				}
				statusHistory {
					status
					timestamp
				}
			}

			proposalsConnection(orderBy: id_ASC, where: {type_eq: $type_eq}) {
				totalCount
			}
		}
	`;

	private static GET_PROPOSAL_BY_INDEX_AND_TYPE = `
		query ProposalByIndexAndType($index_eq: Int!, $type_eq: ProposalType!) {
			proposals(where: {index_eq: $index_eq, type_eq: $type_eq}, limit: 1) {
				index
				hash
				createdAt
				proposer
				status
				curator
				description
				origin,
				preimage {
					proposedCall {
						args
					}
				}
				statusHistory {
					status
					timestamp
					block
				}
			}
		}
	`;

	private static subsquidGqlClient = (network: ENetwork) => {
		const subsquidUrl = SUBSQUID_URLS[network];

		if (!subsquidUrl) {
			throw new Error("Subsquid URL not found for the given network");
		}

		return new UrqlClient({
			url: subsquidUrl,
			exchanges: [cacheExchange, fetchExchange],
		});
	};

	static async GetOnChainPostsListing({
		network,
		proposalType,
		limit,
		page,
	}: {
		network: ENetwork;
		proposalType: string;
		limit: number;
		page: number;
	}) {
		const gqlClient = this.subsquidGqlClient(network);

		const gqlQuery = this.GET_PROPOSALS_LISTING_BY_TYPE_QUERY;

		const { data: subsquidData, error: subsquidErr } = await gqlClient
			.query(gqlQuery, {
				limit,
				offset: (page - 1) * limit,
				type_eq: proposalType,
			})
			.toPromise();

		if (subsquidErr || !subsquidData) {
			console.error(
				`Error fetching on-chain posts listing from Subsquid: ${subsquidErr}`
			);
			throw new Error("Error fetching on-chain posts listing from Subsquid");
		}

		if (subsquidData.proposals.length === 0) {
			return {
				items: [],
				totalCount: subsquidData.proposalsConnection.totalCount,
			};
		}

		const posts = subsquidData.proposals.map(
			(proposal: {
				createdAt: string;
				description?: string | null;
				index: number;
				origin: string;
				proposer?: string;
				curator?: string;
				status?: string;
				reward?: string;
				hash?: string;
				preimage?: {
					proposedCall?: {
						args?: Record<string, unknown>;
					};
				};
				statusHistory?: Array<{
					status: string;
					timestamp: string;
				}>;
			}) => {
				return {
					createdAt: new Date(proposal.createdAt),
					description: proposal.description || "",
					index: proposal.index,
					origin: proposal.origin,
					proposer: proposal.proposer || "",
					status: proposal.status || "",
					type: proposalType,
					hash: proposal.hash || "",
					preimageArgs: proposal.preimage?.proposedCall?.args ?? {},
				};
			}
		);

		return {
			items: posts,
			totalCount: subsquidData.proposalsConnection.totalCount,
		};
	}

	static async GetOnChainPostInfo({
		network,
		index,
		proposalType,
	}: {
		network: ENetwork;
		index: number;
		proposalType: string;
	}) {
		const gqlClient = this.subsquidGqlClient(network);

		const query = this.GET_PROPOSAL_BY_INDEX_AND_TYPE;
		const variables = { index_eq: index, type_eq: proposalType };

		const { data: subsquidData, error: subsquidErr } = await gqlClient
			.query(query, variables)
			.toPromise();

		if (subsquidErr || !subsquidData) {
			console.error(
				`Error fetching on-chain post info from Subsquid: ${subsquidErr}`
			);
			throw new Error("Error fetching on-chain post info from Subsquid");
		}

		if (subsquidData.proposals.length === 0) return null;

		const proposal = subsquidData.proposals[0];

		return {
			createdAt: proposal.createdAt,
			curator: proposal.curator || "",
			proposer: proposal.proposer || "",
			status: proposal.status,
			index: proposal.index,
			hash: proposal.hash,
			origin: proposal.origin,
			description: proposal.description || "",
			preimageArgs: proposal.preimage?.proposedCall?.args || {},
			timeline: proposal.statusHistory || [],
		};
	}
}
