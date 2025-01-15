package com.triad.resturantfinder.Mappers;

import com.triad.resturantfinder.model.DAO.Restaurant;
import com.triad.resturantfinder.model.DAO.Category;
import com.triad.resturantfinder.model.DAO.PriceRange;
import com.triad.resturantfinder.model.DTO.CategoryResponse;
import com.triad.resturantfinder.model.DTO.RestaurantRequest;
import com.triad.resturantfinder.model.DTO.RestaurantResponse;
import com.triad.resturantfinder.respository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.Optional;
import java.util.stream.Collectors;


@Component
@RequiredArgsConstructor
public class RestaurantMapper {
    private final CategoryRepository categoryRepository;

    public Restaurant toEntity(RestaurantRequest request) {
        Restaurant restaurant = new Restaurant();
        updateRestaurantFromRequest(request, restaurant);
        return restaurant;
    }

    public void updateRestaurantFromRequest(RestaurantRequest request, Restaurant restaurant) {
        restaurant.setName(request.getName());
        restaurant.setAddress(request.getAddress());
        restaurant.setEmail(request.getEmail());
        restaurant.setPhone(request.getPhone());
        restaurant.setDescription(request.getDescription());
        restaurant.setHours(request.getHours());
        restaurant.setPriceRange(PriceRange.valueOf(request.getPriceRange()));
        restaurant.setCategories(request.getCategoryIds().stream()
                .map(categoryRepository::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList()));
    }

    public RestaurantResponse toResponse(Restaurant restaurant) {
        RestaurantResponse response = new RestaurantResponse();
        response.setId(restaurant.getId());
        response.setName(restaurant.getName());
        response.setAddress(restaurant.getAddress());
        response.setEmail(restaurant.getEmail());
        response.setPhone(restaurant.getPhone());
        response.setDescription(restaurant.getDescription());
        response.setHours(restaurant.getHours());
        response.setPriceRange(restaurant.getPriceRange().name());
        response.setRating(restaurant.getRating());
        response.setPhotoUrl(restaurant.getPhotoUrl());
        response.setCategories(restaurant.getCategories().stream()
                .map(this::categoryToResponse)
                .collect(Collectors.toList()));
        return response;
    }

    private CategoryResponse categoryToResponse(Category category) {
        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        return response;
    }
}
