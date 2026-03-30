export const extractParam = (param: string | string[] | undefined): string => {
  if (!param) {
    throw new Error('Parameter is required');
  }
  if (Array.isArray(param)) {
    return param[0];
  }
  return param;
};