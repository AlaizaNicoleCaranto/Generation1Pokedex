package com.gen1pokedex.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_badges")
public class UserBadge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // primary key for earned badge records

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // trainer who earned this badge

    @ManyToOne
    @JoinColumn(name = "badge_id")
    private Badge badge; // badge definition earned by the user

    private LocalDateTime earnedDate; // when the badge was earned

    // Getters and setters
    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Badge getBadge() {
        return badge;
    }

    public void setBadge(Badge badge) {
        this.badge = badge;
    }

    public LocalDateTime getEarnedDate() {
        return earnedDate;
    }

    public void setEarnedDate(LocalDateTime earnedDate) {
        this.earnedDate = earnedDate;
    }
}