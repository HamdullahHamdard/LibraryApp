package com.library.libraryapp.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.library.libraryapp.entity.Checkout;
import java.util.List;

public interface CheckoutRepository extends JpaRepository<Checkout, Long> {

    Checkout findByUserEmailAndBookId(String userEmail, Long bookId);
}
