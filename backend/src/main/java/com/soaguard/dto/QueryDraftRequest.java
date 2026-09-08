package com.soaguard.dto;

public class QueryDraftRequest {
    private String agentName;
    private String tone; // formal, urgent, concise

    public QueryDraftRequest() {}
    public String getAgentName() { return agentName; }
    public void setAgentName(String agentName) { this.agentName = agentName; }
    public String getTone() { return tone; }
    public void setTone(String tone) { this.tone = tone; }
}
