import { ENetwork } from "@/types";

export function isValidNetwork(network: string): boolean {
	return Object.values(ENetwork).includes(network as ENetwork);
}
