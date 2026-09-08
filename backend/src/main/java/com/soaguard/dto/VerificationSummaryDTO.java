package com.soaguard.dto;

import java.math.BigDecimal;

public class VerificationSummaryDTO {
    private String jobId;
    private String jobCode;
    private String status;
    private Integer totalRecords;
    private Integer matchedCount;
    private Integer mismatchedCount;
    private Integer missingCount;
    private Integer extraCount;
    private Integer duplicateCount;
    private Integer humanReviewCount;
    private BigDecimal totalDisputedAmount;
    private String currency;
    private String summaryNotes;

    public VerificationSummaryDTO() {}

    public String getJobId() { return jobId; }
    public void setJobId(String jobId) { this.jobId = jobId; }
    public String getJobCode() { return jobCode; }
    public void setJobCode(String jobCode) { this.jobCode = jobCode; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getTotalRecords() { return totalRecords; }
    public void setTotalRecords(Integer totalRecords) { this.totalRecords = totalRecords; }
    public Integer getMatchedCount() { return matchedCount; }
    public void setMatchedCount(Integer matchedCount) { this.matchedCount = matchedCount; }
    public Integer getMismatchedCount() { return mismatchedCount; }
    public void setMismatchedCount(Integer mismatchedCount) { this.mismatchedCount = mismatchedCount; }
    public Integer getMissingCount() { return missingCount; }
    public void setMissingCount(Integer missingCount) { this.missingCount = missingCount; }
    public Integer getExtraCount() { return extraCount; }
    public void setExtraCount(Integer extraCount) { this.extraCount = extraCount; }
    public Integer getDuplicateCount() { return duplicateCount; }
    public void setDuplicateCount(Integer duplicateCount) { this.duplicateCount = duplicateCount; }
    public Integer getHumanReviewCount() { return humanReviewCount; }
    public void setHumanReviewCount(Integer humanReviewCount) { this.humanReviewCount = humanReviewCount; }
    public BigDecimal getTotalDisputedAmount() { return totalDisputedAmount; }
    public void setTotalDisputedAmount(BigDecimal totalDisputedAmount) { this.totalDisputedAmount = totalDisputedAmount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getSummaryNotes() { return summaryNotes; }
    public void setSummaryNotes(String summaryNotes) { this.summaryNotes = summaryNotes; }
}
