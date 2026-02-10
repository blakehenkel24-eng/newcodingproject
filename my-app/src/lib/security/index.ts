/**
 * Security Module
 * Data privacy, anonymization, and secure data lifecycle management
 */

// PII Detection
export {
  detectPII,
  containsHighRiskPII,
  getAnonymizationRecommendations,
} from './piiDetector';

export type {
  DetectedEntity,
  EntityType,
  PIIDetectionResult,
} from './piiDetector';

// Anonymization
export {
  anonymize,
  reAnonymize,
  batchAnonymize,
  previewAnonymization,
  anonymizeSpecificTypes,
  createSanitizationPipeline,
  DEFAULT_ANONYMIZATION_CONFIG,
} from './anonymizer';

export type {
  AnonymizationConfig,
  AnonymizationResult,
} from './anonymizer';

// Data Lifecycle
export {
  DataLifecycleManager,
  getDataLifecycleManager,
  withAutoDeletion,
  SECURE_RETENTION_CONFIG,
  DELETION_LOGS_MIGRATION,
} from './dataLifecycle';

export type {
  RetentionPolicy,
  DataRetentionConfig,
  DeletionRecord,
} from './dataLifecycle';
