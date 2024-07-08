import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import { LatestReviews } from "./LatestReviews";
import ReviewModel from "../../models/ReviewModel";
import { useOktaAuth } from "@okta/okta-react";
import { bookSecureUrl } from "../Utils/const";
import ReviewRequestModel from "../../models/ReviewRequestModel";

export const BookCheckoutPage = () => {
  const { authState } = useOktaAuth();
  const [book, setBook] = useState<BookModel>();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  // TODO:: get review of the Book
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [isLoadingReview, setIsLoadingReview] = useState(true);

  // TODO:: Loan State
  const [currentLoanCount, setCurrentLoanCount] = useState(0);
  const [isLoadingCurrentLoanState, setIsLoadingCurrentLoanState] =
    useState(true);

  // TODO:: get the Book ID from URL
  const bookId = window.location.pathname.split("/")[2];

  // Is review left
  const [isReviewLeft, setIsReviewLeft] = useState(false);
  const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

  // TODO:: Is book checkout ?
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [isLoadingBookCheckout, setIsLoadingBookCheckout] = useState(true);

  // fetch reviews books
  useEffect(() => {
    const fetchReviewBooks = async () => {
      const reviewUrl = `http://localhost:8000/api/reviews/search/findByBookId?bookId=${bookId}`;

      const responseReview = await fetch(reviewUrl);

      if (!responseReview.ok) {
        throw new Error("Some thing went worong!");
      }

      const responseJsonReview = await responseReview.json();
      const resposeData = responseJsonReview._embedded.reviews;

      const loadedReviews: ReviewModel[] = [];

      let wightedStarReviews: number = 0;

      for (let key in resposeData) {
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
      if (loadedReviews) {
        const round = (
          Math.round((wightedStarReviews / loadedReviews.length) * 2) / 2
        ).toFixed(1);
        setTotalStars(Number(round));
      }
      setReviews(loadedReviews);
      setIsLoadingReview(false);
    };
    fetchReviewBooks().catch((error: any) => {
      setIsLoadingReview(false);
      setHttpError(error.message);
    });
  }, [isReviewLeft]);

  // Fetch books
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
  }, [isCheckedOut]);

  // Fetch user review books

  useEffect(() => {
    const fetchUserReviewBooks = async () => {
      //
      if (authState && authState.isAuthenticated) {
        const url = `http://localhost:8000/api/reviews/secure/user/book?bookId=${bookId}`;
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };
        const userReview = await fetch(url, requestOptions);
        if (!userReview.ok) {
          throw new Error("Some thing went wrong in fetch user review");
        }
        const userReviewResponseJson = await userReview.json();
        setIsReviewLeft(userReviewResponseJson);
      }
      setIsLoadingUserReview(false);
    };
    fetchUserReviewBooks().catch((error: any) => {
      setIsLoadingUserReview(false);
      setHttpError(error.message);
    });
  });

  // User Current Loan
  useEffect(() => {
    const fetchUserCurrentLoanState = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${bookSecureUrl}/currentloans/count`;
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };
        const currentLoansCountResponse = await fetch(url, requestOptions);
        if (!currentLoansCountResponse.ok) {
          throw new Error("Some thing went wrong!");
        }
        const currentLoansCountResponseJson =
          await currentLoansCountResponse.json();
        setCurrentLoanCount(currentLoansCountResponseJson);
      }
      setIsLoadingCurrentLoanState(false);
    };
    fetchUserCurrentLoanState().catch((error: any) => {
      setIsLoadingCurrentLoanState(false);
      setHttpError(error.message);
    });
  }, [authState, isCheckedOut]);

  // Usre chackout book
  useEffect(() => {
    const fetchUserCheckOutBook = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${bookSecureUrl}/ischeckedout/byuser?bookId=${bookId}`;
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };
        const fetchBookCheckOut = await fetch(url, requestOptions);
        if (!fetchBookCheckOut.ok) {
          throw new Error("Something wrong in book checkout");
        }

        const bookCheckoutJson = await fetchBookCheckOut.json();
        setIsCheckedOut(bookCheckoutJson);
      }
      setIsLoadingBookCheckout(false);
    };
    fetchUserCheckOutBook().catch((error: any) => {
      setIsLoadingBookCheckout(false);
      setHttpError(error.message);
    });
  }, [authState]);

  // some instructions
  if (
    isLoading ||
    isLoadingReview ||
    isLoadingCurrentLoanState ||
    isLoadingBookCheckout ||
    isLoadingUserReview
  ) {
    return <SpinnerLoading />;
  }
  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  async function checkoutBook() {
    const url = `${bookSecureUrl}/checkout?bookId=${bookId}`;
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
    };
    const checkOutResponse = await fetch(url, requestOptions);
    if (!checkOutResponse.ok) {
      throw new Error("Something wrong in book checkout");
    }

    setIsCheckedOut(true);
  }

  async function submitReview (starInput: number, reviewDescription: string){
    let bookIdNumber: number = 0;
    if(book?.id){
      bookIdNumber = book.id;
    }
    const reviewRequestModel = new ReviewRequestModel(starInput, bookIdNumber, reviewDescription);

    const url = 'http://localhost:8000/api/reviews/secure';
    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewRequestModel)
    }
    console.log("before Fetching***********************************************");
    const returnResponse = await fetch(url, requestOptions);

    console.log(JSON.stringify(reviewRequestModel));

    console.log("After Fetching***********************************************");
    console.log(bookIdNumber);
    if(!returnResponse.ok){
      throw new Error('Some thing worong with post rating');
    }
    setIsReviewLeft(true);
    
    console.log("After Fetch       ---***********************************************");



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
              <StarsReview rating={3.5} size={32} />
            </div>
          </div>
          <CheckoutAndReviewBox
            book={book}
            currentLoansCount={currentLoanCount}
            mobile={false}
            checkoutBook={checkoutBook}
            isAuthenticated={authState?.isAuthenticated}
            isCheckOut={isCheckedOut}
            isReviewLeft={isReviewLeft}
            submitReview={submitReview}
          />
        </div>
        <hr />
        <LatestReviews
          bookId={book?.id}
          reviews={reviews}
          mobile={false}
          key={book?.id}
        />
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
            <StarsReview rating={3.5} size={32} />
          </div>
        </div>
        <CheckoutAndReviewBox
          book={book}
          checkoutBook={checkoutBook}
          currentLoansCount={currentLoanCount}
          mobile={true}
          isAuthenticated={authState?.isAuthenticated}
          isCheckOut={isCheckedOut}
          isReviewLeft={isReviewLeft}
          submitReview={submitReview}
        />
        <hr />
        <LatestReviews
          bookId={book?.id}
          reviews={reviews}
          mobile={true}
          key={book?.id}
        />
      </div>
    </div>
  );
};
