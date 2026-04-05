package com.gen1pokedex.service;

import com.gen1pokedex.entity.AuditLog; // audit log entity for admin tracking
import com.gen1pokedex.repository.AuditLogRepo; // repository to save and query audit entries
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepo auditLogRepository; // persistence access for audit log entries

    // Log an action
    public void log(String username, String action, String entityType, Long entityId, String details,
            String ipAddress) {
        AuditLog log = new AuditLog();
        log.setUsername(username);
        log.setAction(action);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setDetails(details);
        log.setTimestamp(LocalDateTime.now());
        log.setIpAddress(ipAddress);

        auditLogRepository.save(log);
    }

    // Get all audit logs (admin only)
    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAll();
    }

    // Get logs by action
    public List<AuditLog> getLogsByAction(String action) {
        return auditLogRepository.findByActionContainingIgnoreCase(action);
    }

    // Get logs by user
    public List<AuditLog> getLogsByUser(String username) {
        return auditLogRepository.findByUsernameIgnoreCase(username);
    }
}