package com.triad.resturantfinder.service;

import com.triad.resturantfinder.Mappers.RestaurantMapper;
import com.triad.resturantfinder.Mappers.ReviewMapper;
import com.triad.resturantfinder.helper.ResourceNotFoundException;
import com.triad.resturantfinder.model.DAO.PriceRange;
import com.triad.resturantfinder.model.DTO.*;
import com.triad.resturantfinder.model.DAO.Restaurant;
import com.triad.resturantfinder.model.DAO.Review;
import com.triad.resturantfinder.respository.CategoryRepository;
import com.triad.resturantfinder.respository.RestaurantRepository;
import com.triad.resturantfinder.respository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Scanner;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RestaurantServiceImpl implements RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final ReviewRepository reviewRepository;
    private final RestaurantMapper restaurantMapper;
    private final ReviewMapper reviewMapper;
    private final CategoryRepository categoryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<RestaurantResponse> searchRestaurants(String name, List<String> categories, String priceRangeStr, String rating) {
        // Normalize empty strings to null
        String normalizedName = StringUtils.isEmpty(name) ? null : name.trim();
        List<String> normalizedCategories = normalizeCategories(categories);
        PriceRange normalizedPriceRange = normalizePriceRange(priceRangeStr);
        String normalizedRating = StringUtils.isEmpty(rating) ? null : rating.trim();

        List<Restaurant> searchResults = restaurantRepository.findBySearchCriteria(
                normalizedName,
                normalizedCategories,
                normalizedPriceRange,
                normalizedRating
        );

        // If no results found with search criteria and search was attempted
        if (searchResults.isEmpty() && (normalizedName != null || !CollectionUtils.isEmpty(normalizedCategories) ||
                normalizedPriceRange != null || normalizedRating != null)) {
            // Return all restaurants
            searchResults = restaurantRepository.findAll();
        }

        return searchResults.stream()
                .map(restaurantMapper::toResponse)
                .collect(Collectors.toList());
    }

    private List<String> normalizeCategories(List<String> categories) {
        if (CollectionUtils.isEmpty(categories)) {
            return null;
        }
        return categories.stream()
                .filter(category -> !StringUtils.isEmpty(category))
                .map(String::trim)
                .map(String::toLowerCase)
                .collect(Collectors.toList());
    }

    private PriceRange normalizePriceRange(String priceRangeStr) {
        if (!StringUtils.isEmpty(priceRangeStr)) {
            try {
                return PriceRange.valueOf(priceRangeStr.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                return null;
            }
        }
        return null;
    }
    @Override
    @Transactional(readOnly = true)
    public RestaurantResponse getRestaurantById(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
        return restaurantMapper.toResponse(restaurant);
    }

    @Override
    public RestaurantResponse createRestaurant(RestaurantRequest request) {
        Restaurant restaurant = restaurantMapper.toEntity(request);
        restaurant = restaurantRepository.save(restaurant);
        return restaurantMapper.toResponse(restaurant);
    }

    @Override
    public RestaurantResponse updateRestaurant(Long id, RestaurantRequest request) {
        Restaurant existingRestaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));

        restaurantMapper.updateRestaurantFromRequest(request, existingRestaurant);
        existingRestaurant = restaurantRepository.save(existingRestaurant);
        return restaurantMapper.toResponse(existingRestaurant);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getRestaurantReviews(Long restaurantId) {
        return reviewRepository.findByRestaurantId(restaurantId)
                .stream()
                .map(reviewMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ReviewResponse addReview(Long restaurantId, ReviewRequest reviewRequest) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + restaurantId));

        Review review = reviewMapper.toEntity(reviewRequest);
        review.setRestaurant(restaurant);
        review = reviewRepository.save(review);

        updateRestaurantRating(restaurant);

        return reviewMapper.toResponse(review);
    }

    private void updateRestaurantRating(Restaurant restaurant) {
        Double avgRating = reviewRepository.calculateAverageRating(restaurant.getId());
        restaurant.setRating(avgRating != null ? avgRating.toString() : "0.0");
        restaurantRepository.save(restaurant);
    }
    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {

        return categoryRepository.findAll().stream()
                .map(category -> {
                    CategoryResponse response = new CategoryResponse();
                    response.setId(category.getId());
                    response.setName(category.getName());
                    return response;
                })
                .collect(Collectors.toList());
    }
}
