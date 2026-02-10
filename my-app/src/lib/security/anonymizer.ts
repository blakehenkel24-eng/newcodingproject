/**
 * Anonymization Service
 * Replaces sensitive entities with placeholders while preserving meaning
 */

import { detectPII, DetectedEntity, EntityType, PIIDetectionResult } from './piiDetector';

export interface AnonymizationConfig {
  enabled: boolean;
  level: 'light' | 'medium' | 'strict';
  preserveContext: boolean; // Keep surrounding context intact
  customReplacements?: Record<string, string>;
  entityTypesToAnonymize?: EntityType[];
}

export interface AnonymizationResult {
  anonymizedText: string;
  originalText: string;
  entitiesReplaced: Array<{
    original: string;
    replacement: string;
    type: EntityType;
  }>;
  entityMapping: Map<string, string>; // For potential de-anonymization
  securityScore: number; // 0-100 (higher is more secure)
}

// Default anonymization placeholders
const DEFAULT_PLACEHOLDERS: Record<EntityType, string | string[]> = {
  company_name: ['[Company Name]', '[Company A]', '[Company B]', '[Company C]', '[Company D]'],
  person_name: ['[Executive]', '[Stakeholder]', '[Contact]', '[Person]'],
  email: '[Email Address]',
  phone: '[Phone Number]',
  revenue: '[Revenue Figure]',
  financial_figure: '[Financial Figure]',
  location: ['[Market]', '[Region]', '[Location]'],
  product_name: '[Product Name]',
  project_code: '[Project Code]',
  date: '[Date]',
  url: '[URL]',
  ip_address: '[IP Address]',
};

// Strict mode placeholders (less context)
const STRICT_PLACEHOLDERS: Record<EntityType, string> = {
  company_name: '[Company]',
  person_name: '[Person]',
  email: '[Redacted]',
  phone: '[Redacted]',
  revenue: '[Amount]',
  financial_figure: '[Amount]',
  location: '[Location]',
  product_name: '[Product]',
  project_code: '[Code]',
  date: '[Date]',
  url: '[Link]',
  ip_address: '[Address]',
};

/**
 * Default configuration
 * Only anonymizes identifiers (names, contact info) - NOT financial figures
 */
export const DEFAULT_ANONYMIZATION_CONFIG: AnonymizationConfig = {
  enabled: true,
  level: 'medium',
  preserveContext: true,
  entityTypesToAnonymize: [
    'company_name',     // e.g., "Acme Corp" → "[Company Name]"
    'person_name',      // e.g., "John Smith" → "[Executive]"
    'email',            // e.g., "john@acme.com" → "[Email Address]"
    'phone',            // e.g., "555-1234" → "[Phone Number]"
  ],
  // Note: Financial figures (revenue, market size, etc.) are intentionally NOT anonymized
  // as they are essential content for strategy consulting slides
};

/**
 * Anonymize text by replacing sensitive entities
 */
export function anonymize(
  text: string,
  config: Partial<AnonymizationConfig> = {}
): AnonymizationResult {
  const fullConfig = { ...DEFAULT_ANONYMIZATION_CONFIG, ...config };
  
  if (!fullConfig.enabled) {
    return {
      anonymizedText: text,
      originalText: text,
      entitiesReplaced: [],
      entityMapping: new Map(),
      securityScore: 0,
    };
  }

  // Detect PII
  const detectionResult = detectPII(text);
  
  // Filter entities based on configuration
  const entitiesToAnonymize = detectionResult.entities.filter(
    entity => !fullConfig.entityTypesToAnonymize || 
              fullConfig.entityTypesToAnonymize.includes(entity.type)
  );

  // Sort entities by position (descending) to replace from end to start
  // This preserves indices for replacements
  const sortedEntities = [...entitiesToAnonymize].sort(
    (a, b) => b.startIndex - a.startIndex
  );

  // Track company name counters for consistent naming (Company A, B, C...)
  const companyCounters: Record<EntityType, number> = {} as Record<EntityType, number>;
  
  // Track entity mappings for potential de-anonymization
  const entityMapping = new Map<string, string>();
  const entitiesReplaced: Array<{ original: string; replacement: string; type: EntityType }> = [];
  
  let anonymizedText = text;
  
  for (const entity of sortedEntities) {
    const placeholder = getPlaceholder(entity.type, entity.value, fullConfig.level, companyCounters);
    
    // Store mapping
    entityMapping.set(placeholder, entity.value);
    entitiesReplaced.push({
      original: entity.value,
      replacement: placeholder,
      type: entity.type,
    });
    
    // Replace in text
    anonymizedText = 
      anonymizedText.substring(0, entity.startIndex) + 
      placeholder + 
      anonymizedText.substring(entity.endIndex);
  }

  // Calculate security score (inverse of risk, with bonus for anonymization)
  const securityScore = calculateSecurityScore(detectionResult, entitiesReplaced.length);

  return {
    anonymizedText,
    originalText: text,
    entitiesReplaced: entitiesReplaced.reverse(), // Back to original order
    entityMapping,
    securityScore,
  };
}

/**
 * Get appropriate placeholder for entity type
 */
function getPlaceholder(
  type: EntityType,
  value: string,
  level: 'light' | 'medium' | 'strict',
  counters: Record<EntityType, number>
): string {
  // Use strict placeholders if strict mode
  if (level === 'strict') {
    return STRICT_PLACEHOLDERS[type];
  }

  // Get placeholder(s) for type
  const placeholders = DEFAULT_PLACEHOLDERS[type];
  
  if (Array.isArray(placeholders)) {
    // For array placeholders, use indexed version (Company A, B, C...)
    const count = counters[type] || 0;
    counters[type] = count + 1;
    return placeholders[count % placeholders.length];
  }
  
  return placeholders;
}

/**
 * Calculate security score after anonymization
 */
function calculateSecurityScore(
  detectionResult: PIIDetectionResult,
  entitiesReplaced: number
): number {
  if (!detectionResult.hasSensitiveData) return 100; // Nothing to anonymize
  
  const totalEntities = detectionResult.entities.length;
  const replacementRatio = entitiesReplaced / totalEntities;
  
  // Base score: inverse of original risk
  const baseScore = 100 - detectionResult.riskScore;
  
  // Bonus for replacing entities
  const replacementBonus = replacementRatio * 30;
  
  return Math.min(100, Math.round(baseScore + replacementBonus));
}

/**
 * Re-anonymize text with consistent mappings
 * Useful for updating text while preserving anonymization
 */
export function reAnonymize(
  text: string,
  previousMapping: Map<string, string>,
  config: Partial<AnonymizationConfig> = {}
): AnonymizationResult {
  // First anonymize normally
  const result = anonymize(text, config);
  
  // Try to apply consistent mappings from previous anonymization
  for (const [placeholder, original] of Array.from(previousMapping.entries())) {
    // If original value appears again, use same placeholder
    const regex = new RegExp(`\\b${escapeRegex(original)}\\b`, 'gi');
    if (regex.test(result.anonymizedText)) {
      result.anonymizedText = result.anonymizedText.replace(regex, placeholder);
    }
  }
  
  return result;
}

/**
 * Escape special regex characters
 */
function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Batch anonymize multiple texts with consistent entity mapping
 */
export function batchAnonymize(
  texts: string[],
  config: Partial<AnonymizationConfig> = {}
): { results: AnonymizationResult[]; globalMapping: Map<string, string> } {
  const results: AnonymizationResult[] = [];
  const globalMapping = new Map<string, string>();
  
  // First pass: collect all entities
  for (const text of texts) {
    const detection = detectPII(text);
    for (const entity of detection.entities) {
      if (!globalMapping.has(entity.value)) {
        const placeholder = getPlaceholder(
          entity.type,
          entity.value,
          config.level || 'medium',
          {} as Record<EntityType, number>
        );
        globalMapping.set(entity.value, placeholder);
      }
    }
  }
  
  // Second pass: apply consistent mappings
  for (const text of texts) {
    let anonymizedText = text;
    const entitiesReplaced: Array<{ original: string; replacement: string; type: EntityType }> = [];
    
    // Apply global mappings
    for (const [original, placeholder] of Array.from(globalMapping.entries())) {
      const regex = new RegExp(`\\b${escapeRegex(original)}\\b`, 'gi');
      const matches = Array.from(text.matchAll(regex));
      
      for (const match of matches) {
        if (match.index !== undefined) {
          entitiesReplaced.push({
            original,
            replacement: placeholder,
            type: detectPII(original).entities[0]?.type || 'company_name',
          });
        }
      }
      
      anonymizedText = anonymizedText.replace(regex, placeholder);
    }
    
    results.push({
      anonymizedText,
      originalText: text,
      entitiesReplaced,
      entityMapping: globalMapping,
      securityScore: calculateSecurityScore(detectPII(text), entitiesReplaced.length),
    });
  }
  
  return { results, globalMapping };
}

/**
 * Create a preview of anonymization without applying it
 * Only shows entities that WILL be anonymized (not financial figures)
 */
export function previewAnonymization(text: string): {
  wouldAnonymize: boolean;
  entitiesFound: DetectedEntity[];
  suggestions: string[];
  estimatedSecurityScore: number;
  preservedEntities: string[]; // Entities detected but NOT anonymized (financial figures)
} {
  const detection = detectPII(text);
  const { getAnonymizationRecommendations } = require('./piiDetector');
  
  // Filter to only show entities that will actually be anonymized
  const anonymizableTypes: EntityType[] = ['company_name', 'person_name', 'email', 'phone'];
  const entitiesToAnonymize = detection.entities.filter(e => anonymizableTypes.includes(e.type));
  const entitiesPreserved = detection.entities.filter(e => !anonymizableTypes.includes(e.type));
  
  return {
    wouldAnonymize: entitiesToAnonymize.length > 0,
    entitiesFound: entitiesToAnonymize,
    suggestions: getAnonymizationRecommendations(detection),
    estimatedSecurityScore: 100 - detection.riskScore,
    preservedEntities: Array.from(new Set(entitiesPreserved.map(e => e.type))),
  };
}

/**
 * Anonymize specific entity types only
 */
export function anonymizeSpecificTypes(
  text: string,
  types: EntityType[],
  level: 'light' | 'medium' | 'strict' = 'medium'
): AnonymizationResult {
  return anonymize(text, {
    enabled: true,
    level,
    entityTypesToAnonymize: types,
  });
}

/**
 * Create a sanitization pipeline for user input
 */
export function createSanitizationPipeline(config?: Partial<AnonymizationConfig>) {
  const fullConfig = { ...DEFAULT_ANONYMIZATION_CONFIG, ...config };
  
  return {
    process: (text: string): AnonymizationResult => {
      // Step 1: Basic text sanitization
      let sanitized = text
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
        .trim();
      
      // Step 2: Anonymize
      const result = anonymize(sanitized, fullConfig);
      
      return result;
    },
    
    config: fullConfig,
  };
}
