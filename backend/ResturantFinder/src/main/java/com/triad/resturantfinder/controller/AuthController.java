package com.triad.resturantfinder.controller;

import com.triad.resturantfinder.helper.JwtUtil;
import com.triad.resturantfinder.model.DAO.User;
import com.triad.resturantfinder.model.DTO.AuthResponse;
import com.triad.resturantfinder.model.DTO.LoginRequest;
import com.triad.resturantfinder.model.DTO.RegisterRequest;
import com.triad.resturantfinder.model.DTO.ErrorResponse;
import com.triad.resturantfinder.respository.UserRepository;


import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserDetailsService authService;

    public AuthController(AuthenticationManager authenticationManager,
                          UserDetailsService userDetailsService,
                          JwtUtil jwtUtil,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          UserDetailsService authService) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtUtil.generateToken(userDetails);

            AuthResponse response = AuthResponse.builder()
                    .token(token)
                    .username(userDetails.getUsername())
                    .role(userDetails.getAuthorities().iterator().next().getAuthority())
                    .message("Login successful")
                    .build();

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse(
                            "Invalid username or password",
                            "The provided credentials are incorrect. Please check your username and password.",
                            401));
        } catch (LockedException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse(
                            "Account locked",
                            "Your account has been locked. Please contact support.",
                            401));
        } catch (DisabledException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse(
                            "Account disabled",
                            "Your account has been disabled. Please contact support.",
                            401));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse(
                            "Login failed",
                            "An unexpected error occurred during login. Please try again later.",
                            500));
        }
    }


    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            // Check if username exists
            if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body(new ErrorResponse(
                                "Registration failed",
                                "Username is already taken. Please choose a different username.",
                                409));
            }

            // Check if email exists
            if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body(new ErrorResponse(
                                "Registration failed",
                                "Email is already registered. Please use a different email address.",
                                409));
            }

            // Validate password strength
            if (!isPasswordValid(registerRequest.getPassword())) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(new ErrorResponse(
                                "Invalid password",
                                "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
                                400));
            }

            // Create new user
            User user = User.builder()
                    .username(registerRequest.getUsername())
                    .password(passwordEncoder.encode(registerRequest.getPassword()))
                    .email(registerRequest.getEmail())
                    .role("ROLE_USER")
                    .enabled(true)
                    .build();

            User savedUser = userRepository.save(user);

            // Generate token for automatic login after registration
            UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getUsername());
            String token = jwtUtil.generateToken(userDetails);

            AuthResponse response = AuthResponse.builder()
                    .token(token)
                    .username(savedUser.getUsername())
                    .role(savedUser.getRole())
                    .message("Registration successful")
                    .build();

            return ResponseEntity.ok(response);

        } catch (DataIntegrityViolationException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(new ErrorResponse(
                            "Registration failed",
                            "A database constraint was violated. Please check your input.",
                            409));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse(
                            "Registration failed",
                            "An unexpected error occurred during registration. Please try again later.",
                            500));
        }
    }
    private boolean isPasswordValid(String password) {
        // Password must be at least 8 characters long and contain:
        // - at least one uppercase letter
        // - at least one lowercase letter
        // - at least one number
        // - at least one special character
        String pattern = "^(?=.*[0-6])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$";
        return password.matches(pattern);
    }


    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Invalid authorization header", "Token validation failed", 401));
            }

            String token = authHeader.substring(7);
            String username = jwtUtil.extractUsername(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtUtil.validateToken(token, userDetails)) {
                AuthResponse response = AuthResponse.builder()
                        .token(token)
                        .username(username)
                        .role(userDetails.getAuthorities().iterator().next().getAuthority())
                        .message("Token is valid")
                        .build();

                return ResponseEntity.ok(response);
            }

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Invalid token", "Token validation failed", 401));

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Token validation failed", e.getMessage(), 401));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        try {
            // Add token to blacklist or invalidate session if needed
            // For stateless JWT, client just needs to remove the token

            return ResponseEntity.ok(Map.of("message", "Logged out successfully"));

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Logout failed", e.getMessage(), 500));
        }
    }
}