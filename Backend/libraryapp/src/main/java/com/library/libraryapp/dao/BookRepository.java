package com.library.libraryapp.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.library.libraryapp.entity.Book;

public interface BookRepository extends JpaRepository<Book, Long> {

}
