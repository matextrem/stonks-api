export const parseValue = (value?: string | null, property = 'name') => {
  if (!value) {
    return 'Unknown';
  }
  const match = value.match(/(.*) \((.*)\)/);
  if (!match) {
    return value;
  }
  if (property === 'name') {
    return match[1];
  }

  return match[2];
};
