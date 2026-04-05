package com.gen1pokedex.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "user_daily_challenges")
public class UserDailyChallenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // primary key for user daily challenge records

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // trainer participating in the challenge

    @ManyToOne
    @JoinColumn(name = "daily_challenge_id")
    private DailyChallenge dailyChallenge; // linked daily challenge

    private boolean completed; // whether the challenge was completed
    private LocalDate completionDate; // date the challenge was completed
    private int streakCount; // consecutive daily challenge streak count

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public DailyChallenge getDailyChallenge() {
        return dailyChallenge;
    }

    public void setDailyChallenge(DailyChallenge dailyChallenge) {
        this.dailyChallenge = dailyChallenge;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public LocalDate getCompletionDate() {
        return completionDate;
    }

    public void setCompletionDate(LocalDate completionDate) {
        this.completionDate = completionDate;
    }

    public int getStreakCount() {
        return streakCount;
    }

    public void setStreakCount(int streakCount) {
        this.streakCount = streakCount;
    }
}