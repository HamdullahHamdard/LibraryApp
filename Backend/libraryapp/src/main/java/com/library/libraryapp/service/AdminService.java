package com.library.libraryapp.service;

import org.springframework.beans.factory.annotation.Autowired;

import com.library.libraryapp.dao.BookRepository;
import com.library.libraryapp.entity.Book;
import com.library.libraryapp.requestmodels.AddBookRequest;

public class AdminService {
    private BookRepository bookRepository;

    @Autowired
    public AdminService(BookRepository bookRepository){
        this.bookRepository = bookRepository;
    }

    public void postBook (AddBookRequest addBookRequest) {
        Book book = new Book();
        book.setTitle(addBookRequest.getTitle());
        book.setAuthor(addBookRequest.getAuthor());
        book.setDescription(addBookRequest.getDescription());
        book.setCopies(addBookRequest.getCopies());
        book.setCopiesAvailable(addBookRequest.getCopies());
        book.setCategory(addBookRequest.getCategory());
        book.setImg(addBookRequest.getImg());

        bookRepository.save(book);
    }
}
