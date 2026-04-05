package com.gen1pokedex.controller;

import com.gen1pokedex.entity.AuditLog;
import com.gen1pokedex.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Controller exposing admin audit log endpoints for tracking admin actions and changes
@RestController
@RequestMapping("/api/admin/audit-logs")
public class AdminAuditController {

    // Service for retrieving audit logs of admin actions
    @Autowired
    private AuditLogService auditLogService;

    // Retrieve all audit logs
    @GetMapping
    public List<AuditLog> getAllLogs() {
        return auditLogService.getAllLogs();
    }

    // Retrieve audit logs filtered by action type
    @GetMapping("/action/{action}")
    public List<AuditLog> getByAction(@PathVariable String action) {
        return auditLogService.getLogsByAction(action);
    }

    // Retrieve audit logs for a specific user
    @GetMapping("/user/{username}")
    public List<AuditLog> getByUser(@PathVariable String username) {
        return auditLogService.getLogsByUser(username);
    }
}