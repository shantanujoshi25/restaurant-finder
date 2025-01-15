package com.triad.resturantfinder.controller;

import com.triad.resturantfinder.model.DTO.*;
import com.triad.resturantfinder.service.RestaurantService;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;

    @GetMapping("/{id}")
    public ResponseEntity<RestaurantResponse> getRestaurant(
            @PathVariable @Min(value = 1, message = "ID must be positive") Long id) {
        return ResponseEntity.ok(restaurantService.getRestaurantById(id));
    }

    @GetMapping
    public ResponseEntity<List<RestaurantResponse>> getAllRestaurants(
            @RequestParam(required = false) @Size(max = 100) String name,
            @RequestParam(required = false) List<String> categories,
            @RequestParam(required = false) @Pattern(regexp = "^(LOW|MEDIUM|HIGH)$") String priceRange,
            @RequestParam(required = false) @Pattern(regexp = "^[1-5]$") String rating) {

        return ResponseEntity.ok(restaurantService.searchRestaurants(name, categories, priceRange, rating));
    }


    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN') or hasRole('BUSINESS_OWNER')")
    public ResponseEntity<RestaurantResponse> addRestaurant(@Valid @RequestBody RestaurantRequest request) {
        return new ResponseEntity<>(restaurantService.createRestaurant(request), HttpStatus.CREATED);
    }

    @PutMapping("update/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('BUSINESS_OWNER')")
    public ResponseEntity<RestaurantResponse> updateRestaurant(
            @PathVariable Long id,
            @Valid @RequestBody RestaurantRequest request) {
        return ResponseEntity.ok(restaurantService.updateRestaurant(id, request));
    }

    @GetMapping("/{restaurantId}/reviews")
    public ResponseEntity<List<ReviewResponse>> getRestaurantReviews(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(restaurantService.getRestaurantReviews(restaurantId));
    }

    @PostMapping("/{restaurantId}/reviews")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ReviewResponse> addReview(
            @PathVariable Long restaurantId,
            @Valid @RequestBody ReviewRequest reviewRequest) {
        return new ResponseEntity<>(
                restaurantService.addReview(restaurantId, reviewRequest),
                HttpStatus.CREATED
        );
    }
    @GetMapping("/categories")
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        return ResponseEntity.ok(restaurantService.getAllCategories());
    }
}