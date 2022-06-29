import { useState, useEffect, useMemo } from "react";
import Pagination from "./components/Pagination";
import Quote from "./components/Quote";
import "./App.css";

const URL = `http://localhost:3000`;

const App = () => {
	const [quotesList, setQuotesList] = useState([]);
	const [fetchStatus, setFetchStatus] = useState("IDLE");
	const [votingStatus, setVotingStatus] = useState("IDLE");
	const [numberOfQuotes, setNumberOfQuotes] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const pageSizeLimit = 5;

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

	const fetchQuotes = async (page, pageSize) => {
		return fetch(`${URL}/quotes?page=${page}&pageSize=${pageSize}`, {
			method: "GET",
		}).then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				Promise.reject("Something went wrong");
			}
		});
	};

	const castVote = async (id, type) => {
		setVotingStatus("VOTING");
		return fetch(`${URL}/quotes/${id}/${type}`, {
			method: "POST",
		})
			.then((res) => {
				if (res.ok) {
					res.json();
					setVotingStatus("SUCESS");
				} else {
					Promise.reject("Something went wrong");
				}
			})
			.catch((err) => {
				console.warn(err);
			});
	};

	const deleteVote = async (id, type) => {
		setVotingStatus("DELETING");
		fetch(`${URL}/quotes/${id}/${type}`, {
			method: "DELETE",
		})
			.then((res) => {
				if (res.ok) {
					res.json();
					setVotingStatus("SUCESS");
				} else {
					Promise.reject("Something went wrong");
				}
			})
			.catch((err) => {
				console.warn(err);
			});
	};

	const handleUpVote = async (id) => {
		switch (findSelectedQuote(id, quotesList).givenVote) {
			case "none":
				await castVote(id, "upvote");
				break;
			case "upvote":
				await deleteVote(id, "upvote");
				break;
			case "downvote":
				await Promise.all([await deleteVote(id, "downvote"), await castVote(id, "upvote")]).catch((err) => {
					console.warn(err);
				});
				break;
		}
	};

	const handleDownVote = async (id) => {
		switch (findSelectedQuote(id, quotesList).givenVote) {
			case "none":
				await castVote(id, "downvote");
				break;
			case "downvote":
				await deleteVote(id, "downvote");
				break;
			case "upvote":
				await Promise.all([await deleteVote(id, "upvote"), await castVote(id, "downvote")]).catch((err) => {
					console.warn(err);
				});
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
		fetchQuotes(currentPage, pageSizeLimit)
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
	}, [votingStatus, currentPage]);

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
			{renderQuotes}
			<Pagination nextPage={handleNextPage} prevPage={handlePrevPage} pages={pages} current={currentPage} setCurrent={setCurrentPage} />
		</div>
	);
};

export default App;
