export const initials = (name: string, depth = 2): string | undefined => {
  if (name && name.length > 1) {
    if (depth === 1) {
      return `${name.split(" ")[0][0]}`.toUpperCase();
    }

    return `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`.toUpperCase();
  }

  return undefined;
};

export const prettyJson = (json: JSON): string =>
  JSON.stringify(json, undefined, 4);
