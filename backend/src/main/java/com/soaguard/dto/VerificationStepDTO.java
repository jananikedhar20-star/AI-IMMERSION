package com.soaguard.dto;

public class VerificationStepDTO {
    private String id;
    private Integer stepNumber;
    private String stageName;
    private String status;
    private String details;
    private Long durationMs;
    private String timestamp;

    public VerificationStepDTO() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Integer getStepNumber() { return stepNumber; }
    public void setStepNumber(Integer stepNumber) { this.stepNumber = stepNumber; }
    public String getStageName() { return stageName; }
    public void setStageName(String stageName) { this.stageName = stageName; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    public Long getDurationMs() { return durationMs; }
    public void setDurationMs(Long durationMs) { this.durationMs = durationMs; }
    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}
