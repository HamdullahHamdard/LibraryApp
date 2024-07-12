package com.library.libraryapp.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.library.libraryapp.entity.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {
}
