package com.triad.resturantfinder.service;

import com.triad.resturantfinder.model.DTO.*;

import java.util.List;

public interface RestaurantService {
    List<RestaurantResponse> searchRestaurants(String name, List<String> categories, String priceRange, String rating);
    RestaurantResponse getRestaurantById(Long id);
    RestaurantResponse createRestaurant(RestaurantRequest request);
    RestaurantResponse updateRestaurant(Long id, RestaurantRequest request);
    List<ReviewResponse> getRestaurantReviews(Long restaurantId);
    ReviewResponse addReview(Long restaurantId, ReviewRequest reviewRequest);
    List<CategoryResponse> getAllCategories();
}