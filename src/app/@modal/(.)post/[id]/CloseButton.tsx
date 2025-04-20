"use client";

import { useRouter } from "next/navigation";

export function CloseButton() {
	const router = useRouter();

	return (
		<button
			onClick={() => router.back()}
			className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
		>
			Close
		</button>
	);
}
