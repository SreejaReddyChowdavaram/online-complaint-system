/**
 * Mapping of raw category keys to full descriptive names.
 * Consistent with the "Public Services Covered" section on the homepage.
 */
export const categoryMap = {
  supply: "Water Supply",
  pollution: "Noise Pollution",
  electricity: "Electricity Issues",
  road: "Road Maintenance",
  drainage: "Drainage Management",
  garbage: "Garbage Management",
};

/**
 * Extracts a clean category key and maps it to a full descriptive name.
 * Handles both raw values (e.g., "supply") and prefixed values (e.g., "citizen.supply").
 * 
 * @param {string} category - The raw category string from the complaint object.
 * @returns {string} - The full descriptive name or the original string if no mapping exists.
 */
export const getDisplayCategory = (category) => {
  if (!category) return "General";
  
  // Extract clean category key: (e.g., "citizen.supply" -> "supply")
  const rawCategory = category.split(".").pop().toLowerCase();
  
  // Map to full name or fallback to formatted raw category
  return categoryMap[rawCategory] || (rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1));
};
