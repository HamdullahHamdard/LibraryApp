import { useEffect, useState } from "react";
import ReviewModel from "../../../models/ReviewModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Review } from "../../Utils/Review";
import { Pagination } from "../../Utils/Pagination";

export const ReviewListPage = () => {
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(5);
  const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const bookId = window.location.pathname.split("/")[2];

  useEffect(() => {
    const fetchReviewBooks = async () => {
      const reviewUrl = `http://localhost:8000/api/reviews/search/findByBookId?bookId=${bookId}&page=${
        currentPage - 1
      }&size=${reviewsPerPage}`;

      const responseReview = await fetch(reviewUrl);

      if (!responseReview.ok) {
        throw new Error("Some thing went worong!");
      }

      const responseJsonReview = await responseReview.json();
      const resposeData = responseJsonReview._embedded.reviews;

      setTotalAmountOfReviews(responseJsonReview.page.totalElements);
      setTotalPages(responseJsonReview.page.totalPages);

      const loadedReviews: ReviewModel[] = [];

      for (let key in resposeData) {
        loadedReviews.push({
          id: resposeData[key].id,
          userEmail: resposeData[key].userEmail,
          date: resposeData[key].date,
          rating: resposeData[key].rating,
          book_id: resposeData[key].bookId,
          reviewDescription: resposeData[key].reviewDescription,
        });
      }

      setReviews(loadedReviews);
      setIsLoading(false);
    };
    fetchReviewBooks().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, [currentPage]);

  if (isLoading) {
    return <SpinnerLoading />;
  }
  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }
  const indexOfLastReview: number = currentPage * reviewsPerPage;
  const indexOfFirstReview: number = indexOfLastReview - reviewsPerPage;
  let lastItem = reviewsPerPage * currentPage <= totalAmountOfReviews ? reviewsPerPage * currentPage : totalAmountOfReviews;
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container m-5">
        <div>
            <h3>Comments: ({reviews.length})</h3>
        </div>
        <p>
            {indexOfFirstReview + 1 } to {lastItem} of {totalAmountOfReviews} items: 
        </p>
        <div className="row">
            {reviews.map(review => ( <Review review={review} key={review.id}/> ))}
        </div>
        {
            totalPages > 1 && <Pagination currentPage={currentPage} paginate={paginate} totalPages={totalPages}/>
        }
    </div>
  );
};
