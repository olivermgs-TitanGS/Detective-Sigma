import { storyTemplates } from '../generators/story/templates';

describe('Story Templates', () => {
  it('should have at least one template', () => {
    expect(storyTemplates.length).toBeGreaterThan(0);
  });

  it('should have valid template structure', () => {
    storyTemplates.forEach((template) => {
      expect(template.id).toBeDefined();
      expect(template.subjects).toBeDefined();
      expect(template.subjects.length).toBeGreaterThan(0);
      expect(template.difficulties).toBeDefined();
      expect(template.difficulties.length).toBeGreaterThan(0);
      expect(template.themes).toBeDefined();
      expect(template.themes.length).toBeGreaterThan(0);
      expect(template.locations).toBeDefined();
      expect(template.locations.length).toBeGreaterThan(0);
      expect(template.crimes).toBeDefined();
      expect(template.crimes.length).toBeGreaterThan(0);
    });
  });

  it('should have valid subjects in templates', () => {
    const validSubjects = ['MATH', 'SCIENCE', 'INTEGRATED'];
    storyTemplates.forEach((template) => {
      template.subjects.forEach((subject) => {
        expect(validSubjects).toContain(subject);
      });
    });
  });

  it('should have valid difficulties in templates', () => {
    const validDifficulties = ['ROOKIE', 'INSPECTOR', 'DETECTIVE', 'CHIEF'];
    storyTemplates.forEach((template) => {
      template.difficulties.forEach((difficulty) => {
        expect(validDifficulties).toContain(difficulty);
      });
    });
  });

  it('should have Singapore cultural context or any', () => {
    storyTemplates.forEach((template) => {
      expect(['singapore', 'any']).toContain(template.culturalContext);
    });
  });

  it('should have location descriptions', () => {
    storyTemplates.forEach((template) => {
      template.locations.forEach((location) => {
        expect(location.name).toBeDefined();
        expect(location.description).toBeDefined();
        expect(location.description.length).toBeGreaterThan(10);
      });
    });
  });

  it('should have crime solutions', () => {
    storyTemplates.forEach((template) => {
      template.crimes.forEach((crime) => {
        expect(crime.type).toBeDefined();
        expect(crime.description).toBeDefined();
        expect(crime.solution).toBeDefined();
      });
    });
  });

  it('should cover MATH subject', () => {
    const mathTemplates = storyTemplates.filter((t) => t.subjects.includes('MATH'));
    expect(mathTemplates.length).toBeGreaterThan(0);
  });

  it('should cover SCIENCE subject', () => {
    const scienceTemplates = storyTemplates.filter((t) => t.subjects.includes('SCIENCE'));
    expect(scienceTemplates.length).toBeGreaterThan(0);
  });

  it('should cover all difficulty levels', () => {
    const difficulties = ['ROOKIE', 'INSPECTOR', 'DETECTIVE', 'CHIEF'];
    difficulties.forEach((difficulty) => {
      const templatesWithDifficulty = storyTemplates.filter((t) =>
        t.difficulties.includes(difficulty)
      );
      expect(templatesWithDifficulty.length).toBeGreaterThan(0);
    });
  });
});
