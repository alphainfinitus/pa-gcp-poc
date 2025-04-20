import { ENetwork } from "@/types";
import { getEnvVars } from "./getEnvVars";
import * as firebaseAdmin from "firebase-admin";

const { FIREBASE_SERVICE_ACC_CONFIG } = getEnvVars();

// init firebase admin
if (!FIREBASE_SERVICE_ACC_CONFIG) {
	throw new Error("Internal Error: FIREBASE_SERVICE_ACC_CONFIG missing.");
}

try {
	if (!firebaseAdmin.apps.length) {
		firebaseAdmin.initializeApp({
			credential: firebaseAdmin.credential.cert(
				JSON.parse(FIREBASE_SERVICE_ACC_CONFIG)
			),
		});
	}
} catch (error: unknown) {
	console.error("\nError in initialising firebase-admin: ", error, "\n");
	throw new Error("Error in initialising firebase-admin.");
}

export class OffChainDbService {
	private static firestoreDb: firebaseAdmin.firestore.Firestore =
		firebaseAdmin.firestore();

	static async GetOffChainPostData({
		network,
		index,
		proposalType,
	}: {
		network: ENetwork;
		index: number;
		proposalType: string;
	}) {
		const postDocSnapshot = await this.firestoreDb
			.collection("posts")
			.where("proposalType", "==", proposalType)
			.where("index", "==", Number(index))
			.where("network", "==", network)
			.where("isDeleted", "==", false)
			.limit(1)
			.get();

		if (postDocSnapshot.empty) {
			return null;
		}

		const postData = postDocSnapshot.docs[0].data();

		return {
			...postData,
			content: postData.content || "",
			createdAt: postData.createdAt?.toDate(),
			updatedAt: postData.updatedAt?.toDate(),
		};
	}
}
