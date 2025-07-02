import { Injectable } from '@nestjs/common';

export interface PasswordStrengthResult {
  score: number;
  strength: string;
  feedback: string[];
  criteria: {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    numbers: boolean;
    symbols: boolean;
    noSpaces: boolean;
    noCommonPatterns: boolean;
  };
}

@Injectable()
export class PasswordService {
  private commonPatterns = [
    /(.)\1{2,}/g, // repeated characters
    /123|abc|qwerty|password|admin/gi, // common sequences
    /^\d+$/g, // only numbers
    /^[a-zA-Z]+$/g, // only letters
  ];

  checkPasswordStrength(password: string): PasswordStrengthResult {
    const criteria = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      noSpaces: !/\s/.test(password),
      noCommonPatterns: !this.hasCommonPatterns(password),
    };

    const score = this.calculateScore(password, criteria);
    const strength = this.getStrengthLevel(score);
    const feedback = this.generateFeedback(criteria, password);

    return {
      score,
      strength,
      feedback,
      criteria,
    };
  }

  private calculateScore(password: string, criteria: any): number {
    let score = 0;

    // Length scoring
    if (password.length >= 8) score += 25;
    if (password.length >= 12) score += 15;
    if (password.length >= 16) score += 10;

    // Character variety scoring
    if (criteria.lowercase) score += 10;
    if (criteria.uppercase) score += 10;
    if (criteria.numbers) score += 10;
    if (criteria.symbols) score += 15;

    // Bonus points
    if (criteria.noSpaces) score += 5;
    if (criteria.noCommonPatterns) score += 10;

    // Entropy bonus for longer passwords
    if (password.length > 20) score += 5;

    return Math.min(score, 100);
  }

  private getStrengthLevel(score: number): string {
    if (score >= 80) return 'Very Strong';
    if (score >= 60) return 'Strong';
    if (score >= 40) return 'Medium';
    if (score >= 20) return 'Weak';
    return 'Very Weak';
  }

  private generateFeedback(criteria: any, password: string): string[] {
    const feedback: string[] = [];

    if (!criteria.length) {
      feedback.push('Password should be at least 8 characters long');
    }
    if (!criteria.lowercase) {
      feedback.push('Add lowercase letters (a-z)');
    }
    if (!criteria.uppercase) {
      feedback.push('Add uppercase letters (A-Z)');
    }
    if (!criteria.numbers) {
      feedback.push('Add numbers (0-9)');
    }
    if (!criteria.symbols) {
      feedback.push('Add special characters (!@#$%^&*)');
    }
    if (!criteria.noSpaces) {
      feedback.push('Remove spaces from password');
    }
    if (!criteria.noCommonPatterns) {
      feedback.push('Avoid common patterns like "123", "abc", or "password"');
    }

    if (password.length < 12) {
      feedback.push('Consider using 12+ characters for better security');
    }

    if (feedback.length === 0) {
      feedback.push('Excellent! Your password meets all security criteria');
    }

    return feedback;
  }

  private hasCommonPatterns(password: string): boolean {
    return this.commonPatterns.some(pattern => pattern.test(password));
  }
}