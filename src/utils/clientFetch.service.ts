import { DEFAULT_LISTING_LIMIT } from "@/constants";
import { getBaseUrl } from "./getBaseUrl";

export class ClientFetchService {
	static async fetchPostsList({
		page,
		limit = DEFAULT_LISTING_LIMIT,
	}: {
		page: number;
		limit?: number;
	}): Promise<{
		data: unknown | null;
		error: unknown | null;
	}> {
		const queryParams = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
		});

		const baseUrl = await getBaseUrl();
		const apiUrl = new URL(`${baseUrl}/api/posts`);
		apiUrl.search = queryParams.toString();

		try {
			const response = await fetch(apiUrl);
			const data = await response.json();

			return {
				data,
				error: null,
			};
		} catch (error) {
			return {
				data: null,
				error,
			};
		}
	}

	static async fetchPost({ id }: { id: number }): Promise<{
		data: unknown | null;
		error: unknown | null;
	}> {
		const baseUrl = await getBaseUrl();
		const apiUrl = new URL(`${baseUrl}/api/posts/${id}`);

		try {
			const response = await fetch(apiUrl);
			const data = await response.json();

			return {
				data,
				error: null,
			};
		} catch (error) {
			return {
				data: null,
				error,
			};
		}
	}
}
