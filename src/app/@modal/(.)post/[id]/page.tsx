import { ClientFetchService } from "@/utils/clientFetch.service";
import { CloseButton } from "./CloseButton";

export default async function PostModal({
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
		<div className="fixed inset-0 bg-black/60 z-10 flex items-center justify-center overflow-auto p-4">
			<div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
				<div className="flex justify-between items-center p-4 border-b">
					<h1 className="text-xl font-bold">Post Details</h1>
					<CloseButton />
				</div>

				<div className="flex-1 overflow-auto p-4">
					<pre className="bg-gray-100 p-4 rounded-lg shadow-inner overflow-auto whitespace-pre-wrap">
						{JSON.stringify(post, null, 2)}
					</pre>
				</div>
			</div>
		</div>
	);
}
