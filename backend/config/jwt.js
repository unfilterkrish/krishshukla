const DEVELOPMENT_SECRET = 'prompt_vault_ai_fallback_secret_key_2026';

const getJwtSecret = () => {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set in production');
  }

  return DEVELOPMENT_SECRET;
};

module.exports = { getJwtSecret };
