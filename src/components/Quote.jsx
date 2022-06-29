import { faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo } from "react";

const Quote = ({ id, content, author, upVotes, downVotes, handleUpVote, handleDownVote, givenVote }) => {
	const votePercent = useMemo(() => {
		return Math.round((100 * upVotes) / (upVotes + downVotes));
	}, [upVotes, downVotes]);

	const percentClassname = `quote__voting__percent ${
		votePercent <= 20
			? "red"
			: votePercent > 20 && votePercent <= 40
			? "orange"
			: votePercent > 40 && votePercent <= 60
			? "yellow"
			: votePercent > 60 && votePercent <= 80
			? "yellowgreen"
			: votePercent > 80
			? "green"
			: null
	}`;

	return (
		<div className="quote__card">
			<div className="quote__voting">
				<button type="button" onClick={() => handleUpVote(id)}>
					<FontAwesomeIcon icon={faSortUp} size="lg" color={givenVote === "upvote" ? "#fff" : "#787a91"} />
				</button>
				<p className={percentClassname}>{votePercent}%</p>
				<p className="quote__voting__total">{`${upVotes}/${downVotes}`}</p>
				<button onClick={() => handleDownVote(id)}>
					<FontAwesomeIcon icon={faSortDown} size="lg" color={givenVote === "downvote" ? "#fff" : "#787a91"} />
				</button>
			</div>
			<div className="quote__content">
				<p className="quote__content__text">{content}</p>
				<p className="quote__content__author">- {author}</p>
			</div>
		</div>
	);
};
export default Quote;
