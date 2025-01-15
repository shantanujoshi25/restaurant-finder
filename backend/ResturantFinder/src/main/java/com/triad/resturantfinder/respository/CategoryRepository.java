package com.triad.resturantfinder.respository;

import com.triad.resturantfinder.model.DAO.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

}
