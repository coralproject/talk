function compileTrust(trust: string) {
  if (!trust) {
    return null;
  }

  const lowercase = trust.toLowerCase();
  if (lowercase === "true" || lowercase === "false") {
    return lowercase === "true";
  }

  const parsed = Number(trust);
  if (!isNaN(parsed)) {
    return parsed;
  }

  return trust;
}

export default compileTrust;
