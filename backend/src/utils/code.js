const CHARSET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function generateCode(length = 6) {
  let result = '';
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * CHARSET.length);
    result += CHARSET[index];
  }
  return result;
}

export function isValidCode(code) {
  return typeof code === 'string' && /^[A-Za-z0-9]{6,8}$/.test(code);
}
