import React from "react";

/**
 * Reusable dropdown component for selecting AI language and tone
 *
 * Props:
 * - language: current selected language
 * - tone: current selected tone
 * - setLanguage: setter function for language
 * - setTone: setter function for tone
 */
export function LanguageToneSelector({ language, tone, setLanguage, setTone }) {
  return (
    <div className="flex flex-wrap gap-4 items-end mb-3">
      {/* Language Dropdown */}
      <div>
        <label className="block text-xs mb-1 text-gray-600">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="text-sm border rounded px-2 py-1 bg-white dark:bg-black border-gray-300 dark:border-gray-600"
        >
          <option value="English">English</option>
          <option value="Uzbek">Uzbek</option>
          <option value="Russian">Russian</option>
        </select>
      </div>

      {/* Tone Dropdown */}
      <div>
        <label className="block text-xs mb-1 text-gray-600">Tone</label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="text-sm border rounded px-2 py-1 bg-white dark:bg-black border-gray-300 dark:border-gray-600"
        >
          <option value="professional">Professional</option>
          <option value="formal">Formal</option>
          <option value="friendly">Friendly</option>
          <option value="concise">Concise</option>
        </select>
      </div>
    </div>
  );
}
