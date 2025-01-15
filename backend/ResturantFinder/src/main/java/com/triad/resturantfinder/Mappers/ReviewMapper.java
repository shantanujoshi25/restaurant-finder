package com.triad.resturantfinder.Mappers;

import com.triad.resturantfinder.model.DAO.Review;
import com.triad.resturantfinder.model.DTO.ReviewRequest;
import com.triad.resturantfinder.model.DTO.ReviewResponse;
import org.springframework.stereotype.Component;
import java.time.format.DateTimeFormatter;

@Component
public class ReviewMapper {
    private static final DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;

    public Review toEntity(ReviewRequest request) {
        Review review = new Review();
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        return review;
    }

    public ReviewResponse toResponse(Review review) {
        ReviewResponse response = new ReviewResponse();
        response.setId(review.getId());
        response.setRestaurantId(review.getRestaurant().getId());
        response.setRating(review.getRating());
        response.setComment(review.getComment());
        response.setCreatedAt(review.getCreatedAt().format(formatter));
        return response;
    }
}
