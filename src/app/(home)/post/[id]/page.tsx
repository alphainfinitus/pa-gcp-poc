import { ClientFetchService } from "@/utils/clientFetch.service";
import Link from "next/link";

export default async function PostPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const { data, error } = await ClientFetchService.fetchPost({
		id: parseInt(id),
	});

	if (error || !data) {
		throw new Error((error as Error)?.message || "Error fetching post");
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const post = data as any;

	return (
		<>
			<div className="flex justify-start items-center max-w-3xl mx-auto">
				<Link href="/" className="mx-3 text-xs">
					Back
				</Link>
				<h1 className="text-center my-2 text-2xl font-bold">Post</h1>
			</div>
			<div className="flex flex-col h-[90vh] overflow-auto p-4 max-w-3xl mx-auto">
				<pre className="bg-gray-100 p-4 rounded-lg shadow-inner overflow-auto whitespace-pre-wrap">
					{JSON.stringify(post, null, 2)}
				</pre>
			</div>
		</>
	);
}
