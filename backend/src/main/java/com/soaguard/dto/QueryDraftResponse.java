package com.soaguard.dto;

public class QueryDraftResponse {
    private String subject;
    private String greeting;
    private String bodyText;
    private String itemizedTableMarkdown;
    private String closingText;
    private String fullDraft;

    public QueryDraftResponse() {}

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getGreeting() { return greeting; }
    public void setGreeting(String greeting) { this.greeting = greeting; }
    public String getBodyText() { return bodyText; }
    public void setBodyText(String bodyText) { this.bodyText = bodyText; }
    public String getItemizedTableMarkdown() { return itemizedTableMarkdown; }
    public void setItemizedTableMarkdown(String itemizedTableMarkdown) { this.itemizedTableMarkdown = itemizedTableMarkdown; }
    public String getClosingText() { return closingText; }
    public void setClosingText(String closingText) { this.closingText = closingText; }
    public String getFullDraft() { return fullDraft; }
    public void setFullDraft(String fullDraft) { this.fullDraft = fullDraft; }
}
