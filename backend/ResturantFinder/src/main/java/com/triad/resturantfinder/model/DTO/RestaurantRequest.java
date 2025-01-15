package com.triad.resturantfinder.model.DTO;

import lombok.Data;
import javax.validation.constraints.*;
import java.util.List;

@Data
public class RestaurantRequest {
    @NotBlank(message = "Restaurant name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Address is required")
    @Size(max = 200, message = "Address cannot exceed 200 characters")
    private String address;

    @Email(message = "Please provide a valid email address")
    private String email;

    @Pattern(regexp = "^\\d{10}$", message = "Phone number must be 10 digits")
    private Long phone;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @NotNull(message = "Operating hours are required")
    private String hours;

    @NotNull(message = "Price range is required")
    @Pattern(regexp = "^(LOW|MEDIUM|HIGH)$", message = "Price range must be LOW, MEDIUM, or HIGH")
    private String priceRange;

    @NotEmpty(message = "At least one category must be selected")
    private List<Long> categoryIds;
}
