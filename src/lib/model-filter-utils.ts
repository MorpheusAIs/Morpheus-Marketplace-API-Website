/**
 * Model filtering utilities for managing ModelType filtering based on environment configuration
 */

// Default allowed model types if environment variable is not set
const DEFAULT_ALLOWED_TYPES = ['LLM', 'UNKNOWN'];

// Default model fallback if environment variable is not set
const DEFAULT_FALLBACK_MODEL = 'llama-3.3-70b';

/**
 * Get the allowed model types from environment variable
 * @returns Array of allowed ModelType strings
 */
export function getAllowedModelTypes(): string[] {
  const envTypes = process.env.NEXT_PUBLIC_ALLOWED_MODEL_TYPES;
  
  if (!envTypes || envTypes.trim() === '') {
    return DEFAULT_ALLOWED_TYPES;
  }
  
  return envTypes
    .split(',')
    .map(type => type.trim().toUpperCase())
    .filter(type => type.length > 0);
}

/**
 * Get unique model types from a list of models for filter dropdown options
 * @param models Array of models with ModelType field
 * @param allowedTypes Array of allowed model types (optional, uses env config if not provided)
 * @returns Array of unique model types that are allowed
 */
export function getAvailableModelTypes(models: Array<{ModelType?: string}>, allowedTypes?: string[]): string[] {
  const allowed = allowedTypes || getAllowedModelTypes();
  
  const uniqueTypes = new Set<string>();
  
  models.forEach(model => {
    const modelType = model.ModelType?.toUpperCase();
    if (modelType && allowed.includes(modelType)) {
      uniqueTypes.add(modelType);
    }
  });
  
  return Array.from(uniqueTypes).sort();
}

/**
 * Filter models based on allowed types and optional additional filter
 * @param models Array of models to filter
 * @param additionalFilter Optional specific type filter ('all' shows all allowed types)
 * @param allowedTypes Array of allowed model types (optional, uses env config if not provided)
 * @returns Filtered array of models
 */
export function filterModelsByType<T extends {ModelType?: string}>(
  models: T[], 
  additionalFilter: string = 'all',
  allowedTypes?: string[]
): T[] {
  const allowed = allowedTypes || getAllowedModelTypes();
  
  // First filter by allowed types from environment
  let filtered = models.filter(model => {
    const modelType = model.ModelType?.toUpperCase() || 'UNKNOWN';
    return allowed.includes(modelType);
  });
  
  // Apply additional filter if not 'all'
  if (additionalFilter !== 'all') {
    const filterType = additionalFilter.toUpperCase();
    filtered = filtered.filter(model => {
      const modelType = model.ModelType?.toUpperCase() || 'UNKNOWN';
      return modelType === filterType;
    });
  }
  
  return filtered;
}

/**
 * Generate filter dropdown options based on available model types
 * @param models Array of models to analyze
 * @param allowedTypes Array of allowed model types (optional, uses env config if not provided)
 * @returns Array of filter options for dropdown
 */
export function getFilterOptions(models: Array<{ModelType?: string}>, allowedTypes?: string[]): Array<{value: string, label: string}> {
  const allowed = allowedTypes || getAllowedModelTypes();
  const availableTypes = getAvailableModelTypes(models, allowed);
  
  const options = [{ value: 'all', label: 'All' }];
  
  availableTypes.forEach(type => {
    options.push({
      value: type,
      label: type === 'UNKNOWN' ? 'Unknown' : type
    });
  });
  
  return options;
}

/**
 * Get the default model from environment variable
 * @returns Default model ID string
 */
export function getDefaultModel(): string {
  const envModel = process.env.NEXT_PUBLIC_DEFAULT_MODEL;
  
  if (!envModel || envModel.trim() === '') {
    return DEFAULT_FALLBACK_MODEL;
  }
  
  return envModel.trim();
}

/**
 * Select the best default model from a list of available models
 * @param models Array of models to choose from
 * @param preferredDefault Optional preferred default model (uses env config if not provided)
 * @returns Selected model ID or null if no models available
 */
export function selectDefaultModel<T extends {id: string}>(models: T[], preferredDefault?: string): string | null {
  if (models.length === 0) {
    return null;
  }
  
  const defaultModelId = preferredDefault || getDefaultModel();
  
  // Try to find the preferred default model
  const preferredModel = models.find(model => model.id === defaultModelId);
  if (preferredModel) {
    return preferredModel.id;
  }
  
  // Fall back to the first available model
  return models[0].id;
}

/**
 * Get a human-readable description of current filter configuration
 * @param allowedTypes Array of allowed model types (optional, uses env config if not provided)
 * @returns Description string
 */
export function getFilterDescription(allowedTypes?: string[]): string {
  const allowed = allowedTypes || getAllowedModelTypes();
  
  if (allowed.length === 0) {
    return 'No model types are currently allowed';
  }
  
  if (allowed.length === 1) {
    return `Only ${allowed[0]} models are shown`;
  }
  
  const lastType = allowed[allowed.length - 1];
  const otherTypes = allowed.slice(0, -1);
  
  return `Only ${otherTypes.join(', ')} and ${lastType} models are shown`;
}
