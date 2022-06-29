import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Pagination = ({ nextPage, prevPage, pages, current, setCurrent }) => {
	return (
		<div className="pagination">
			<button onClick={prevPage} type="button">
				<FontAwesomeIcon icon={faChevronLeft} size="lg" />
			</button>
			{pages?.map((pageNum) => (
				<button onClick={() => setCurrent(pageNum)} key={pageNum} type="button" className={current === pageNum ? "pagination__active" : ""}>
					{pageNum}
				</button>
			))}
			<button onClick={nextPage} type="button">
				<FontAwesomeIcon icon={faChevronRight} size="lg" />
			</button>
		</div>
	);
};
export default Pagination;
