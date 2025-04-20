import { ClientFetchService } from "@/utils/clientFetch.service";
import Link from "next/link";

export default async function Home() {
	const { data, error } = await ClientFetchService.fetchPostsList({
		page: 1,
	});

	if (error || !data) {
		throw new Error((error as Error)?.message || "Error fetching posts list");
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const posts = (data as any)?.items as Record<string, any>[];

	return (
		<>
			<h1 className="text-center my-2 text-2xl font-bold">Posts List</h1>
			<div className="flex flex-col h-[90vh] overflow-auto p-4 max-w-3xl mx-auto">
				{posts?.map((post) => (
					<Link
						key={post.onChainInfo.index}
						href={`/post/${post.onChainInfo.index}`}
						className="mb-4 bg-gray-200 rounded-sm p-4"
					>
						<h1>
							Post #{post.onChainInfo.index} - {post.title || "No title"}
						</h1>

						<p>{post.content || "No content"}</p>
					</Link>
				))}
			</div>
		</>
	);
}
