// Preferred order for main attributes (excluding sex, tag_sponsor, etc)
export const ORDERED_ATTRIBUTE_KEYS = [
  'total_length_m',
  'date_tagged',
  'location_tagged',
  // Add more keys as needed
];

/**
 * Returns attributes in the preferred order, omitting null/undefined.
 * @param {object} attributes - The attributes object from config
 * @returns {Array<{key, label, value}>}
 */
export function getOrderedAttributes(attributes) {
  if (!attributes) return [];
  return ORDERED_ATTRIBUTE_KEYS
    .map((key) => ({
      key,
      label: getAttributeLabel(key),
      value: formatAttributeValue(key, attributes[key]),
    }))
    .filter(attr => attr.value !== null && attr.value !== undefined);
}
import DOMPurify from 'dompurify';

export const ATTRIBUTE_DEFS = {
  sex: {
    label: 'Sex',
    format: (value) => value,
  },
  total_length_m: {
    label: 'Total Length',
    format: (value) => (value != null ? `${value} m` : null),
  },
  age_years: {
    label: 'Age',
    format: (value) => (value != null ? `${value} years` : null),
  },
  location_tagged: {
    label: 'Location Tagged',
    format: (value) => value,
  },
  date_tagged: {
    label: 'Date Tagged',
    format: (value) => {
      if (!value) return null;
      const parsed = new Date(value);
      if (Number.isNaN(parsed.getTime())) return value;

      return parsed.toLocaleDateString('en-NZ', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    },
  },
  tag_sponsor: {
    label: 'Tag Sponsor',
    format: (value) => value,
  },
};

function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value)
  );
}

export function getAttributeLabel(key) {
  if (ATTRIBUTE_DEFS[key]?.label) {
    return ATTRIBUTE_DEFS[key].label;
  }

  return key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatAttributeValue(key, value) {
  if (value == null || value === '') return null;

  const formatter = ATTRIBUTE_DEFS[key]?.format;
  const formatted = formatter ? formatter(value) : String(value);

  if (formatted == null || formatted === '') return null;

  if (typeof formatted === 'string') {
    return DOMPurify.sanitize(formatted, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });
  }

  return formatted;
}

export function validateSubjectConfig(subjectConfig) {
  if (!isPlainObject(subjectConfig)) {
    return null;
  }

  const normalized = { ...subjectConfig };

  if (normalized.attributes !== undefined && !isPlainObject(normalized.attributes)) {
    console.warn('Invalid attributes format: expected object');
    normalized.attributes = {};
  }

  if (
    normalized.featured_attributes !== undefined &&
    !Array.isArray(normalized.featured_attributes)
  ) {
    console.warn('Invalid featured_attributes: expected array');
    normalized.featured_attributes = [];
  }

  if (Array.isArray(normalized.featured_attributes)) {
    const filtered = normalized.featured_attributes.filter(
      (entry) => typeof entry === 'string' && entry.trim().length > 0,
    );

    if (filtered.length !== normalized.featured_attributes.length) {
      console.warn('Some featured_attributes entries were invalid');
    }

    normalized.featured_attributes = filtered;
  }

  return normalized;
}

export function getFormattedAttributes(subjectConfig, featuredOnly = false) {
  const validated = validateSubjectConfig(subjectConfig);
  if (!validated?.attributes) return [];

  const attributes = validated.attributes;
  let keys = Object.keys(attributes);

  if (featuredOnly && Array.isArray(validated.featured_attributes)) {
    keys = validated.featured_attributes.filter((key) => key in attributes);
  }

  return keys
    .map((key) => {
      const value = formatAttributeValue(key, attributes[key]);
      if (value === null) return null;

      return {
        key,
        label: getAttributeLabel(key),
        value,
      };
    })
    .filter(Boolean);
}
