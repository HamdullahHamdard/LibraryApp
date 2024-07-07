class ReviewRequestModel{
    rating: number;
    bookId: number;
    rewiewDescription: string;

    constructor(rating: number, bookId: number, reviewDescription: string){
        this.bookId = bookId;
        this.rating = rating;
        this.rewiewDescription = reviewDescription;
    }
}

export default ReviewRequestModel;