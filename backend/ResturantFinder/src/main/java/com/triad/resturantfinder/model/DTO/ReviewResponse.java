package com.triad.resturantfinder.model.DTO;

import lombok.Data;

@Data
public class ReviewResponse {
    private Long id;
    private Long restaurantId;
    private Integer rating;
    private String comment;
    private String createdAt;
}