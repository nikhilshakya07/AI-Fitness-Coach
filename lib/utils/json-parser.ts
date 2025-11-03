/**
 * Utility to safely parse JSON responses from AI
 * Handles cases where AI might add extra text around JSON or truncate responses
 */
export function parseAIResponse<T>(response: string, fallback: T): T {
  if (!response || response.trim().length === 0) {
    console.warn("Empty response received, using fallback");
    return fallback;
  }

  try {
    // Clean the response first - remove common issues
    let cleaned = response.trim();
    
    // Remove markdown code blocks if present
    cleaned = cleaned.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    
    // Remove any text before first { and after last }
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    
    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      throw new Error("No valid JSON boundaries found");
    }

    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    
    // Fix missing quotes around property names FIRST (before other fixes)
    // Pattern: find unquoted property names before colons (but not inside strings)
    cleaned = cleaned.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)/g, '$1"$2"$3');
    
    // Fix incomplete/truncated JSON by closing incomplete structures
    cleaned = fixTruncatedJSON(cleaned);
    
    // Fix common JSON issues
    cleaned = cleaned.replace(/:\s*null\s*([,}])/g, ': 0$1');
    // Remove trailing commas multiple times
    for (let i = 0; i < 5; i++) {
      cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');
    }
    
    // Try direct parsing
    const parsed = JSON.parse(cleaned) as T;
    return cleanParsedData(parsed) as T;
  } catch (error) {
    console.error("Initial JSON parsing failed, trying recovery...");
    
    try {
      // Try recovery: find the best JSON substring we can parse
      let jsonStr = response.trim();
      
      // Remove markdown code blocks
      jsonStr = jsonStr.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      
      // Find JSON boundaries
      const firstBrace = jsonStr.indexOf("{");
      const lastBrace = jsonStr.lastIndexOf("}");
      
      if (firstBrace === -1 || lastBrace === -1) {
        throw new Error("No JSON boundaries found");
      }
      
      jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
      
      // Fix truncated strings - look for unclosed quotes at the end
      // Pattern: find strings that end abruptly (no closing quote before comma/brace)
      jsonStr = jsonStr.replace(/("(?:[^"\\]|\\.)*":\s*")([^"]*?)(\s*)([,}\]]|$)/g, (match, key, value, ws, ending) => {
        // If we're at the end and there's no closing quote, close it
        if ((ending === '' || ending === ',' || ending === '}' || ending === ']') && !value.includes('"')) {
          // Check if this looks like an incomplete string (ends with text but no quote)
          const lastChar = value.length > 0 ? value[value.length - 1] : '';
          if (value.length > 0 && lastChar !== '"' && !value.endsWith('\\"')) {
            return key + value.trim() + '"' + ending;
          }
        }
        return match;
      });
      
      // Fix incomplete numeric values (key with colon but no number)
      jsonStr = jsonStr.replace(/("(?:calories|protein|carbs|fats|reps|sets|restTime|duration|weight|totalCalories)":\s*)(\s*)([,}\]])/g, '$10$3');
      
      // Fix incomplete property values (ending with colon but no value)
      jsonStr = jsonStr.replace(/("(?:[^"\\]|\\.)*":\s*)(\s*)([,}\]])/g, (match, key, ws, ending) => {
        if (key.includes('calories') || key.includes('protein') || key.includes('carbs') || key.includes('fats') || 
            key.includes('reps') || key.includes('sets') || key.includes('restTime') || key.includes('duration')) {
          return key.trim() + ' 0' + ending;
        }
        return key.trim() + ' ""' + ending;
      });
      
      // Remove incomplete objects at the end - look for patterns like: ,"key":
      jsonStr = jsonStr.replace(/,\s*"[^"]*":\s*([,}\]]|$)/g, (match, ending) => {
        return ending === '' ? '' : ending;
      });
      
      // Balance braces
      const openBraces = (jsonStr.match(/\{/g) || []).length;
      const closeBraces = (jsonStr.match(/\}/g) || []).length;
      if (closeBraces < openBraces) {
        // Remove any incomplete objects at the end before closing
        const lastOpenBrace = jsonStr.lastIndexOf('{');
        if (lastOpenBrace >= 0) {
          const afterBrace = jsonStr.substring(lastOpenBrace);
          const bracesInSub = (afterBrace.match(/\{/g) || []).length - (afterBrace.match(/\}/g) || []).length;
          if (bracesInSub > 0) {
            // There's an incomplete object - try to remove incomplete properties
            jsonStr = jsonStr.replace(/(\{[^}]*)(,\s*"[^"]*":\s*[^,}]*?)$/, '$1');
          }
        }
        jsonStr += "}".repeat(openBraces - closeBraces);
      }
      
      // Balance brackets
      const openBrackets = (jsonStr.match(/\[/g) || []).length;
      const closeBrackets = (jsonStr.match(/\]/g) || []).length;
      if (closeBrackets < openBrackets) {
        jsonStr += "]".repeat(openBrackets - closeBrackets);
      }
      
      // Fix missing quotes around property names (e.g., calories: instead of "calories":)
      // Pattern: find unquoted property names before colons
      jsonStr = jsonStr.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)/g, '$1"$2"$3');
      
      // Fix nulls and trailing commas
      jsonStr = jsonStr.replace(/:\s*null\s*([,}])/g, ': 0$1');
      for (let i = 0; i < 10; i++) {
        jsonStr = jsonStr.replace(/,(\s*[}\]])/g, '$1');
      }
      
      const parsed = JSON.parse(jsonStr) as T;
      console.log("Recovery parsing succeeded");
      return cleanParsedData(parsed) as T;
    } catch (recoveryError) {
      console.error("JSON parsing error after recovery:", recoveryError);
      console.error("Response length:", response.length);
      console.error("Response preview:", response.substring(0, 500));
      console.error("Response end:", response.substring(Math.max(0, response.length - 200)));
      
      // Last resort: try to extract partial valid JSON by removing incomplete entries
      try {
        const partialMatch = response.match(/\{[\s\S]*/);
        if (partialMatch) {
          let partial = partialMatch[0];
          
          // Fix missing quotes around property names FIRST
          partial = partial.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)/g, '$1"$2"$3');
          
          // Remove incomplete exercises/meals from arrays
          partial = partial.replace(/(\{[^}]*"reps":\s*)([^0-9,}]*)([,\]}])/g, '$10$3');
          partial = partial.replace(/(\{[^}]*"sets":\s*)([^0-9,}]*)([,\]}])/g, '$10$3');
          partial = partial.replace(/(\{[^}]*"calories":\s*)([^0-9,}]*)([,\]}])/g, '$10$3');
          
          // Close all open structures
          const openBr = (partial.match(/\{/g) || []).length;
          const closeBr = (partial.match(/\}/g) || []).length;
          const openBk = (partial.match(/\[/g) || []).length;
          const closeBk = (partial.match(/\]/g) || []).length;
          partial += "]".repeat(Math.max(0, openBk - closeBk));
          partial += "}".repeat(Math.max(0, openBr - closeBr));
          
          // Final cleanup
          partial = partial.replace(/,(\s*[}\]])/g, '$1');
          partial = partial.replace(/:\s*null\s*([,}])/g, ': 0$1');
          
          const lastResort = JSON.parse(partial) as T;
          console.log("Last resort parsing succeeded");
          return cleanParsedData(lastResort) as T;
        }
      } catch (lastError) {
        console.error("Last resort parsing also failed");
      }
      
      return fallback;
    }
  }
}

/**
 * Fix truncated JSON by closing incomplete structures
 */
function fixTruncatedJSON(jsonStr: string): string {
  let fixed = jsonStr;
  
  // First, fix truncated strings that are cut off mid-word
  // Look for pattern: "key": "value that ends abruptly without closing quote
  fixed = fixed.replace(/("(?:[^"\\]|\\.)*":\s*")([^"]*?)(\s*)([,}\]]|$)/g, (match, key, value, ws, ending) => {
    // If ending is not a quote and value doesn't end with quote or escaped quote
    if ((ending === ',' || ending === '}' || ending === ']' || ending === '') && 
        value.length > 0 && 
        !value.endsWith('"') && 
        !value.endsWith('\\"')) {
      // This string looks incomplete - close it
      return key + value.trim() + '"' + (ending || '');
    }
    return match;
  });
  
  // Fix incomplete numeric values (e.g., "calories": with no number)
  fixed = fixed.replace(/("(?:calories|protein|carbs|fats|reps|sets|restTime|duration|weight|totalCalories)":\s*)(\s*)([,}\n]|$)/g, (match, key, ws, ending) => {
    if (ws.trim() === '' || ending === ',' || ending === '}' || ending === '') {
      return key + '0' + (ending || '');
    }
    return match;
  });
  
  // Fix incomplete property values (ending with colon but no value)
  fixed = fixed.replace(/("(?:[^"\\]|\\.)*":\s*)(\s*)([,}\]])/g, (match, key, ws, ending) => {
    if (key.includes('calories') || key.includes('protein') || key.includes('carbs') || key.includes('fats') || 
        key.includes('reps') || key.includes('sets') || key.includes('restTime') || key.includes('duration')) {
      return key.trim() + ' 0' + ending;
    }
    return key.trim() + ' ""' + ending;
  });
  
  // Remove incomplete properties at the very end
  // Pattern: ,"key": or ,"key": value (without proper closing)
  fixed = fixed.replace(/,\s*"[^"]*":\s*([,}\]]|$)/g, (match, ending) => {
    // If it's an incomplete property, remove it
    if (ending === '' || ending === ',' || ending === '}') {
      return ending === '' ? '' : ending;
    }
    return match;
  });
  
  // Count braces and brackets to balance them
  const openBraces = (fixed.match(/\{/g) || []).length;
  const closeBraces = (fixed.match(/\}/g) || []).length;
  const openBrackets = (fixed.match(/\[/g) || []).length;
  const closeBrackets = (fixed.match(/\]/g) || []).length;
  
  // Fix incomplete arrays
  if (closeBrackets < openBrackets) {
    // Remove incomplete array items at the end
    fixed = fixed.replace(/(\[[\s\S]*?)(,\s*\{[^}]*$)/, '$1');
    fixed += "]".repeat(openBrackets - closeBrackets);
  }
  
  // Balance braces
  if (closeBraces < openBraces) {
    // Before adding closing braces, remove incomplete objects/properties at the end
    const lastOpenBrace = fixed.lastIndexOf('{');
    if (lastOpenBrace >= 0) {
      const afterBrace = fixed.substring(lastOpenBrace);
      const bracesInSub = (afterBrace.match(/\{/g) || []).length - (afterBrace.match(/\}/g) || []).length;
      if (bracesInSub > 0) {
        // Remove incomplete properties from the last object
        fixed = fixed.replace(/(\{[^}]*)(,\s*"[^"]*":\s*[^,}]*?)$/, '$1');
      }
    }
    fixed += "}".repeat(openBraces - closeBraces);
  }
  
  // Remove trailing commas multiple times
  for (let i = 0; i < 10; i++) {
    fixed = fixed.replace(/,(\s*[}\]])/g, '$1');
  }
  
  // Final cleanup - fix any remaining incomplete values
  fixed = fixed.replace(/:\s*([,}])/g, ': 0$1');
  
  return fixed;
}

/**
 * Clean parsed data - remove null values, ensure arrays exist, fix types
 */
function cleanParsedData<T>(data: any): T {
  if (Array.isArray(data)) {
    return data.filter(item => item !== null && item !== undefined) as T;
  }
  
  if (data && typeof data === "object") {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (value === null || value === undefined) {
        // Skip null values for optional fields
        if (key === "dailyRoutines" || key === "dailyMeals" || key === "mealOptions") {
          cleaned[key] = key === "mealOptions" 
            ? { breakfast: [], lunch: [], dinner: [], snacks: [] }
            : [];
        } else if (key === "lifestyleTips" || key === "postureTips" || key === "motivationalQuotes") {
          cleaned[key] = [];
        } else if (key === "dailyTargets") {
          cleaned[key] = { totalCalories: 0 };
        } else {
          continue;
        }
      } else if (Array.isArray(value)) {
        cleaned[key] = value.filter(item => item !== null && item !== undefined);
      } else if (typeof value === "object") {
        cleaned[key] = cleanParsedData(value);
      } else {
        cleaned[key] = value;
      }
    }
    return cleaned as T;
  }
  
  return data as T;
}

/**
 * Validate that a parsed response matches expected structure
 */
export function validatePlanStructure<T extends object>(
  data: unknown,
  requiredKeys: string[]
): data is T {
  if (!data || typeof data !== "object") {
    return false;
  }

  const obj = data as Record<string, unknown>;
  return requiredKeys.every((key) => key in obj);
}

