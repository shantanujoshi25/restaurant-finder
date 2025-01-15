package com.triad.resturantfinder.model.DTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;
    private String username;
    private String role;
    private String message;
}