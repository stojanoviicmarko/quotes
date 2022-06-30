import { useState, useEffect, useMemo } from "react";
import { castDownvote, castUpvote, deleteDownvote, deleteUpvote, getAllQuotes } from "./api/quotesApi";
import Pagination from "./components/Pagination";
import Quote from "./components/Quote";
import "./App.css";

const App = () => {
	const [quotesList, setQuotesList] = useState([]);
	const [fetchStatus, setFetchStatus] = useState("IDLE");
	const [votingStatus, setVotingStatus] = useState("IDLE");
	const [numberOfQuotes, setNumberOfQuotes] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const pageSizeLimit = 5;
	const [sortDirecton, setSortDirection] = useState("desc");
	const [sortBy, setSortBy] = useState("author");

	const totalPageCount = useMemo(() => {
		return Math.ceil(numberOfQuotes / pageSizeLimit);
	}, [pageSizeLimit, numberOfQuotes]);

	const pages = useMemo(() => {
		const pageNumbers = [];
		for (let i = 1; i <= totalPageCount; i++) {
			pageNumbers.push(i);
		}
		return pageNumbers;
	}, [pageSizeLimit, numberOfQuotes]);

	const handleUpVote = async (id) => {
		switch (findSelectedQuote(id, quotesList).givenVote) {
			case "none":
				setVotingStatus("PENDING");
				castUpvote(id)
					.then(() => setVotingStatus("SUCCESS"))
					.catch(() => setVotingStatus("ERROR"));
				break;
			case "upvote":
				setVotingStatus("PENDING");
				deleteUpvote(id)
					.then(() => setVotingStatus("SUCCESS"))
					.catch(() => setVotingStatus("ERROR"));
				break;
			case "downvote":
				setVotingStatus("PENDING");
				deleteDownvote(id)
					.then(() =>
						castUpvote(id)
							.then(() => setVotingStatus("SUCCESS"))
							.catch(() => setVotingStatus("ERROR"))
					)
					.catch(() => setVotingStatus("ERROR"));
				break;
		}
	};

	const handleDownVote = async (id) => {
		switch (findSelectedQuote(id, quotesList).givenVote) {
			case "none":
				setVotingStatus("PENDING");
				castDownvote(id)
					.then(() => setVotingStatus("SUCCESS"))
					.catch(() => setVotingStatus("ERROR"));
				break;
			case "downvote":
				setVotingStatus("PENDING");
				deleteDownvote(id)
					.then(() => setVotingStatus("SUCCESS"))
					.catch(() => setVotingStatus("ERROR"));
				break;
			case "upvote":
				setVotingStatus("PENDING");
				deleteUpvote(id)
					.then(() =>
						castDownvote(id)
							.then(() => setVotingStatus("SUCCESS"))
							.catch(() => setVotingStatus("ERROR"))
					)
					.catch(() => setVotingStatus("ERROR"));
				break;
		}
	};

	const handleNextPage = () => {
		if (currentPage < totalPageCount) {
			setCurrentPage(currentPage + 1);
		}
	};

	const handlePrevPage = () => {
		if (currentPage >= totalPageCount) {
			setCurrentPage(currentPage - 1);
		}
	};

	const findSelectedQuote = (id, quotes) => {
		return quotes.find((q) => q.id === id);
	};

	useEffect(() => {
		let ignore = false;
		getAllQuotes(currentPage, pageSizeLimit, sortDirecton, sortBy)
			.then((data) => {
				if (!ignore) {
					setQuotesList(data.quotes);
					setNumberOfQuotes(data.quotesCount);
				}
			})
			.catch((err) => {
				console.error("Something went wrong.", err);
				setFetchStatus("ERROR");
			});
		return () => {
			ignore = true;
		};
	}, [votingStatus, currentPage, sortDirecton, sortBy]);

	const renderQuotes = quotesList?.map((quote) => (
		<Quote
			key={quote.id}
			id={quote.id}
			content={quote.content}
			author={quote.author}
			upVotes={quote.upvotesCount}
			downVotes={quote.downvotesCount}
			handleUpVote={handleUpVote}
			handleDownVote={handleDownVote}
			givenVote={quote.givenVote}
		/>
	));

	if (fetchStatus === "ERROR") {
		return (
			<div className="app">
				<h1 className="app__title">Something went wrong.</h1>
			</div>
		);
	}

	return (
		<div className="app">
			<h1 className="app__title">Quotes</h1>
			<div className="sorting__filtering">
				<select defaultValue="desc" onChange={(e) => setSortDirection(e.target.value)}>
					<option value="desc">Descending</option>
					<option value="asc">Ascending</option>
				</select>
				<select defaultValue="author" onChange={(e) => setSortBy(e.target.value)}>
					<option value="author">Author</option>
					<option value="createdAt">Created at</option>
					<option value="upvotesCount">Upvotes count</option>
				</select>
			</div>

			{renderQuotes}
			<Pagination nextPage={handleNextPage} prevPage={handlePrevPage} pages={pages} current={currentPage} setCurrent={setCurrentPage} />
		</div>
	);
};

export default App;
