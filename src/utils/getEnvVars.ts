// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EAppEnv } from "../types";

export const getEnvVars = () => ({
	NEXT_PUBLIC_APP_ENV:
		(process.env.NEXT_PUBLIC_APP_ENV as EAppEnv) || EAppEnv.DEVELOPMENT,
	NEXT_PUBLIC_DEFAULT_NETWORK: process.env.NEXT_PUBLIC_DEFAULT_NETWORK || "",
	FIREBASE_SERVICE_ACC_CONFIG: process.env.FIREBASE_SERVICE_ACC_CONFIG || "",
});
