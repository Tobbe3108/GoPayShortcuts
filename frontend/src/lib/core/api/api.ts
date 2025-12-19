// API Error type
export interface ApiError {
	status: string;
	details: string;
	displayMessage: string;
	isUserMessage: boolean;
}

// Common request options
export interface RequestOptions {
	signal?: AbortSignal;
}
