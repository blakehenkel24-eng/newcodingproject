# SlideTheory Data Security Architecture

## Executive Summary

This document outlines SlideTheory's comprehensive data security framework designed to ensure complete data privacy, automatic deletion, and enterprise-grade compliance for strategy consultants.

## Core Security Principles

### 1. Privacy by Design
- **Data Minimization**: Only collect data necessary for slide generation
- **Purpose Limitation**: Data used solely for generating slides, nothing else
- **Short Retention**: Data deleted immediately after processing (configurable: 0-30 minutes)

### 2. Defense in Depth
Multiple layers of protection:
1. **Ingestion Layer**: PII detection and redaction
2. **Processing Layer**: Anonymization before LLM transmission
3. **Storage Layer**: Encrypted at rest, isolated per user
4. **Transmission Layer**: TLS 1.3, certificate pinning
5. **Audit Layer**: Complete activity logging

### 3. Zero Data Retention (ZDR) Compliance
- No data retained by LLM providers (OpenAI/Gemini)
- All processing happens in isolated sessions
- Immediate purging after slide generation

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ Input Form  │→│ PII Scanner │→│ Client-side Encryption  │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ Rate Limit  │→│ Auth Check  │→│ Content Filter          │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    PROCESSING LAYER                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ Entity      │→│ Contextual  │→│ Tokenization            │  │
│  │ Detection   │  │ Redaction   │  │ (Company Names, etc.)   │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      LLM LAYER                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ OpenAI      │  │ Gemini      │  │ Zero Data Retention    │  │
│  │ (Primary)   │  │ (Fallback)  │  │ Policy Enforced        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     STORAGE LAYER (Ephemeral)                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ Slide Cache │→│ Audit Logs  │→│ Auto-Delete Scheduler   │  │
│  │ (5 min TTL) │  │ (30 days)   │  │ (Immediate/Scheduled)   │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation Components

### 1. PII Detection & Entity Extraction

**Purpose**: Identify and catalog sensitive information before processing.

**Entities to Detect**:
- Company names (via NER + custom dictionary)
- Person names
- Email addresses
- Phone numbers
- Financial figures (revenue, investment amounts)
- Geographic locations (offices, facilities)
- Product names
- Project codenames

**Technology**: 
- Regex patterns for standard PII
- Presidio (Microsoft) for NER + PII detection
- Custom trained NER for consulting-specific entities

### 2. Contextual Anonymization

**Purpose**: Replace sensitive identifiers with placeholders while preserving business meaning.

**What Gets Anonymized**:
```javascript
// Company names → [Company Name] or [Company A], [Company B]
"Acme Corp revenue grew 12%" → "[Company Name] revenue grew 12%"

// Person names → [Executive Name] or [Stakeholder]
"CEO John Smith announced..." → "[Executive] announced..."

// Email/Phone → [Contact Information]
"Contact us at support@acme.com" → "Contact us at [Email Address]"
```

**What Does NOT Get Anonymized** (Intentionally Preserved):
```javascript
// Financial figures - ESSENTIAL for slides
"$340M annual revenue" → "$340M annual revenue" ✓
"$2.1B market opportunity" → "$2.1B market opportunity" ✓
"12% growth rate" → "12% growth rate" ✓

// Geographic markets
"Germany and Netherlands expansion" → "Germany and Netherlands expansion" ✓

// Strategic content
"Q3 strategic priorities" → "Q3 strategic priorities" ✓
```

**Rationale**: Financial figures, market sizes, growth rates, and strategic content are the **core value** of consulting slides. Anonymizing these would defeat the purpose of the tool.

**Configuration Options**:
- `enableAnonymization: true/false`
- `anonymizationLevel: 'light' | 'medium' | 'strict'`
- `customEntityMapping: Record<string, string>`

### 3. Zero Data Retention (ZDR) Policy

**LLM Provider Configuration**:
- **OpenAI**: API calls with `store: false` (no training data usage)
- **Gemini**: Enterprise API with ZDR enabled
- **Fallback**: Local LLM for ultra-sensitive content

**Enforcement**:
```typescript
interface LLMRequestConfig {
  model: 'gpt-4o' | 'gemini-2.0-flash' | 'local';
  storeData: false; // Always false
  retentionPolicy: 'zero';
  auditLevel: 'full';
}
```

### 4. Automatic Data Deletion

**Deletion Schedule**:
| Data Type | Retention Period | Trigger |
|-----------|-----------------|---------|
| User Input (text/data) | Immediate (post-generation) | Slide generation complete |
| Generated Slide Content | 5 minutes (cache) | TTL expiration |
| Slide Metadata | 30 days | User deletion request / Auto-cleanup |
| Audit Logs | 90 days | Compliance retention |
| Error Logs | 30 days | Debugging purposes |

**Implementation**:
```typescript
// Automatic cleanup scheduler
class DataLifecycleManager {
  async deleteUserInput(slideId: string): Promise<void> {
    // Immediate deletion after processing
    await this.deleteFromDatabase(slideId, ['context_input', 'message_input', 'data_input']);
    await this.deleteFromCache(slideId);
    await this.wipeFromMemory(slideId);
  }
  
  async scheduleDeletion(dataId: string, delayMs: number): Promise<void> {
    // Scheduled deletion with confirmation
    setTimeout(() => this.permanentDelete(dataId), delayMs);
  }
}
```

### 5. Audit & Compliance Logging

**Logged Events**:
- Data ingestion (anonymized)
- LLM API calls (prompts redacted, metadata logged)
- Data access (who, when, what)
- Data deletion (timestamp, method)
- Security events (failed auth, rate limit exceeded)

**Log Format**:
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "event": "SLIDE_GENERATED",
  "userId": "anon_hash_abc123",
  "slideId": "slide_def456",
  "anonymizationApplied": true,
  "entitiesDetected": ["company_name", "revenue_figure"],
  "retentionExpiry": "2024-01-15T10:35:00Z",
  "llmProvider": "openai",
  "zdrEnabled": true
}
```

---

## Compliance Framework

### SOC 2 Type II Alignment

| Trust Service Criteria | Implementation |
|------------------------|----------------|
| **Security** | Encryption at rest (AES-256) and in transit (TLS 1.3), access controls, penetration testing |
| **Availability** | 99.9% uptime SLA, automated backups, disaster recovery plan |
| **Processing Integrity** | Input validation, data integrity checks, error handling |
| **Confidentiality** | Data anonymization, access logging, NDA with LLM providers |
| **Privacy** | GDPR compliance, data subject rights, privacy by design |

### GDPR Compliance

**Data Subject Rights**:
- **Right to Access**: Users can view their data (anonymized logs)
- **Right to Erasure**: Immediate deletion on request
- **Right to Portability**: Export slides in PPTX format
- **Right to Object**: Opt-out of data processing

**Legal Basis**: Legitimate Interest (Article 6(1)(f))
- Data processing is necessary for the service
- Balanced against user privacy rights
- Minimal data collection

---

## User-Facing Security Features

### 1. Security Dashboard

```
┌─────────────────────────────────────────┐
│         Security Settings               │
├─────────────────────────────────────────┤
│  [✓] Auto-anonymize company names       │
│  [✓] Auto-anonymize revenue figures     │
│  [✓] Enable zero data retention         │
│  [ ] Use local LLM only (slower)        │
│                                         │
│  Data Retention: [Immediate ▼]          │
│  - Immediate (delete after generation)  │
│  - 5 minutes (cache for regeneration)   │
│  - 1 hour                               │
│                                         │
│  [View Audit Log] [Download My Data]    │
└─────────────────────────────────────────┘
```

### 2. Security Badge on Slides

Add a subtle security indicator on generated slides:
```
🔒 Zero Data Retention | Anonymized | Auto-deleted
```

### 3. Pre-flight Security Scan

Before sending to LLM:
```
Scanning your content for sensitive information...

✓ 3 company names detected → Will be anonymized
✓ 2 person names detected → Will be anonymized  
✓ 1 email detected → Will be removed

Preserved (essential content):
• $2.1B market size
• 12% growth rate
• $340M revenue
• Germany, Netherlands markets

Estimated security score: 98/100
[Generate Secure Slide]
```

---

## Implementation Roadmap

### Phase 1: Core Security (Week 1-2)
- [ ] Implement PII detection engine
- [ ] Build anonymization service
- [ ] Add zero data retention flags to LLM calls
- [ ] Create automatic deletion scheduler

### Phase 2: Compliance (Week 3)
- [ ] Audit logging system
- [ ] Security dashboard UI
- [ ] GDPR compliance documentation
- [ ] Privacy policy update

### Phase 3: Enterprise Features (Week 4)
- [ ] Custom entity dictionaries
- [ ] Local LLM fallback
- [ ] SSO integration
- [ ] Security audit certification

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Data leak via LLM training | Low | Critical | ZDR policy, anonymization |
| Unauthorized data access | Low | High | Encryption, access controls, audit logs |
| Data retention beyond policy | Medium | Medium | Automated deletion, monitoring |
| Insider threat | Low | High | Role-based access, audit trails |
| Third-party LLM breach | Low | High | Anonymization, no raw data to LLMs |

---

## Security Certifications Target

1. **SOC 2 Type II** - 6-12 months
2. **ISO 27001** - 12-18 months  
3. **GDPR Compliance** - Immediate
4. **HIPAA BAA** (for healthcare) - Future consideration

---

## Contact

For security inquiries: security@slidetheory.com
Responsible disclosure: security@slidetheory.com
