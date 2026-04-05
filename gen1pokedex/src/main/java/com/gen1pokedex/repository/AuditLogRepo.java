package com.gen1pokedex.repository;

import com.gen1pokedex.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepo extends JpaRepository<AuditLog, Long> {
    // Find logs where the action text contains the given value, ignoring case
    List<AuditLog> findByActionContainingIgnoreCase(String action);

    // Find all audit logs created by the specified username, ignoring case
    List<AuditLog> findByUsernameIgnoreCase(String username);
}