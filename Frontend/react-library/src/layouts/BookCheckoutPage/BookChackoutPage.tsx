import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from '../Utils/StarsReview';
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import { LatestReviews } from "./LatestReviews";
import ReviewModel from "../../models/ReviewModel";

export const BookCheckoutPage = () => {
  const [book, setBook] = useState<BookModel>();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  // TODO:: get review of the Book
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [isLoadingReview, setIsLoadingReview] = useState(true);


  useEffect(()=>{
    const fetchReviewBooks = async () => {
        const reviewUrl = `http://localhost:8000/api/reviews/search/findByBookId?bookId=${bookId}`;
        
        const responseReview = await fetch(reviewUrl);

        if(!responseReview.ok){
            throw new Error('Some thing went worong!');
        }

        const responseJsonReview = await responseReview.json();
        const resposeData = responseJsonReview._embedded.reviews;

        const loadedReviews: ReviewModel[] = [];

        let wightedStarReviews: number = 0;

        for(let key in resposeData){
            loadedReviews.push({
                id: resposeData[key].id,
                userEmail: resposeData[key].userEmail,
                date: resposeData[key].date,
                rating: resposeData[key].rating,
                book_id: resposeData[key].bookId,
                reviewDescription: resposeData[key].reviewDescription,

            });
            wightedStarReviews = wightedStarReviews + resposeData[key].rating;
        }
        if(loadedReviews){
            const round = (Math.round((wightedStarReviews / loadedReviews.length) * 2) / 2).toFixed(1);
            setTotalStars(Number(round));
        }
        setReviews(loadedReviews);
        setIsLoadingReview(false);
    }
    fetchReviewBooks().catch((error: any)=> {
        setIsLoadingReview(false);
        setHttpError(error.message);
    })
  }, []);

  // TODO:: get the Book ID from URL
  const bookId = window.location.pathname.split("/")[2];

  useEffect(() => {
    const fetchBooks = async () => {
      const baseUrl: string = `http://localhost:8000/api/books/${bookId}`;

      const response = await fetch(baseUrl);
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const responseJson = await response.json();

      const loadedBook: BookModel = {
        id: responseJson.id,
        title: responseJson.title,
        author: responseJson.author,
        description: responseJson.description,
        copies: responseJson.copies,
        copiesAvailable: responseJson.copiesAvailable,
        category: responseJson.category,
        img: responseJson.img,
      };

      setBook(loadedBook);
      setIsLoading(false);
    };
    fetchBooks().catch((error: any) => {
      setIsLoading(false);

      setHttpError(error.message);
    });
  }, []);

  // some instructions
  if (isLoading || isLoadingReview) {
    return <SpinnerLoading />;
  }
  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError} Error</p>
      </div>
    );
  }

  return (
    <div>
      <div className="container d-none d-lg-block">
        <div className="row mt-5">
          <div className="col-sm-2 col-md-2">
            {book?.img ? (
              <img src={book?.img} width="226" height="349" alt="Book" />
            ) : (
              <img
                src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
                width="226"
                height="349"
                alt="Book"
              />
            )}
          </div>
          <div className="col-4 col-md-4 container">
            <div className="ml-2">
              <h1>{book?.title}</h1>
              <h5 className="text-primary">{book?.author}</h5>
              <p className="lead">{book?.description}</p>
              <StarsReview rating={3.5} size={32}/>
            </div>
          </div>
          <CheckoutAndReviewBox book={book} mobile={false}/>
        </div>
        <hr />
        <LatestReviews bookId={book?.id} reviews={reviews} mobile={false} key={book?.id}/>
      </div>
      <div className="container d-lg-none mt-5">
        <div className="d-flex justify-content-center align-items-center">
          {book?.img ? (
            <img src={book?.img} width="226" height="349" alt="Book" />
          ) : (
            <img
              src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
              width="226"
              height="349"
              alt="Book"
            />
          )}
        </div>
        <div className="mt-4">
          <div className="ml-2">
            <h2>{book?.title}</h2>
            <h5 className="text-primary">{book?.author}</h5>
            <p className="lead">{book?.description}</p>
            <StarsReview rating={3.5} size={32}/>
          </div>
        </div>
        <CheckoutAndReviewBox book={book} mobile={true}/>
        <hr />
        <LatestReviews bookId={book?.id} reviews={reviews} mobile={true} key={book?.id}/>
      </div>
    </div>
  );
};
