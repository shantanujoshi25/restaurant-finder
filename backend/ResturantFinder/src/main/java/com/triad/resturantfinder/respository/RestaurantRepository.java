package com.triad.resturantfinder.respository;

import com.triad.resturantfinder.model.DAO.PriceRange;
import com.triad.resturantfinder.model.DAO.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    @Query("SELECT DISTINCT r FROM Restaurant r " +
            "LEFT JOIN r.categories c " +
            "WHERE (:name IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "AND (:categories IS NULL OR (SELECT COUNT(DISTINCT c2) FROM r.categories c2 WHERE LOWER(c2.name) IN (:categories)) = (SELECT COUNT(DISTINCT c3) FROM Category c3 WHERE LOWER(c3.name) IN (:categories))) " +
            "AND (:priceRange IS NULL OR r.priceRange = :priceRange) " +
            "AND (:rating IS NULL OR CAST(r.rating AS double) >= :rating)")
    List<Restaurant> findBySearchCriteria(
            @Param("name") String name,
            @Param("categories") List<String> categories,
            @Param("priceRange") PriceRange priceRange,
            @Param("rating") String rating
    );
}