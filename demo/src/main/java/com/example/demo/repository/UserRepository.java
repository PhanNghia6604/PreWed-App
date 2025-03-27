package com.example.demo.repository;

import com.example.demo.entity.Expert;
import com.example.demo.entity.User;
import com.example.demo.enums.RoleEnum;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    User findUserById(long id);

    List<User> findUsersByIsDeletedFalse();
    Optional<User> findByUsername(String username);
    List<User> findAllByRoleEnum(RoleEnum roleEnum);

}
