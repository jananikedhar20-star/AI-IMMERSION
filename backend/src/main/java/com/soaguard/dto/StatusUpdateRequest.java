package com.soaguard.dto;

public class StatusUpdateRequest {
    private String status; // ACCEPTED, QUERY_RAISED, DISMISSED, PENDING
    private String reviewer;
    private String notes;

    public StatusUpdateRequest() {}
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getReviewer() { return reviewer; }
    public void setReviewer(String reviewer) { this.reviewer = reviewer; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
