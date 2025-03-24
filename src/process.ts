/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ProcessObject {
  name: string;
  description: string;
  inputs: string[];
  type: string;
  endpoint: string;
  vendor: {
    targetHttp: string;
    targetUriTxt: string;
    data: Record<string, any>;
  };
}

// Utility that parses vendor.data and replaces placeholders
export function buildVendorData(
  process: ProcessObject["vendor"],
  requestBody: Record<string, any>
): Record<string, any> {
  const { data } = process;
  const finalPayload: Record<string, any> = {};

  for (const key of Object.keys(data)) {
    const templateValue = data[key];

    // If not a string, just copy over (in case you have something static)
    if (typeof templateValue !== "string") {
      finalPayload[key] = templateValue;
      continue;
    }

    // If it's a string, check for % or ?
    if (templateValue.startsWith("%")) {
      // Mandatory field
      const fieldName = templateValue.substring(1); // remove the '%'
      if (!(fieldName in requestBody)) {
        throw new Error(`Missing mandatory field: ${fieldName}`);
      }
      finalPayload[key] = requestBody[fieldName];
    } else if (templateValue.startsWith("?")) {
      // Optional field
      const fieldName = templateValue.substring(1); // remove the '?'
      if (fieldName in requestBody) {
        // If the user sent the optional property, include it
        finalPayload[key] = requestBody[fieldName];
      }
      // If the user didn't send it, omit the key entirely (or decide if you want null, etc.)
    } else {
      // No placeholder recognized, treat as a literal string
      finalPayload[key] = templateValue;
    }
  }

  return finalPayload;
}

export type TemplateValue = string;
export type ProcessedValue = string | number | boolean | null | object;

export function processTemplate(
  template: any,
  inputData: Record<string, ProcessedValue>
): any {
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
    const result: Record<string, any> = {};

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
