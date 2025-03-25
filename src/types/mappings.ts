export type TransformedMappings = Record<string, string>;

export interface IMappingsService {
  getMappings: () => Promise<TransformedMappings>;
}
