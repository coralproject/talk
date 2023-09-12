export interface SectionFilter {
  /**
   * name when null or not provided indicates a filter for comments/stories
   * without a section. When name is provided as a string, it indicates a filter
   * for comments/stories with the specified section.
   */
  name?: string | null;
}
