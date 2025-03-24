export type TemplateValue = string;
export type ProcessedValue = string | number | boolean | null | object;

// Define a type for the template structure
export type Template =
  | {
      [key: string]: Template | TemplateValue | Template[];
    }
  | TemplateValue
  | Template[];

export function processTemplate(
  template: Template,
  inputData: Record<string, ProcessedValue>
):
  | ProcessedValue
  | Record<string, ProcessedValue>
  | Array<ProcessedValue>
  | undefined {
  // Handle primitive values
  if (typeof template === "string") {
    if (template.startsWith("%")) {
      const key = template.slice(1);
      if (!(key in inputData)) {
        throw new Error(`Missing required field: ${key}`);
      }
      return inputData[key];
    }
    if (template.startsWith("?")) {
      const key = template.slice(1);
      // Return undefined for optional fields that don't exist
      // This will cause the property to be omitted when creating the object
      return key in inputData ? inputData[key] : undefined;
    }
    return template;
  }

  // Handle arrays
  if (Array.isArray(template)) {
    return template.map((item) => processTemplate(item, inputData));
  }

  // Handle objects
  if (typeof template === "object" && template !== null) {
    const result: Record<string, ProcessedValue> = {};

    for (const [key, value] of Object.entries(template)) {
      const processedValue = processTemplate(value, inputData);
      // Only add the property if the value is not undefined
      if (processedValue !== undefined) {
        result[key] = processedValue;
      }
    }

    return result;
  }

  // Return non-string primitives as-is
  return template;
}
