import * as bcrypt from 'bcrypt';

export const PasswordUtils = {
  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  },

  async hashPassword(password: string, rounds = 5): Promise<string> {
    return bcrypt.hash(password, rounds);
  },

  async generateAndHashPassword(rounds = 5): Promise<string> {
    const password = Math.random().toString(36).slice(-10);
    const hashedPassword = await this.hashPassword(password, rounds);
    return hashedPassword.toString();
  }
};
