class HistoryModel{
    id: number;
    checkoutDate: string;
    returnedData: string;
    title: string;
    author: string;
    description: string;
    img: string;

    constructor(id: number, checkoutDate: string, returnedDate: string, title: string, author: string, description:string, img: string){
        this.id = id;
        this.checkoutDate = checkoutDate;
        this.returnedData = returnedDate;
        this.title = title;
        this.author = author;
        this.description = description;
        this.img = img;
    }
}


export default HistoryModel;