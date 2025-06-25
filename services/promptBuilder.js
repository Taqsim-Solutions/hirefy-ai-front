// src/services/promptBuilder.js

// Default tone and language options
const defaultOptions = {
    language: "English",
    tone: "professional",
  };
  
  /**
   * Formats the base prompt with tone/language instructions
   * @param {string} text - core prompt body
   * @param {object} options - { language, tone }
   * @returns {string}
   */
  function formatPromptContext(text, options = {}) {
    const { language, tone } = { ...defaultOptions, ...options };
  
    return `
  ${text}
  
  Respond in ${language}.
  Use a ${tone} tone.
  Output only the result. No explanations or formatting instructions.
  `.trim();
  }
  
  /**
   * Builds prompt for experience bullet points
   */
  export function buildExperiencePrompt(title = "Software Engineer", options = {}) {
    return formatPromptContext(
      `
  Write 5-7 bullet points for resume experience as a ${title}.
  - Use HTML: <ul><li>...</li></ul>
  - Avoid dates, junior/senior level, or company names.
  - Focus on technologies, results, and impact.
  `.trim(), options
    );
  }
  
  /**
   * Builds prompt for resume summary
   */
  export function buildSummaryPrompt(title = "Software Engineer", options = {}) {
    return formatPromptContext(
      `
  Write a concise 2–3 sentence resume summary for a ${title}.
  Avoid using "I", personal opinions, or years of experience.
  Focus on outcomes, key strengths, and value.
  `.trim(), options
    );
  }
  
  /**
   * Builds prompt for listing skills
   */
  export function buildSkillsPrompt(title = "Software Engineer", options = {}) {
    return formatPromptContext(
      `
  List 8 highly relevant skills for a ${title} applying to a modern company.
  - Use <ul><li>Skill</li></ul> format.
  - Include a mix of technical and soft skills.
  `.trim(), options
    );
  }
  
  /**
   * Builds prompt for education section
   */
  export function buildEducationPrompt(
    degree = "BSc",
    field = "Computer Science",
    university = "MIT",
    options = {}
  ) {
    return formatPromptContext(
      `
  Write 2–3 bullet points for this education entry:
  - Degree: ${degree} in ${field}
  - University: ${university}
  - Include coursework, honors, GPA (optional), or achievements.
  - Use HTML: <ul><li>...</li></ul>
  `.trim(), options
    );
  }
  