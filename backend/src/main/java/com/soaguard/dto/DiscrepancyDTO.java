package com.soaguard.dto;

import java.math.BigDecimal;

public class DiscrepancyDTO {
    private String id;
    private String jobId;
    private String recordReference;
    private String fieldName;
    private String fieldGroup;
    private String discrepancyCategory;
    private String databaseValue;
    private String soaValue;
    private BigDecimal varianceAmount;
    private BigDecimal variancePercent;
    private String currency;
    private String ruleCode;
    private String ruleDescription;
    private String severity;
    private String deterministicResult;
    private String reviewer1Result;
    private String reviewer2Result;
    private String consensusResult;
    private Boolean humanReviewRequired;
    private String humanReviewStatus;
    private String humanReviewer;
    private String humanReviewNotes;
    private String finalDecision;
    private String aiExplanation;

    public DiscrepancyDTO() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getJobId() { return jobId; }
    public void setJobId(String jobId) { this.jobId = jobId; }
    public String getRecordReference() { return recordReference; }
    public void setRecordReference(String recordReference) { this.recordReference = recordReference; }
    public String getFieldName() { return fieldName; }
    public void setFieldName(String fieldName) { this.fieldName = fieldName; }
    public String getFieldGroup() { return fieldGroup; }
    public void setFieldGroup(String fieldGroup) { this.fieldGroup = fieldGroup; }
    public String getDiscrepancyCategory() { return discrepancyCategory; }
    public void setDiscrepancyCategory(String discrepancyCategory) { this.discrepancyCategory = discrepancyCategory; }
    public String getDatabaseValue() { return databaseValue; }
    public void setDatabaseValue(String databaseValue) { this.databaseValue = databaseValue; }
    public String getSoaValue() { return soaValue; }
    public void setSoaValue(String soaValue) { this.soaValue = soaValue; }
    public BigDecimal getVarianceAmount() { return varianceAmount; }
    public void setVarianceAmount(BigDecimal varianceAmount) { this.varianceAmount = varianceAmount; }
    public BigDecimal getVariancePercent() { return variancePercent; }
    public void setVariancePercent(BigDecimal variancePercent) { this.variancePercent = variancePercent; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getRuleCode() { return ruleCode; }
    public void setRuleCode(String ruleCode) { this.ruleCode = ruleCode; }
    public String getRuleDescription() { return ruleDescription; }
    public void setRuleDescription(String ruleDescription) { this.ruleDescription = ruleDescription; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    public String getDeterministicResult() { return deterministicResult; }
    public void setDeterministicResult(String deterministicResult) { this.deterministicResult = deterministicResult; }
    public String getReviewer1Result() { return reviewer1Result; }
    public void setReviewer1Result(String reviewer1Result) { this.reviewer1Result = reviewer1Result; }
    public String getReviewer2Result() { return reviewer2Result; }
    public void setReviewer2Result(String reviewer2Result) { this.reviewer2Result = reviewer2Result; }
    public String getConsensusResult() { return consensusResult; }
    public void setConsensusResult(String consensusResult) { this.consensusResult = consensusResult; }
    public Boolean getHumanReviewRequired() { return humanReviewRequired; }
    public void setHumanReviewRequired(Boolean humanReviewRequired) { this.humanReviewRequired = humanReviewRequired; }
    public String getHumanReviewStatus() { return humanReviewStatus; }
    public void setHumanReviewStatus(String humanReviewStatus) { this.humanReviewStatus = humanReviewStatus; }
    public String getHumanReviewer() { return humanReviewer; }
    public void setHumanReviewer(String humanReviewer) { this.humanReviewer = humanReviewer; }
    public String getHumanReviewNotes() { return humanReviewNotes; }
    public void setHumanReviewNotes(String humanReviewNotes) { this.humanReviewNotes = humanReviewNotes; }
    public String getFinalDecision() { return finalDecision; }
    public void setFinalDecision(String finalDecision) { this.finalDecision = finalDecision; }
    public String getAiExplanation() { return aiExplanation; }
    public void setAiExplanation(String aiExplanation) { this.aiExplanation = aiExplanation; }
}
