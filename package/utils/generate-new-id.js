let nanoid;

const generateNewId = async () => {
  if (!nanoid) {
    nanoid = await import("nanoid");
  }
  return nanoid.nanoid(8);
};

module.exports = {
  generateNewId,
};
