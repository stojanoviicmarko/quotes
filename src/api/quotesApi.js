const URLS = (id) => {
	return {
		fetchAllQuotesUrl: "http://localhost:3000/quotes",
		upvoteUrl: `http://localhost:3000/quotes/${id}/upvote`,
		downVoteUrl: `http://localhost:3000/quotes/${id}/downvote`,
	};
};

export const getAllQuotes = async (page, pageSize, direction, sort) => {
	return fetch(`${URLS().fetchAllQuotesUrl}?page=${page}&pageSize=${pageSize}&sortDirection=${direction}&sortBy=${sort}`, {
		method: "GET",
	}).then((res) => {
		if (res.ok) {
			return res.json();
		} else {
			Promise.reject("Something went wrong");
		}
	});
};

export const castUpvote = async (id) => {
	return fetch(URLS(id).upvoteUrl, {
		method: "POST",
	});
};

export const castDownvote = async (id) => {
	return fetch(URLS(id).downVoteUrl, {
		method: "POST",
	});
};

export const deleteUpvote = async (id) => {
	return fetch(URLS(id).upvoteUrl, {
		method: "DELETE",
	});
};

export const deleteDownvote = async (id) => {
	return fetch(URLS(id).downVoteUrl, {
		method: "DELETE",
	});
};
