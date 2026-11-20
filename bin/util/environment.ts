// `options.env` is the documented source of the Environment field; process.env is only the fallback.
export const environmentName = (options: any): string =>
    options?.env?.NODE_ENV || process.env.NODE_ENV || 'Unknown';

export default environmentName;
