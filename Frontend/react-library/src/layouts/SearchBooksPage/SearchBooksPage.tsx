

export const SearchBooksPage = () => {
    
    const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  
  useEffect(() => {
    const fetchBooks = async () => {
      const baseUrl: string = "http://localhost:8000/api/books";
      const url: string = `${baseUrl}?page=0&size=9`;

     console.log('fetching 1 ......................');

     const response = await fetch(url);
      console.log("fetched 2 ......................");
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      console.log("fetched 3 ......................");

      const responseJson = await response.json();
      const responseData = responseJson._embedded.books;

      console.log('loading loop ......................');

      const loadedBooks: BookModel[] = [];
      for (const key in responseData) {
        loadedBooks.push({
          id: responseData[key].id,
          title: responseData[key].title,
          author: responseData[key].author,
          description: responseData[key].description,
          copies: responseData[key].copies,
          copiesAvailable: responseData[key].copiesAvailable,
          category: responseData[key].category,
          img: responseData[key].img,
        });
      }
      console.log('loaded books 5 ......................');

      setBooks(loadedBooks);
      setIsLoading(false);
      
      console.log('final 6 ......................');
    };
    fetchBooks().catch((error: any) => {
      setIsLoading(false);

      setHttpError(error.message);
    });
  }, []);

}