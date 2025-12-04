import { GenerationRequestSchema, DifficultyEnum, SubjectEnum, GradeLevelEnum } from '../types';

describe('Types', () => {
  describe('Enums', () => {
    it('should have valid difficulty values', () => {
      expect(DifficultyEnum.options).toEqual(['ROOKIE', 'INSPECTOR', 'DETECTIVE', 'CHIEF']);
    });

    it('should have valid subject values', () => {
      expect(SubjectEnum.options).toEqual(['MATH', 'SCIENCE', 'INTEGRATED']);
    });

    it('should have valid grade level values', () => {
      expect(GradeLevelEnum.options).toEqual(['P4', 'P5', 'P6']);
    });
  });

  describe('GenerationRequestSchema', () => {
    it('should validate a valid request', () => {
      const validRequest = {
        difficulty: 'ROOKIE',
        subject: 'MATH',
        gradeLevel: 'P4',
      };
      
      const result = GenerationRequestSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });

    it('should reject invalid difficulty', () => {
      const invalidRequest = {
        difficulty: 'INVALID',
        subject: 'MATH',
        gradeLevel: 'P4',
      };
      
      const result = GenerationRequestSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });

    it('should accept optional constraints', () => {
      const requestWithConstraints = {
        difficulty: 'DETECTIVE',
        subject: 'SCIENCE',
        gradeLevel: 'P6',
        constraints: {
          excludeThemes: ['violence'],
          requiredSkills: ['critical thinking'],
          estimatedMinutes: 60,
        },
      };
      
      const result = GenerationRequestSchema.safeParse(requestWithConstraints);
      expect(result.success).toBe(true);
    });

    it('should reject invalid estimatedMinutes', () => {
      const invalidRequest = {
        difficulty: 'ROOKIE',
        subject: 'MATH',
        gradeLevel: 'P4',
        constraints: {
          estimatedMinutes: 5, // Too short (min is 15)
        },
      };
      
      const result = GenerationRequestSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });
  });
});
