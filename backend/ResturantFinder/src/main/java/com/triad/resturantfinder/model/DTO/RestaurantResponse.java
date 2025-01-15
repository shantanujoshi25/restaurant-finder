package com.triad.resturantfinder.model.DTO;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class RestaurantResponse {
    private Long id;
    private String name;
    private String address;
    private String email;
    private Long phone;
    private String description;
    private String hours;
    private String priceRange;
    private List<CategoryResponse> categories;
    private String rating;
    private String photoUrl;
}