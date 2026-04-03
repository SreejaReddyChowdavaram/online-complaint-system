/**
 * complaintHelpers.js - Shared UI logic for complaints
 */

export const getTranslatedCategory = (category, t) => {
  if (!category) return "N/A";
  
  // Normalize mapping for i18n keys
  const categoryKeyMap = {
    "road": "Roads",
    "water": "Water",
    "electricity": "Electricity",
    "sanitation": "Garbage",
    "garbage": "Garbage",
    "health": "Drainage",
    "noise": "Noise",
    "other": "Noise"
  };

  const normalizedLower = category.toLowerCase().replace("complaints.categories.", "");
  const key = categoryKeyMap[normalizedLower] || Object.keys(categoryKeyMap).find(k => normalizedLower.includes(k)) || normalizedLower;
  
  const translated = t(`complaints.categories.${key}`);
  const finalLabel = (!translated || translated === `complaints.categories.${key}`) 
    ? normalizedLower.split(/[.\s]/).pop().replace(/([A-Z])/g, ' $1').trim()
    : translated;

  // Extract only the final category name (e.g., "Noise & Pollution" -> "Noise")
  return finalLabel.split(" ")[0].split("&")[0].trim();
};

export const getCategoryStyles = (category) => {
  const normalized = category?.toLowerCase() || "";
  if (normalized.includes("noise") || normalized.includes("sound")) {
    return "bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/30";
  }
  if (normalized.includes("water") || normalized.includes("drainage")) {
    return "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30";
  }
  if (normalized.includes("road") || normalized.includes("traffic")) {
    return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700";
  }
  if (normalized.includes("electricity") || normalized.includes("power")) {
    return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800/30";
  }
  return "bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700";
};
