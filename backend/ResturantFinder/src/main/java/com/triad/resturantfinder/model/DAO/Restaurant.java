package com.triad.resturantfinder.model.DAO;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;
@Data
@Entity
@NoArgsConstructor
@Table(name = "restaurants")
public class Restaurant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "restaurant_id")  // If your DB column is named restaurant_id
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    private String email;
    private Long phone;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "open_hours")  // If your DB column is named open_hours
    private String hours;  // Changed from Map to String if that's how it's stored in DB

    @Enumerated(EnumType.STRING)
    @Column(name = "price_range")
    private PriceRange priceRange;

    private String rating;

    @Column(name = "photo_url")
    private String photoUrl;

    @ManyToMany
    @JoinTable(
            name = "restaurant_categories",
            joinColumns = @JoinColumn(name = "restaurant_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private List<Category> categories;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL)
    private List<Review> reviews;
}