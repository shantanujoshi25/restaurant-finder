package com.triad.resturantfinder.model.DTO;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ErrorResponse {
    private String message;    // Short error message
    private String error;      // Detailed error description
    private int status;        // HTTP status code
    private String timestamp;  // When the error occurred

    public ErrorResponse() {
        this.timestamp = LocalDateTime.now().toString();
    }

    public ErrorResponse(String message, String error, int status) {
        this.message = message;
        this.error = error;
        this.status = status;
        this.timestamp = LocalDateTime.now().toString();
    }

    // Optional: Add a constructor with timestamp if needed
    public ErrorResponse(String message, String error, int status, String timestamp) {
        this.message = message;
        this.error = error;
        this.status = status;
        this.timestamp = timestamp;
    }
}