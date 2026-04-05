package com.gen1pokedex.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice // catches all exceptions globally
public class GlobalExceptionHandler {

    // handle pokemon not found
    @ExceptionHandler(PokemonNotFoundException.class)
    public ResponseEntity<Object> handleNotFound(PokemonNotFoundException ex) {

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now()); // time of error
        body.put("message", ex.getMessage()); // error message
        body.put("status", 404);

        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Object> handleUserNotFound(UserNotFoundException ex) {

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", ex.getMessage());
        body.put("status", 404);

        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    // handle duplicate errors
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<Object> handleDuplicate(DuplicateResourceException ex) {

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", ex.getMessage());
        body.put("status", 409);

        return new ResponseEntity<>(body, HttpStatus.CONFLICT);
    }

    // handle user banned exception with clear message
    @ExceptionHandler(UserBannedException.class)
    public ResponseEntity<Object> handleUserBanned(UserBannedException ex) {
        // Create error response for banned user
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now()); // time of error
        body.put("message", "Your account has been banned. " + ex.getMessage()); // explain why banned
        body.put("status", 403); // 403 Forbidden - access denied
        body.put("error_type", "USER_BANNED"); // error type for frontend handling

        return new ResponseEntity<>(body, HttpStatus.FORBIDDEN);
    }

    // handle user suspended exception with clear message
    @ExceptionHandler(UserSuspendedException.class)
    public ResponseEntity<Object> handleUserSuspended(UserSuspendedException ex) {
        // Create error response for suspended user
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now()); // time of error
        body.put("message", "Your account has been suspended. " + ex.getMessage()); // explain suspension
        body.put("status", 403); // 403 Forbidden - access denied
        body.put("error_type", "USER_SUSPENDED"); // error type for frontend handling

        return new ResponseEntity<>(body, HttpStatus.FORBIDDEN);
    }

    // handle validation errors from illegal arguments
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Object> handleIllegalArgument(IllegalArgumentException ex) {
        // Create error response for validation failures
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now()); // time of error
        body.put("message", "Invalid input: " + ex.getMessage()); // explain what's invalid
        body.put("status", 400); // 400 Bad Request
        body.put("error_type", "VALIDATION_ERROR"); // error type for frontend

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    // handle all other errors
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGeneral(Exception ex) {

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", "Something went wrong. Please try again.");
        body.put("status", 500);
        body.put("error_type", "INTERNAL_SERVER_ERROR"); // error type for frontend

        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}