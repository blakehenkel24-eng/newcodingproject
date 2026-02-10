/**
 * PII Detection & Entity Extraction Service
 * Identifies sensitive information in user input before processing
 */

export interface DetectedEntity {
  type: EntityType;
  value: string;
  startIndex: number;
  endIndex: number;
  confidence: number; // 0-1
}

export type EntityType =
  | 'company_name'
  | 'person_name'
  | 'email'
  | 'phone'
  | 'revenue'
  | 'financial_figure'
  | 'location'
  | 'product_name'
  | 'project_code'
  | 'date'
  | 'url'
  | 'ip_address';

export interface PIIDetectionResult {
  entities: DetectedEntity[];
  hasSensitiveData: boolean;
  riskScore: number; // 0-100
  entityCounts: Record<EntityType, number>;
}

// Common company name patterns and suffixes
const COMPANY_SUFFIXES = [
  'Corp', 'Corporation', 'Inc', 'Incorporated', 'LLC', 'Ltd', 'Limited',
  'PLC', 'AG', 'GmbH', 'SAS', 'BV', 'NV', 'SpA', 'AB', 'OY', 'AS',
  'Group', 'Holdings', 'Enterprises', 'Solutions', 'Technologies',
  'Partners', 'Associates', 'Consulting', 'Advisory', 'Capital',
  'Ventures', 'Partners', 'LLP', 'LP', 'Co', 'Company'
];

// Revenue/financial patterns
const FINANCIAL_PATTERNS = [
  // Revenue: $340M, $2.1B, €45M
  /\$\s*\d+\.?\d*\s*[BMKbmk]/g,
  /€\s*\d+\.?\d*\s*[BMKbmk]/g,
  /£\s*\d+\.?\d*\s*[BMKbmk]/g,
  // Percentages: 12%, 340%
  /\d+\.?\d*%/g,
  // Large numbers that look like financial figures
  /\b\d{3,}(?:,\d{3})*(?:\.\d+)?\s*(?:million|billion|thousand|M|B|K)\b/gi,
];

// Email pattern
const EMAIL_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

// Phone pattern (various formats)
const PHONE_PATTERN = /\b(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b/g;

// URL pattern
const URL_PATTERN = /https?:\/\/[^\s]+|www\.[^\s]+/g;

// IP address pattern
const IP_PATTERN = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;

// Known major companies (for high-confidence detection)
const KNOWN_COMPANIES = new Set([
  'McKinsey', 'BCG', 'Bain', 'Deloitte', 'KPMG', 'EY', 'PwC',
  'Accenture', 'IBM', 'Microsoft', 'Google', 'Amazon', 'Apple',
  'Meta', 'Tesla', 'Nike', 'Coca-Cola', 'Pepsi', 'Nespresso',
  'Starbucks', 'Nestle', 'Unilever', 'Procter & Gamble', 'P&G',
  'Johnson & Johnson', 'Pfizer', 'Roche', 'Novartis', 'Sanofi',
  'Siemens', 'Bosch', 'Volkswagen', 'BMW', 'Mercedes', 'Audi',
  'Toyota', 'Honda', 'Samsung', 'LG', 'Sony', 'Panasonic',
  'Walmart', 'Target', 'Costco', 'Home Depot', 'Lowe\'s',
  'JPMorgan', 'Goldman Sachs', 'Morgan Stanley', 'Citigroup',
  'Bank of America', 'Wells Fargo', 'Visa', 'Mastercard',
]);

// Known first names for person detection
const COMMON_FIRST_NAMES = new Set([
  'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph',
  'Thomas', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald',
  'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan',
  'Jessica', 'Sarah', 'Karen', 'Nancy', 'Lisa', 'Betty', 'Margaret',
  // Add more as needed
]);

// Common titles that precede names
const TITLES = ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof', 'CEO', 'CFO', 'CTO', 'CMO', 'VP', 'President'];

/**
 * Detect PII and sensitive entities in text
 */
export function detectPII(text: string): PIIDetectionResult {
  const entities: DetectedEntity[] = [];

  // Detect emails
  detectWithPattern(text, EMAIL_PATTERN, 'email', 0.95, entities);

  // Detect phones
  detectWithPattern(text, PHONE_PATTERN, 'phone', 0.9, entities);

  // Detect URLs
  detectWithPattern(text, URL_PATTERN, 'url', 0.9, entities);

  // Detect IP addresses
  detectWithPattern(text, IP_PATTERN, 'ip_address', 0.85, entities);

  // Detect financial figures
  detectFinancialFigures(text, entities);

  // Detect company names
  detectCompanyNames(text, entities);

  // Detect person names
  detectPersonNames(text, entities);

  // Detect locations
  detectLocations(text, entities);

  // Remove overlapping entities (keep higher confidence)
  const filteredEntities = removeOverlappingEntities(entities);

  // Calculate risk score
  const riskScore = calculateRiskScore(filteredEntities);

  // Count entities by type
  const entityCounts = filteredEntities.reduce((acc, entity) => {
    acc[entity.type] = (acc[entity.type] || 0) + 1;
    return acc;
  }, {} as Record<EntityType, number>);

  return {
    entities: filteredEntities,
    hasSensitiveData: filteredEntities.length > 0,
    riskScore,
    entityCounts,
  };
}

/**
 * Helper: Detect entities using regex pattern
 */
function detectWithPattern(
  text: string,
  pattern: RegExp,
  type: EntityType,
  confidence: number,
  entities: DetectedEntity[]
): void {
  const matches = Array.from(text.matchAll(pattern));
  for (const match of matches) {
    if (match.index !== undefined) {
      entities.push({
        type,
        value: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        confidence,
      });
    }
  }
}

/**
 * Detect financial figures (revenue, investment, etc.)
 */
function detectFinancialFigures(text: string, entities: DetectedEntity[]): void {
  for (const pattern of FINANCIAL_PATTERNS) {
    const matches = Array.from(text.matchAll(pattern));
    for (const match of matches) {
      if (match.index !== undefined) {
        const value = match[0];
        // Classify as revenue or general financial figure
        const isRevenue = /revenue|sales|turnover|income/i.test(text.substring(Math.max(0, match.index - 50), match.index));
        
        entities.push({
          type: isRevenue ? 'revenue' : 'financial_figure',
          value,
          startIndex: match.index,
          endIndex: match.index + value.length,
          confidence: 0.85,
        });
      }
    }
  }
}

/**
 * Detect company names using multiple heuristics
 */
function detectCompanyNames(text: string, entities: DetectedEntity[]): void {
  // Pattern 1: Known company names
  for (const company of Array.from(KNOWN_COMPANIES)) {
    const pattern = new RegExp(`\\b${company}\\b`, 'gi');
    const matches = Array.from(text.matchAll(pattern));
    for (const match of matches) {
      if (match.index !== undefined) {
        entities.push({
          type: 'company_name',
          value: match[0],
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          confidence: 0.95,
        });
      }
    }
  }

  // Pattern 2: Company suffix patterns
  const suffixPattern = new RegExp(
    `\\b[A-Z][a-zA-Z&]+(?:\\s+[A-Z][a-zA-Z&]+)*\\s+(?:${COMPANY_SUFFIXES.join('|')})\\b`,
    'g'
  );
  const suffixMatches = Array.from(text.matchAll(suffixPattern));
  for (const match of suffixMatches) {
    if (match.index !== undefined) {
      entities.push({
        type: 'company_name',
        value: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        confidence: 0.8,
      });
    }
  }

  // Pattern 3: Possessive company references (e.g., "Company's CEO")
  const possessivePattern = /\b([A-Z][a-zA-Z]+)'s\s+(?:CEO|revenue|strategy|market)/g;
  const possessiveMatches = Array.from(text.matchAll(possessivePattern));
  for (const match of possessiveMatches) {
    if (match.index !== undefined && match[1]) {
      entities.push({
        type: 'company_name',
        value: match[1],
        startIndex: match.index,
        endIndex: match.index + match[1].length,
        confidence: 0.75,
      });
    }
  }
}

/**
 * Detect person names using heuristics
 */
function detectPersonNames(text: string, entities: DetectedEntity[]): void {
  // Pattern 1: Title + Capitalized Name
  const titlePattern = new RegExp(
    `\\b(?:${TITLES.join('|')})\\s+([A-Z][a-z]+(?:\\s+[A-Z][a-z]+)?)\\b`,
    'g'
  );
  const titleMatches = Array.from(text.matchAll(titlePattern));
  for (const match of titleMatches) {
    if (match.index !== undefined && match[1]) {
      entities.push({
        type: 'person_name',
        value: match[1],
        startIndex: match.index + match[0].indexOf(match[1]),
        endIndex: match.index + match[0].indexOf(match[1]) + match[1].length,
        confidence: 0.85,
      });
    }
  }

  // Pattern 2: Known first names followed by last name
  const firstNamesPattern = new RegExp(
    `\\b(?:${Array.from(COMMON_FIRST_NAMES).join('|')})\\s+([A-Z][a-z]+)\\b`,
    'g'
  );
  const nameMatches = Array.from(text.matchAll(firstNamesPattern));
  for (const match of nameMatches) {
    if (match.index !== undefined) {
      entities.push({
        type: 'person_name',
        value: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        confidence: 0.8,
      });
    }
  }
}

/**
 * Detect geographic locations
 */
function detectLocations(text: string, entities: DetectedEntity[]): void {
  // Common country/region patterns
  const locationPatterns = [
    /\b(?:United States|USA|US|UK|United Kingdom|EU|European Union|China|India|Germany|France|Japan|Canada|Australia)\b/g,
    /\b(?:North America|South America|Europe|Asia|Africa|Australia|Middle East)\b/g,
    /\b(?:New York|London|Paris|Tokyo|Singapore|Hong Kong|Sydney|Dubai|Berlin|Madrid|Rome)\b/g,
  ];

  for (const pattern of locationPatterns) {
    const matches = Array.from(text.matchAll(pattern));
    for (const match of matches) {
      if (match.index !== undefined) {
        entities.push({
          type: 'location',
          value: match[0],
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          confidence: 0.85,
        });
      }
    }
  }
}

/**
 * Remove overlapping entities, keeping higher confidence ones
 */
function removeOverlappingEntities(entities: DetectedEntity[]): DetectedEntity[] {
  // Sort by confidence (descending)
  const sorted = [...entities].sort((a, b) => b.confidence - a.confidence);
  
  const result: DetectedEntity[] = [];
  
  for (const entity of sorted) {
    // Check if this entity overlaps with any already selected
    const overlaps = result.some(
      e =>
        (entity.startIndex >= e.startIndex && entity.startIndex < e.endIndex) ||
        (entity.endIndex > e.startIndex && entity.endIndex <= e.endIndex) ||
        (entity.startIndex <= e.startIndex && entity.endIndex >= e.endIndex)
    );
    
    if (!overlaps) {
      result.push(entity);
    }
  }
  
  // Sort back by position
  return result.sort((a, b) => a.startIndex - b.startIndex);
}

/**
 * Calculate overall risk score based on detected entities
 */
function calculateRiskScore(entities: DetectedEntity[]): number {
  if (entities.length === 0) return 0;
  
  // Weight different entity types by sensitivity
  const weights: Record<EntityType, number> = {
    email: 30,
    phone: 25,
    person_name: 20,
    company_name: 15,
    revenue: 20,
    financial_figure: 15,
    location: 10,
    product_name: 10,
    project_code: 15,
    date: 5,
    url: 10,
    ip_address: 20,
  };
  
  let score = 0;
  for (const entity of entities) {
    score += weights[entity.type] * entity.confidence;
  }
  
  // Cap at 100
  return Math.min(100, Math.round(score));
}

/**
 * Quick check if text contains high-risk PII
 */
export function containsHighRiskPII(text: string): boolean {
  const result = detectPII(text);
  return result.riskScore >= 50;
}

/**
 * Get anonymization recommendations
 * Note: Financial figures are NOT recommended for anonymization as they are
 * essential content for consulting slides
 */
export function getAnonymizationRecommendations(result: PIIDetectionResult): string[] {
  const recommendations: string[] = [];
  
  if (result.entityCounts.company_name > 0) {
    recommendations.push(`Replace ${result.entityCounts.company_name} company name(s) with [Company Name]`);
  }
  
  if (result.entityCounts.email > 0 || result.entityCounts.phone > 0) {
    const count = (result.entityCounts.email || 0) + (result.entityCounts.phone || 0);
    recommendations.push(`Remove ${count} contact information (email/phone) before processing`);
  }
  
  if (result.entityCounts.person_name > 0) {
    recommendations.push(`Anonymize ${result.entityCounts.person_name} person name(s)`);
  }
  
  // Note: Financial figures are intentionally NOT included in recommendations
  // as they are essential content for strategy consulting slides
  
  return recommendations;
}
