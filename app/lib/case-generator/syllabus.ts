/**
 * SINGAPORE PRIMARY SCHOOL SYLLABUS MODULE
 *
 * This module defines the complete MOE curriculum for:
 * - Mathematics (P4-P6)
 * - Science (P4-P6)
 *
 * Each topic includes:
 * - Learning objectives
 * - Key concepts
 * - Skills assessed
 * - Difficulty progression
 * - Example problem types
 */

export type GradeLevel = 'P4' | 'P5' | 'P6' | 'SECONDARY' | 'ADULT';
export type Subject = 'MATH' | 'SCIENCE' | 'INTEGRATED';

export interface LearningObjective {
  id: string;
  description: string;
  bloomsLevel: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
}

export interface SyllabusTopic {
  id: string;
  name: string;
  subject: Subject;
  gradeLevel: GradeLevel;
  strand: string; // Main category (e.g., "Numbers", "Measurement", "Living Things")
  unit: string;   // Sub-category
  description: string;
  learningObjectives: LearningObjective[];
  prerequisites: string[]; // Topic IDs that should be learned first
  keyVocabulary: string[];
  estimatedLessons: number; // Typical lessons in textbook
  puzzleTypes: string[]; // Types of puzzles that can assess this topic
  realWorldApplications: string[];
}

export interface CurriculumStrand {
  id: string;
  name: string;
  subject: Subject;
  description: string;
  color: string; // For UI theming
}

// ============================================
// CURRICULUM STRANDS
// ============================================

export const curriculumStrands: CurriculumStrand[] = [
  // MATH STRANDS
  { id: 'numbers', name: 'Numbers and Operations', subject: 'MATH', description: 'Whole numbers, fractions, decimals, and operations', color: 'blue' },
  { id: 'measurement', name: 'Measurement', subject: 'MATH', description: 'Length, mass, volume, time, money, area, perimeter', color: 'green' },
  { id: 'geometry', name: 'Geometry', subject: 'MATH', description: 'Shapes, angles, symmetry, nets', color: 'purple' },
  { id: 'data', name: 'Data Analysis', subject: 'MATH', description: 'Tables, graphs, average, probability', color: 'orange' },
  { id: 'algebra', name: 'Algebra', subject: 'MATH', description: 'Patterns, equations, problem solving', color: 'red' },

  // SCIENCE STRANDS
  { id: 'diversity', name: 'Diversity', subject: 'SCIENCE', description: 'Living and non-living things, classification', color: 'green' },
  { id: 'cycles', name: 'Cycles', subject: 'SCIENCE', description: 'Life cycles, water cycle, matter cycles', color: 'blue' },
  { id: 'systems', name: 'Systems', subject: 'SCIENCE', description: 'Human body, plant, electrical systems', color: 'red' },
  { id: 'interactions', name: 'Interactions', subject: 'SCIENCE', description: 'Forces, energy, environment', color: 'orange' },
  { id: 'energy', name: 'Energy', subject: 'SCIENCE', description: 'Forms of energy, conversion, conservation', color: 'yellow' },
];

// ============================================
// PRIMARY 4 MATHEMATICS SYLLABUS
// ============================================

export const p4MathTopics: SyllabusTopic[] = [
  // NUMBERS STRAND
  {
    id: 'p4-math-whole-numbers',
    name: 'Whole Numbers to 100,000',
    subject: 'MATH',
    gradeLevel: 'P4',
    strand: 'numbers',
    unit: 'Whole Numbers',
    description: 'Reading, writing, comparing and ordering numbers up to 100,000. Place value concepts.',
    learningObjectives: [
      { id: 'p4-wn-1', description: 'Read and write numbers up to 100,000 in numerals and words', bloomsLevel: 'remember' },
      { id: 'p4-wn-2', description: 'Identify place value of digits in numbers up to 100,000', bloomsLevel: 'understand' },
      { id: 'p4-wn-3', description: 'Compare and order numbers up to 100,000', bloomsLevel: 'apply' },
      { id: 'p4-wn-4', description: 'Round numbers to nearest 10, 100, 1000', bloomsLevel: 'apply' },
    ],
    prerequisites: [],
    keyVocabulary: ['place value', 'ten thousands', 'thousands', 'hundreds', 'tens', 'ones', 'round', 'estimate'],
    estimatedLessons: 8,
    puzzleTypes: ['number-comparison', 'place-value', 'rounding', 'estimation'],
    realWorldApplications: ['Population counts', 'Distance measurements', 'Money amounts'],
  },
  {
    id: 'p4-math-multiplication',
    name: 'Multiplication and Division',
    subject: 'MATH',
    gradeLevel: 'P4',
    strand: 'numbers',
    unit: 'Operations',
    description: 'Multiply and divide numbers up to 4 digits by 1-digit and 2-digit numbers.',
    learningObjectives: [
      { id: 'p4-mul-1', description: 'Multiply up to 4-digit by 1-digit numbers', bloomsLevel: 'apply' },
      { id: 'p4-mul-2', description: 'Multiply by 10, 100, 1000', bloomsLevel: 'apply' },
      { id: 'p4-mul-3', description: 'Multiply 2-digit by 2-digit numbers', bloomsLevel: 'apply' },
      { id: 'p4-div-1', description: 'Divide up to 4-digit by 1-digit numbers', bloomsLevel: 'apply' },
      { id: 'p4-div-2', description: 'Solve word problems involving multiplication and division', bloomsLevel: 'analyze' },
    ],
    prerequisites: ['p4-math-whole-numbers'],
    keyVocabulary: ['multiply', 'divide', 'product', 'quotient', 'remainder', 'factor'],
    estimatedLessons: 12,
    puzzleTypes: ['multiplication-word-problem', 'division-word-problem', 'multi-step-calculation'],
    realWorldApplications: ['Shopping calculations', 'Equal sharing', 'Array arrangements'],
  },
  {
    id: 'p4-math-factors-multiples',
    name: 'Factors and Multiples',
    subject: 'MATH',
    gradeLevel: 'P4',
    strand: 'numbers',
    unit: 'Number Theory',
    description: 'Understanding factors and multiples of whole numbers.',
    learningObjectives: [
      { id: 'p4-fm-1', description: 'Find factors of a whole number up to 100', bloomsLevel: 'apply' },
      { id: 'p4-fm-2', description: 'Identify common factors of two numbers', bloomsLevel: 'analyze' },
      { id: 'p4-fm-3', description: 'Find multiples of a whole number', bloomsLevel: 'apply' },
      { id: 'p4-fm-4', description: 'Identify common multiples of two numbers', bloomsLevel: 'analyze' },
    ],
    prerequisites: ['p4-math-multiplication'],
    keyVocabulary: ['factor', 'multiple', 'common factor', 'common multiple', 'prime', 'composite'],
    estimatedLessons: 6,
    puzzleTypes: ['factor-finding', 'multiple-finding', 'lcm-gcf-problem'],
    realWorldApplications: ['Grouping items equally', 'Scheduling recurring events', 'Pattern recognition'],
  },
  {
    id: 'p4-math-fractions',
    name: 'Fractions',
    subject: 'MATH',
    gradeLevel: 'P4',
    strand: 'numbers',
    unit: 'Fractions',
    description: 'Equivalent fractions, comparing fractions, adding and subtracting fractions.',
    learningObjectives: [
      { id: 'p4-fr-1', description: 'Recognize and name equivalent fractions', bloomsLevel: 'understand' },
      { id: 'p4-fr-2', description: 'Simplify fractions to simplest form', bloomsLevel: 'apply' },
      { id: 'p4-fr-3', description: 'Compare and order fractions with different denominators', bloomsLevel: 'analyze' },
      { id: 'p4-fr-4', description: 'Add and subtract fractions with same denominators', bloomsLevel: 'apply' },
      { id: 'p4-fr-5', description: 'Add and subtract fractions with different denominators', bloomsLevel: 'apply' },
    ],
    prerequisites: ['p4-math-factors-multiples'],
    keyVocabulary: ['numerator', 'denominator', 'equivalent', 'simplify', 'proper fraction', 'improper fraction', 'mixed number'],
    estimatedLessons: 14,
    puzzleTypes: ['fraction-comparison', 'fraction-addition', 'fraction-word-problem'],
    realWorldApplications: ['Sharing food equally', 'Measuring ingredients', 'Time portions'],
  },
  {
    id: 'p4-math-decimals',
    name: 'Decimals',
    subject: 'MATH',
    gradeLevel: 'P4',
    strand: 'numbers',
    unit: 'Decimals',
    description: 'Decimals up to 2 decimal places, relationship with fractions.',
    learningObjectives: [
      { id: 'p4-dec-1', description: 'Read and write decimals up to 2 decimal places', bloomsLevel: 'remember' },
      { id: 'p4-dec-2', description: 'Express fractions as decimals and vice versa', bloomsLevel: 'understand' },
      { id: 'p4-dec-3', description: 'Compare and order decimals', bloomsLevel: 'apply' },
      { id: 'p4-dec-4', description: 'Add and subtract decimals up to 2 decimal places', bloomsLevel: 'apply' },
    ],
    prerequisites: ['p4-math-fractions'],
    keyVocabulary: ['decimal', 'tenths', 'hundredths', 'decimal point', 'decimal places'],
    estimatedLessons: 10,
    puzzleTypes: ['decimal-comparison', 'decimal-operations', 'money-calculation'],
    realWorldApplications: ['Money calculations', 'Measurements', 'Sports timing'],
  },

  // MEASUREMENT STRAND
  // NOTE: Time (24-hour clock) moved to P3 as of 2025 syllabus revision
  {
    id: 'p4-math-area-perimeter',
    name: 'Area and Perimeter',
    subject: 'MATH',
    gradeLevel: 'P4',
    strand: 'measurement',
    unit: 'Area and Perimeter',
    description: 'Finding area and perimeter of rectangles and squares, composite figures.',
    learningObjectives: [
      { id: 'p4-ap-1', description: 'Find perimeter of rectangles and squares', bloomsLevel: 'apply' },
      { id: 'p4-ap-2', description: 'Find area of rectangles and squares', bloomsLevel: 'apply' },
      { id: 'p4-ap-3', description: 'Find area of composite figures made of rectangles', bloomsLevel: 'analyze' },
      { id: 'p4-ap-4', description: 'Solve word problems involving area and perimeter', bloomsLevel: 'analyze' },
    ],
    prerequisites: ['p4-math-multiplication'],
    keyVocabulary: ['perimeter', 'area', 'square units', 'length', 'width', 'composite figure'],
    estimatedLessons: 10,
    puzzleTypes: ['perimeter-calculation', 'area-calculation', 'composite-figure'],
    realWorldApplications: ['Room dimensions', 'Garden planning', 'Fencing calculation'],
  },

  // DATA STRAND
  {
    id: 'p4-math-tables-graphs',
    name: 'Tables and Line Graphs',
    subject: 'MATH',
    gradeLevel: 'P4',
    strand: 'data',
    unit: 'Data Handling',
    description: 'Reading and interpreting tables and line graphs.',
    learningObjectives: [
      { id: 'p4-tg-1', description: 'Complete tables from given information', bloomsLevel: 'apply' },
      { id: 'p4-tg-2', description: 'Read and interpret line graphs', bloomsLevel: 'analyze' },
      { id: 'p4-tg-3', description: 'Solve problems using information from tables and graphs', bloomsLevel: 'analyze' },
    ],
    prerequisites: ['p4-math-whole-numbers'],
    keyVocabulary: ['table', 'line graph', 'horizontal axis', 'vertical axis', 'data', 'trend'],
    estimatedLessons: 6,
    puzzleTypes: ['table-analysis', 'graph-interpretation', 'data-comparison'],
    realWorldApplications: ['Temperature tracking', 'Sales data', 'Population changes'],
  },

  // GEOMETRY STRAND
  {
    id: 'p4-math-angles',
    name: 'Angles',
    subject: 'MATH',
    gradeLevel: 'P4',
    strand: 'geometry',
    unit: 'Angles',
    description: 'Understanding angles, measuring and drawing angles.',
    learningObjectives: [
      { id: 'p4-ang-1', description: 'Identify right angles, acute angles, and obtuse angles', bloomsLevel: 'remember' },
      { id: 'p4-ang-2', description: 'Measure angles using a protractor', bloomsLevel: 'apply' },
      { id: 'p4-ang-3', description: 'Draw angles of given size', bloomsLevel: 'apply' },
      { id: 'p4-ang-4', description: 'Find unknown angles on a straight line', bloomsLevel: 'analyze' },
    ],
    prerequisites: [],
    keyVocabulary: ['angle', 'degree', 'right angle', 'acute', 'obtuse', 'protractor', 'straight angle'],
    estimatedLessons: 8,
    puzzleTypes: ['angle-identification', 'angle-calculation', 'missing-angle'],
    realWorldApplications: ['Clock hands', 'Door openings', 'Map directions'],
  },
  {
    id: 'p4-math-symmetry',
    name: 'Symmetry',
    subject: 'MATH',
    gradeLevel: 'P4',
    strand: 'geometry',
    unit: 'Symmetry',
    description: 'Line symmetry and identifying symmetric figures.',
    learningObjectives: [
      { id: 'p4-sym-1', description: 'Identify symmetric figures', bloomsLevel: 'understand' },
      { id: 'p4-sym-2', description: 'Identify lines of symmetry', bloomsLevel: 'apply' },
      { id: 'p4-sym-3', description: 'Complete symmetric figures', bloomsLevel: 'apply' },
    ],
    prerequisites: [],
    keyVocabulary: ['symmetry', 'line of symmetry', 'symmetric', 'reflection'],
    estimatedLessons: 4,
    puzzleTypes: ['symmetry-identification', 'symmetry-completion', 'pattern-recognition'],
    realWorldApplications: ['Art and design', 'Nature patterns', 'Architecture'],
  },
];

// ============================================
// PRIMARY 5 MATHEMATICS SYLLABUS
// ============================================

export const p5MathTopics: SyllabusTopic[] = [
  // NUMBERS STRAND
  {
    id: 'p5-math-whole-numbers',
    name: 'Whole Numbers to 10 Million',
    subject: 'MATH',
    gradeLevel: 'P5',
    strand: 'numbers',
    unit: 'Whole Numbers',
    description: 'Numbers up to 10 million, operations with larger numbers.',
    learningObjectives: [
      { id: 'p5-wn-1', description: 'Read and write numbers up to 10 million', bloomsLevel: 'remember' },
      { id: 'p5-wn-2', description: 'Multiply and divide by tens, hundreds, thousands', bloomsLevel: 'apply' },
      { id: 'p5-wn-3', description: 'Use order of operations (BODMAS)', bloomsLevel: 'apply' },
      { id: 'p5-wn-4', description: 'Solve multi-step word problems', bloomsLevel: 'analyze' },
    ],
    prerequisites: ['p4-math-whole-numbers', 'p4-math-multiplication'],
    keyVocabulary: ['millions', 'order of operations', 'brackets', 'estimate'],
    estimatedLessons: 10,
    puzzleTypes: ['large-number-operations', 'order-of-operations', 'multi-step-word-problem'],
    realWorldApplications: ['National statistics', 'Astronomical numbers', 'Business figures'],
  },
  {
    id: 'p5-math-fractions',
    name: 'Fractions (Advanced)',
    subject: 'MATH',
    gradeLevel: 'P5',
    strand: 'numbers',
    unit: 'Fractions',
    description: 'Multiplying and dividing fractions, fraction of a set.',
    learningObjectives: [
      { id: 'p5-fr-1', description: 'Multiply fractions by whole numbers', bloomsLevel: 'apply' },
      { id: 'p5-fr-2', description: 'Multiply proper/improper fractions by proper/improper fractions', bloomsLevel: 'apply' },
      { id: 'p5-fr-3', description: 'Divide fractions by whole numbers', bloomsLevel: 'apply' },
      { id: 'p5-fr-4', description: 'Find fraction of a set of items', bloomsLevel: 'apply' },
      { id: 'p5-fr-5', description: 'Solve word problems involving fractions', bloomsLevel: 'analyze' },
    ],
    prerequisites: ['p4-math-fractions'],
    keyVocabulary: ['multiply', 'divide', 'fraction of', 'reciprocal'],
    estimatedLessons: 14,
    puzzleTypes: ['fraction-multiplication', 'fraction-division', 'fraction-of-quantity'],
    realWorldApplications: ['Recipe scaling', 'Sharing portions', 'Discount calculations'],
  },
  // NOTE: Ratio moved to P6 as of 2025 syllabus revision
  {
    id: 'p5-math-percentage',
    name: 'Percentage',
    subject: 'MATH',
    gradeLevel: 'P5',
    strand: 'numbers',
    unit: 'Percentage',
    description: 'Understanding percentage, converting between fractions, decimals and percentages.',
    learningObjectives: [
      { id: 'p5-per-1', description: 'Understand percentage as "out of 100"', bloomsLevel: 'understand' },
      { id: 'p5-per-2', description: 'Convert between percentages, fractions, and decimals', bloomsLevel: 'apply' },
      { id: 'p5-per-3', description: 'Find percentage of a quantity', bloomsLevel: 'apply' },
      { id: 'p5-per-4', description: 'Solve word problems involving percentage', bloomsLevel: 'analyze' },
    ],
    prerequisites: ['p4-math-fractions', 'p4-math-decimals'],
    keyVocabulary: ['percent', 'percentage', 'out of 100', 'discount', 'GST'],
    estimatedLessons: 10,
    puzzleTypes: ['percentage-calculation', 'discount-problem', 'percentage-word-problem'],
    realWorldApplications: ['Shop discounts', 'Tax calculations', 'Test scores'],
  },
  {
    id: 'p5-math-decimals',
    name: 'Decimals (Advanced)',
    subject: 'MATH',
    gradeLevel: 'P5',
    strand: 'numbers',
    unit: 'Decimals',
    description: 'Decimals up to 3 decimal places, multiplying and dividing decimals.',
    learningObjectives: [
      { id: 'p5-dec-1', description: 'Read and write decimals up to 3 decimal places', bloomsLevel: 'remember' },
      { id: 'p5-dec-2', description: 'Multiply decimals by whole numbers', bloomsLevel: 'apply' },
      { id: 'p5-dec-3', description: 'Divide decimals by whole numbers', bloomsLevel: 'apply' },
      { id: 'p5-dec-4', description: 'Multiply and divide decimals by 10, 100, 1000', bloomsLevel: 'apply' },
    ],
    prerequisites: ['p4-math-decimals'],
    keyVocabulary: ['thousandths', 'decimal places', 'estimate'],
    estimatedLessons: 10,
    puzzleTypes: ['decimal-multiplication', 'decimal-division', 'decimal-word-problem'],
    realWorldApplications: ['Scientific measurements', 'Currency exchange', 'Fuel prices'],
  },

  // MEASUREMENT STRAND
  {
    id: 'p5-math-area-perimeter',
    name: 'Area of Triangles',
    subject: 'MATH',
    gradeLevel: 'P5',
    strand: 'measurement',
    unit: 'Area and Perimeter',
    description: 'Finding area of triangles, composite figures with triangles.',
    learningObjectives: [
      { id: 'p5-ap-1', description: 'Find area of triangles', bloomsLevel: 'apply' },
      { id: 'p5-ap-2', description: 'Find area of composite figures involving triangles', bloomsLevel: 'analyze' },
      { id: 'p5-ap-3', description: 'Solve word problems involving area', bloomsLevel: 'analyze' },
    ],
    prerequisites: ['p4-math-area-perimeter'],
    keyVocabulary: ['base', 'height', 'triangle area formula', 'composite figure'],
    estimatedLessons: 8,
    puzzleTypes: ['triangle-area', 'composite-area', 'area-word-problem'],
    realWorldApplications: ['Roof areas', 'Sail dimensions', 'Land plots'],
  },
  {
    id: 'p5-math-volume',
    name: 'Volume of Cubes and Cuboids',
    subject: 'MATH',
    gradeLevel: 'P5',
    strand: 'measurement',
    unit: 'Volume',
    description: 'Finding volume of cubes and cuboids.',
    learningObjectives: [
      { id: 'p5-vol-1', description: 'Find volume of cubes', bloomsLevel: 'apply' },
      { id: 'p5-vol-2', description: 'Find volume of cuboids', bloomsLevel: 'apply' },
      { id: 'p5-vol-3', description: 'Convert between cm³, ml, and litres', bloomsLevel: 'apply' },
      { id: 'p5-vol-4', description: 'Solve word problems involving volume', bloomsLevel: 'analyze' },
    ],
    prerequisites: ['p4-math-area-perimeter'],
    keyVocabulary: ['volume', 'cube', 'cuboid', 'cubic units', 'capacity', 'litre', 'millilitre'],
    estimatedLessons: 10,
    puzzleTypes: ['volume-calculation', 'capacity-conversion', 'volume-word-problem'],
    realWorldApplications: ['Container capacity', 'Swimming pool volume', 'Shipping boxes'],
  },
  // NOTE: Average moved to P6 as of 2025 syllabus revision
  {
    id: 'p5-math-rate',
    name: 'Rate',
    subject: 'MATH',
    gradeLevel: 'P5',
    strand: 'measurement',
    unit: 'Rate',
    description: 'Understanding rate as comparison of two quantities with different units.',
    learningObjectives: [
      { id: 'p5-rate-1', description: 'Understand rate as a comparison of quantities', bloomsLevel: 'understand' },
      { id: 'p5-rate-2', description: 'Calculate rate given two quantities', bloomsLevel: 'apply' },
      { id: 'p5-rate-3', description: 'Solve word problems involving rate', bloomsLevel: 'analyze' },
    ],
    prerequisites: ['p4-math-fractions', 'p4-math-multiplication'],
    keyVocabulary: ['rate', 'per', 'unit rate'],
    estimatedLessons: 8,
    puzzleTypes: ['rate-calculation', 'unit-rate', 'rate-word-problem'],
    realWorldApplications: ['Travel speed', 'Work rate', 'Price per unit'],
  },

  // GEOMETRY STRAND
  {
    id: 'p5-math-angles',
    name: 'Angles (Advanced)',
    subject: 'MATH',
    gradeLevel: 'P5',
    strand: 'geometry',
    unit: 'Angles',
    description: 'Angles in triangles and quadrilaterals.',
    learningObjectives: [
      { id: 'p5-ang-1', description: 'Find unknown angles in triangles (sum = 180°)', bloomsLevel: 'apply' },
      { id: 'p5-ang-2', description: 'Find unknown angles in quadrilaterals (sum = 360°)', bloomsLevel: 'apply' },
      { id: 'p5-ang-3', description: 'Identify and use properties of parallelograms', bloomsLevel: 'analyze' },
    ],
    prerequisites: ['p4-math-angles'],
    keyVocabulary: ['triangle', 'quadrilateral', 'parallelogram', 'angle sum'],
    estimatedLessons: 8,
    puzzleTypes: ['triangle-angles', 'quadrilateral-angles', 'parallelogram-properties'],
    realWorldApplications: ['Architecture', 'Engineering', 'Design'],
  },
];

// ============================================
// PRIMARY 6 MATHEMATICS SYLLABUS
// ============================================

export const p6MathTopics: SyllabusTopic[] = [
  // ALGEBRA STRAND
  {
    id: 'p6-math-algebra',
    name: 'Algebra',
    subject: 'MATH',
    gradeLevel: 'P6',
    strand: 'algebra',
    unit: 'Algebraic Expressions',
    description: 'Using letters for unknowns, simplifying expressions, solving equations.',
    learningObjectives: [
      { id: 'p6-alg-1', description: 'Use letters to represent unknown numbers', bloomsLevel: 'understand' },
      { id: 'p6-alg-2', description: 'Simplify algebraic expressions', bloomsLevel: 'apply' },
      { id: 'p6-alg-3', description: 'Evaluate algebraic expressions', bloomsLevel: 'apply' },
      { id: 'p6-alg-4', description: 'Solve simple linear equations', bloomsLevel: 'analyze' },
      { id: 'p6-alg-5', description: 'Form algebraic expressions from word problems', bloomsLevel: 'analyze' },
    ],
    prerequisites: ['p5-math-whole-numbers'],
    keyVocabulary: ['algebra', 'variable', 'expression', 'equation', 'solve', 'simplify', 'substitute'],
    estimatedLessons: 14,
    puzzleTypes: ['expression-simplification', 'equation-solving', 'word-to-algebra'],
    realWorldApplications: ['Unknown quantities', 'Pattern generalization', 'Problem formulation'],
  },
  {
    id: 'p6-math-fractions-advanced',
    name: 'Fractions (PSLE Level)',
    subject: 'MATH',
    gradeLevel: 'P6',
    strand: 'numbers',
    unit: 'Fractions',
    description: 'Complex fraction word problems for PSLE preparation.',
    learningObjectives: [
      { id: 'p6-fr-1', description: 'Solve multi-step fraction word problems', bloomsLevel: 'analyze' },
      { id: 'p6-fr-2', description: 'Apply fractions in ratio and percentage contexts', bloomsLevel: 'analyze' },
      { id: 'p6-fr-3', description: 'Use model drawing for fraction problems', bloomsLevel: 'evaluate' },
    ],
    prerequisites: ['p5-math-fractions', 'p6-math-ratio'],
    keyVocabulary: ['model', 'units', 'remainder', 'original'],
    estimatedLessons: 12,
    puzzleTypes: ['complex-fraction', 'before-after-problem', 'model-drawing'],
    realWorldApplications: ['Financial planning', 'Resource allocation', 'Problem solving'],
  },
  {
    id: 'p6-math-ratio-advanced',
    name: 'Ratio (PSLE Level)',
    subject: 'MATH',
    gradeLevel: 'P6',
    strand: 'numbers',
    unit: 'Ratio',
    description: 'Complex ratio problems, changing ratios, ratio and fractions.',
    learningObjectives: [
      { id: 'p6-rat-1', description: 'Solve problems involving changing ratios', bloomsLevel: 'analyze' },
      { id: 'p6-rat-2', description: 'Connect ratio with fractions and percentages', bloomsLevel: 'analyze' },
      { id: 'p6-rat-3', description: 'Use ratio to solve age problems', bloomsLevel: 'analyze' },
    ],
    prerequisites: ['p6-math-ratio', 'p5-math-percentage'],
    keyVocabulary: ['changing ratio', 'total unchanged', 'difference unchanged'],
    estimatedLessons: 10,
    puzzleTypes: ['changing-ratio', 'ratio-age-problem', 'ratio-combination'],
    realWorldApplications: ['Business partnerships', 'Recipe scaling', 'Mixing solutions'],
  },
  {
    id: 'p6-math-percentage-advanced',
    name: 'Percentage (PSLE Level)',
    subject: 'MATH',
    gradeLevel: 'P6',
    strand: 'numbers',
    unit: 'Percentage',
    description: 'Percentage increase/decrease, GST, discount, profit/loss.',
    learningObjectives: [
      { id: 'p6-per-1', description: 'Calculate percentage increase and decrease', bloomsLevel: 'apply' },
      { id: 'p6-per-2', description: 'Find original value given percentage change', bloomsLevel: 'analyze' },
      { id: 'p6-per-3', description: 'Solve problems involving GST, discount, profit, loss', bloomsLevel: 'analyze' },
    ],
    prerequisites: ['p5-math-percentage'],
    keyVocabulary: ['increase', 'decrease', 'GST', 'discount', 'profit', 'loss', 'cost price', 'selling price'],
    estimatedLessons: 12,
    puzzleTypes: ['percentage-change', 'profit-loss', 'gst-discount'],
    realWorldApplications: ['Shopping calculations', 'Business profit', 'Tax calculations'],
  },
  // NOTE: Speed topic REMOVED from primary syllabus as of 2025
  // Speed is now only taught in Secondary 1

  // Ratio - moved from P5 to P6 as of 2025 syllabus revision
  {
    id: 'p6-math-ratio',
    name: 'Ratio',
    subject: 'MATH',
    gradeLevel: 'P6',
    strand: 'numbers',
    unit: 'Ratio',
    description: 'Understanding ratio, equivalent ratios, solving ratio problems.',
    learningObjectives: [
      { id: 'p6-rat-1', description: 'Use ratio to compare quantities', bloomsLevel: 'understand' },
      { id: 'p6-rat-2', description: 'Find equivalent ratios', bloomsLevel: 'apply' },
      { id: 'p6-rat-3', description: 'Simplify ratios to simplest form', bloomsLevel: 'apply' },
      { id: 'p6-rat-4', description: 'Find one quantity given the ratio and another quantity', bloomsLevel: 'analyze' },
      { id: 'p6-rat-5', description: 'Solve word problems involving ratio', bloomsLevel: 'analyze' },
    ],
    prerequisites: ['p4-math-fractions', 'p4-math-factors-multiples'],
    keyVocabulary: ['ratio', 'equivalent ratio', 'simplify', 'proportion'],
    estimatedLessons: 12,
    puzzleTypes: ['ratio-comparison', 'ratio-calculation', 'sharing-by-ratio'],
    realWorldApplications: ['Mixing recipes', 'Map scales', 'Money sharing'],
  },
  // Average - moved from P5 to P6 as of 2025 syllabus revision
  {
    id: 'p6-math-average',
    name: 'Average',
    subject: 'MATH',
    gradeLevel: 'P6',
    strand: 'data',
    unit: 'Average',
    description: 'Finding average of a set of numbers.',
    learningObjectives: [
      { id: 'p6-avg-1', description: 'Find average of a set of numbers', bloomsLevel: 'apply' },
      { id: 'p6-avg-2', description: 'Find total given average and number of items', bloomsLevel: 'analyze' },
      { id: 'p6-avg-3', description: 'Find missing value given average', bloomsLevel: 'analyze' },
      { id: 'p6-avg-4', description: 'Solve word problems involving average', bloomsLevel: 'analyze' },
    ],
    prerequisites: ['p4-math-multiplication'],
    keyVocabulary: ['average', 'mean', 'total', 'number of items'],
    estimatedLessons: 6,
    puzzleTypes: ['average-calculation', 'find-missing-value', 'average-word-problem'],
    realWorldApplications: ['Test scores', 'Sports statistics', 'Weather data'],
  },
  {
    id: 'p6-math-circles',
    name: 'Circles',
    subject: 'MATH',
    gradeLevel: 'P6',
    strand: 'geometry',
    unit: 'Circles',
    description: 'Circumference and area of circles.',
    learningObjectives: [
      { id: 'p6-cir-1', description: 'Identify parts of a circle (radius, diameter, circumference)', bloomsLevel: 'remember' },
      { id: 'p6-cir-2', description: 'Find circumference of circles', bloomsLevel: 'apply' },
      { id: 'p6-cir-3', description: 'Find area of circles', bloomsLevel: 'apply' },
      { id: 'p6-cir-4', description: 'Find area of semicircles and quadrants', bloomsLevel: 'apply' },
      { id: 'p6-cir-5', description: 'Solve problems involving circles in composite figures', bloomsLevel: 'analyze' },
    ],
    prerequisites: ['p5-math-area-perimeter'],
    keyVocabulary: ['circle', 'radius', 'diameter', 'circumference', 'pi', 'semicircle', 'quadrant'],
    estimatedLessons: 10,
    puzzleTypes: ['circumference-calculation', 'circle-area', 'composite-circles'],
    realWorldApplications: ['Wheel measurements', 'Pizza sizing', 'Track lengths'],
  },
  {
    id: 'p6-math-volume-advanced',
    name: 'Volume (Advanced)',
    subject: 'MATH',
    gradeLevel: 'P6',
    strand: 'measurement',
    unit: 'Volume',
    description: 'Volume of composite solids, water displacement.',
    learningObjectives: [
      { id: 'p6-vol-1', description: 'Find volume of composite solids', bloomsLevel: 'analyze' },
      { id: 'p6-vol-2', description: 'Solve problems involving water displacement', bloomsLevel: 'analyze' },
      { id: 'p6-vol-3', description: 'Find height of water given volume', bloomsLevel: 'analyze' },
    ],
    prerequisites: ['p5-math-volume'],
    keyVocabulary: ['composite solid', 'displacement', 'water level', 'cross-section'],
    estimatedLessons: 8,
    puzzleTypes: ['composite-volume', 'water-displacement', 'volume-word-problem'],
    realWorldApplications: ['Container filling', 'Object submerging', 'Tank capacity'],
  },
];

// ============================================
// PRIMARY 4 SCIENCE SYLLABUS
// ============================================

export const p4ScienceTopics: SyllabusTopic[] = [
  // DIVERSITY
  {
    id: 'p4-sci-classification',
    name: 'Classification of Things',
    subject: 'SCIENCE',
    gradeLevel: 'P4',
    strand: 'diversity',
    unit: 'Living and Non-Living Things',
    description: 'Classifying living and non-living things, characteristics of living things.',
    learningObjectives: [
      { id: 'p4-cls-1', description: 'Identify characteristics of living things', bloomsLevel: 'remember' },
      { id: 'p4-cls-2', description: 'Classify things as living or non-living', bloomsLevel: 'understand' },
      { id: 'p4-cls-3', description: 'Group living things based on observable characteristics', bloomsLevel: 'apply' },
    ],
    prerequisites: [],
    keyVocabulary: ['living', 'non-living', 'characteristics', 'classify', 'organisms'],
    estimatedLessons: 6,
    puzzleTypes: ['classification', 'characteristic-identification', 'grouping'],
    realWorldApplications: ['Nature observation', 'Environmental awareness', 'Scientific thinking'],
  },
  {
    id: 'p4-sci-plants',
    name: 'Plants and Their Parts',
    subject: 'SCIENCE',
    gradeLevel: 'P4',
    strand: 'diversity',
    unit: 'Plants',
    description: 'Parts of plants and their functions, plant diversity.',
    learningObjectives: [
      { id: 'p4-plt-1', description: 'Identify parts of a plant (root, stem, leaf, flower)', bloomsLevel: 'remember' },
      { id: 'p4-plt-2', description: 'Describe functions of each plant part', bloomsLevel: 'understand' },
      { id: 'p4-plt-3', description: 'Compare different types of plants', bloomsLevel: 'analyze' },
    ],
    prerequisites: ['p4-sci-classification'],
    keyVocabulary: ['root', 'stem', 'leaf', 'flower', 'photosynthesis', 'transport', 'reproduction'],
    estimatedLessons: 8,
    puzzleTypes: ['plant-part-identification', 'function-matching', 'plant-comparison'],
    realWorldApplications: ['Gardening', 'Agriculture', 'Food sources'],
  },
  {
    id: 'p4-sci-animals',
    name: 'Animals and Their Characteristics',
    subject: 'SCIENCE',
    gradeLevel: 'P4',
    strand: 'diversity',
    unit: 'Animals',
    description: 'Animal groups, characteristics, and diversity.',
    learningObjectives: [
      { id: 'p4-ani-1', description: 'Classify animals into groups (mammals, birds, fish, reptiles, amphibians, insects)', bloomsLevel: 'apply' },
      { id: 'p4-ani-2', description: 'Identify characteristics of each animal group', bloomsLevel: 'remember' },
      { id: 'p4-ani-3', description: 'Compare and contrast different animal groups', bloomsLevel: 'analyze' },
    ],
    prerequisites: ['p4-sci-classification'],
    keyVocabulary: ['mammals', 'birds', 'fish', 'reptiles', 'amphibians', 'insects', 'vertebrates', 'invertebrates'],
    estimatedLessons: 10,
    puzzleTypes: ['animal-classification', 'characteristic-matching', 'animal-comparison'],
    realWorldApplications: ['Wildlife conservation', 'Pet care', 'Biodiversity'],
  },

  // CYCLES
  {
    id: 'p4-sci-life-cycles',
    name: 'Life Cycles',
    subject: 'SCIENCE',
    gradeLevel: 'P4',
    strand: 'cycles',
    unit: 'Life Cycles',
    description: 'Life cycles of plants and animals.',
    learningObjectives: [
      { id: 'p4-lc-1', description: 'Describe stages in plant life cycles', bloomsLevel: 'understand' },
      { id: 'p4-lc-2', description: 'Describe stages in animal life cycles', bloomsLevel: 'understand' },
      { id: 'p4-lc-3', description: 'Compare life cycles of different organisms', bloomsLevel: 'analyze' },
      { id: 'p4-lc-4', description: 'Identify organisms that undergo metamorphosis', bloomsLevel: 'remember' },
    ],
    prerequisites: ['p4-sci-plants', 'p4-sci-animals'],
    keyVocabulary: ['life cycle', 'seed', 'germination', 'larva', 'pupa', 'metamorphosis', 'reproduction'],
    estimatedLessons: 10,
    puzzleTypes: ['life-cycle-sequencing', 'stage-identification', 'metamorphosis-comparison'],
    realWorldApplications: ['Farming', 'Pest control', 'Breeding programs'],
  },
  {
    id: 'p4-sci-matter',
    name: 'Matter',
    subject: 'SCIENCE',
    gradeLevel: 'P4',
    strand: 'cycles',
    unit: 'Matter',
    description: 'States of matter and their properties.',
    learningObjectives: [
      { id: 'p4-mat-1', description: 'Identify three states of matter (solid, liquid, gas)', bloomsLevel: 'remember' },
      { id: 'p4-mat-2', description: 'Describe properties of solids, liquids, and gases', bloomsLevel: 'understand' },
      { id: 'p4-mat-3', description: 'Describe changes of state (melting, freezing, boiling, condensation)', bloomsLevel: 'understand' },
    ],
    prerequisites: [],
    keyVocabulary: ['matter', 'solid', 'liquid', 'gas', 'melting', 'freezing', 'boiling', 'condensation', 'evaporation'],
    estimatedLessons: 8,
    puzzleTypes: ['state-identification', 'property-matching', 'state-change'],
    realWorldApplications: ['Cooking', 'Weather', 'Manufacturing'],
  },

  // ENERGY
  {
    id: 'p4-sci-heat',
    name: 'Heat Energy',
    subject: 'SCIENCE',
    gradeLevel: 'P4',
    strand: 'energy',
    unit: 'Heat',
    description: 'Heat as a form of energy, conductors and insulators.',
    learningObjectives: [
      { id: 'p4-ht-1', description: 'Identify heat as a form of energy', bloomsLevel: 'remember' },
      { id: 'p4-ht-2', description: 'Describe effects of heat on matter', bloomsLevel: 'understand' },
      { id: 'p4-ht-3', description: 'Identify good conductors and poor conductors of heat', bloomsLevel: 'apply' },
      { id: 'p4-ht-4', description: 'Explain practical applications of conductors and insulators', bloomsLevel: 'analyze' },
    ],
    prerequisites: ['p4-sci-matter'],
    keyVocabulary: ['heat', 'temperature', 'conductor', 'insulator', 'thermal energy', 'expand', 'contract'],
    estimatedLessons: 8,
    puzzleTypes: ['conductor-insulator', 'heat-effect', 'material-selection'],
    realWorldApplications: ['Cooking utensils', 'Building insulation', 'Clothing'],
  },
  {
    id: 'p4-sci-light',
    name: 'Light Energy',
    subject: 'SCIENCE',
    gradeLevel: 'P4',
    strand: 'energy',
    unit: 'Light',
    description: 'Light as energy, shadows, reflection.',
    learningObjectives: [
      { id: 'p4-lt-1', description: 'Identify light as a form of energy', bloomsLevel: 'remember' },
      { id: 'p4-lt-2', description: 'Identify sources of light', bloomsLevel: 'remember' },
      { id: 'p4-lt-3', description: 'Explain how shadows are formed', bloomsLevel: 'understand' },
      { id: 'p4-lt-4', description: 'Describe reflection of light', bloomsLevel: 'understand' },
    ],
    prerequisites: [],
    keyVocabulary: ['light', 'shadow', 'reflection', 'opaque', 'translucent', 'transparent', 'luminous'],
    estimatedLessons: 8,
    puzzleTypes: ['shadow-formation', 'material-classification', 'light-reflection'],
    realWorldApplications: ['Photography', 'Mirrors', 'Day/night'],
  },
];

// ============================================
// PRIMARY 5 SCIENCE SYLLABUS
// ============================================

export const p5ScienceTopics: SyllabusTopic[] = [
  // SYSTEMS
  {
    id: 'p5-sci-plant-systems',
    name: 'Plant Transport System',
    subject: 'SCIENCE',
    gradeLevel: 'P5',
    strand: 'systems',
    unit: 'Plant Systems',
    description: 'How plants transport water and nutrients.',
    learningObjectives: [
      { id: 'p5-pts-1', description: 'Describe how water is transported in plants', bloomsLevel: 'understand' },
      { id: 'p5-pts-2', description: 'Explain the process of photosynthesis', bloomsLevel: 'understand' },
      { id: 'p5-pts-3', description: 'Identify what plants need to make food', bloomsLevel: 'remember' },
    ],
    prerequisites: ['p4-sci-plants'],
    keyVocabulary: ['transport', 'xylem', 'photosynthesis', 'chlorophyll', 'carbon dioxide', 'glucose', 'oxygen'],
    estimatedLessons: 8,
    puzzleTypes: ['process-sequencing', 'photosynthesis-equation', 'transport-explanation'],
    realWorldApplications: ['Agriculture', 'Forestry', 'Plant care'],
  },
  {
    id: 'p5-sci-human-respiratory',
    name: 'Human Respiratory System',
    subject: 'SCIENCE',
    gradeLevel: 'P5',
    strand: 'systems',
    unit: 'Human Body Systems',
    description: 'The respiratory system and breathing.',
    learningObjectives: [
      { id: 'p5-resp-1', description: 'Identify parts of the respiratory system', bloomsLevel: 'remember' },
      { id: 'p5-resp-2', description: 'Describe the function of each part', bloomsLevel: 'understand' },
      { id: 'p5-resp-3', description: 'Explain the process of breathing', bloomsLevel: 'understand' },
      { id: 'p5-resp-4', description: 'Describe how to keep the respiratory system healthy', bloomsLevel: 'apply' },
    ],
    prerequisites: ['p4-sci-animals'],
    keyVocabulary: ['respiratory', 'lungs', 'trachea', 'diaphragm', 'inhale', 'exhale', 'oxygen', 'carbon dioxide'],
    estimatedLessons: 8,
    puzzleTypes: ['organ-identification', 'breathing-process', 'health-habits'],
    realWorldApplications: ['Exercise', 'Smoking dangers', 'Air quality'],
  },
  {
    id: 'p5-sci-human-circulatory',
    name: 'Human Circulatory System',
    subject: 'SCIENCE',
    gradeLevel: 'P5',
    strand: 'systems',
    unit: 'Human Body Systems',
    description: 'The circulatory system and blood flow.',
    learningObjectives: [
      { id: 'p5-circ-1', description: 'Identify parts of the circulatory system', bloomsLevel: 'remember' },
      { id: 'p5-circ-2', description: 'Describe the function of the heart', bloomsLevel: 'understand' },
      { id: 'p5-circ-3', description: 'Trace the path of blood flow', bloomsLevel: 'understand' },
      { id: 'p5-circ-4', description: 'Explain the role of blood components', bloomsLevel: 'understand' },
    ],
    prerequisites: ['p5-sci-human-respiratory'],
    keyVocabulary: ['heart', 'blood', 'arteries', 'veins', 'capillaries', 'red blood cells', 'white blood cells', 'platelets'],
    estimatedLessons: 10,
    puzzleTypes: ['blood-flow-path', 'organ-function', 'component-role'],
    realWorldApplications: ['Heart health', 'Blood donation', 'Exercise benefits'],
  },
  // NOTE: Cells topic REMOVED from P5 as of 2025 syllabus revision
  // Cell concepts are now integrated into Plant and Animal Reproduction topics

  // CYCLES
  {
    id: 'p5-sci-water-cycle',
    name: 'Water Cycle',
    subject: 'SCIENCE',
    gradeLevel: 'P5',
    strand: 'cycles',
    unit: 'Water Cycle',
    description: 'The continuous movement of water in nature.',
    learningObjectives: [
      { id: 'p5-wc-1', description: 'Describe the stages of the water cycle', bloomsLevel: 'understand' },
      { id: 'p5-wc-2', description: 'Explain evaporation, condensation, and precipitation', bloomsLevel: 'understand' },
      { id: 'p5-wc-3', description: 'Relate the water cycle to weather', bloomsLevel: 'analyze' },
    ],
    prerequisites: ['p4-sci-matter'],
    keyVocabulary: ['evaporation', 'condensation', 'precipitation', 'water vapour', 'clouds', 'rain'],
    estimatedLessons: 6,
    puzzleTypes: ['cycle-sequencing', 'process-explanation', 'weather-connection'],
    realWorldApplications: ['Weather forecasting', 'Water conservation', 'Climate'],
  },
  {
    id: 'p5-sci-reproduction-plants',
    name: 'Plant Reproduction',
    subject: 'SCIENCE',
    gradeLevel: 'P5',
    strand: 'cycles',
    unit: 'Reproduction',
    description: 'How flowering plants reproduce.',
    learningObjectives: [
      { id: 'p5-rp-1', description: 'Identify parts of a flower', bloomsLevel: 'remember' },
      { id: 'p5-rp-2', description: 'Describe the process of pollination', bloomsLevel: 'understand' },
      { id: 'p5-rp-3', description: 'Describe the process of fertilisation', bloomsLevel: 'understand' },
      { id: 'p5-rp-4', description: 'Explain seed dispersal methods', bloomsLevel: 'understand' },
    ],
    prerequisites: ['p4-sci-life-cycles', 'p4-sci-plants'],
    keyVocabulary: ['stamen', 'pistil', 'pollen', 'pollination', 'fertilisation', 'seed dispersal', 'fruit'],
    estimatedLessons: 10,
    puzzleTypes: ['flower-parts', 'pollination-process', 'dispersal-methods'],
    realWorldApplications: ['Agriculture', 'Gardening', 'Food production'],
  },
  {
    id: 'p5-sci-reproduction-humans',
    name: 'Human Reproduction',
    subject: 'SCIENCE',
    gradeLevel: 'P5',
    strand: 'cycles',
    unit: 'Reproduction',
    description: 'Human life cycle and reproduction basics.',
    learningObjectives: [
      { id: 'p5-rh-1', description: 'Describe stages of human development', bloomsLevel: 'understand' },
      { id: 'p5-rh-2', description: 'Identify changes during puberty', bloomsLevel: 'remember' },
    ],
    prerequisites: ['p4-sci-life-cycles'],
    keyVocabulary: ['reproduction', 'puberty', 'development', 'life cycle'],
    estimatedLessons: 4,
    puzzleTypes: ['life-stage-sequencing', 'development-identification'],
    realWorldApplications: ['Health education', 'Personal development'],
  },

  // ENERGY
  {
    id: 'p5-sci-electrical',
    name: 'Electrical System',
    subject: 'SCIENCE',
    gradeLevel: 'P5',
    strand: 'systems',
    unit: 'Electricity',
    description: 'Electrical circuits and conductors.',
    learningObjectives: [
      { id: 'p5-elec-1', description: 'Identify components of a simple circuit', bloomsLevel: 'remember' },
      { id: 'p5-elec-2', description: 'Draw and build simple electrical circuits', bloomsLevel: 'apply' },
      { id: 'p5-elec-3', description: 'Identify electrical conductors and insulators', bloomsLevel: 'apply' },
      { id: 'p5-elec-4', description: 'Explain series and parallel circuits', bloomsLevel: 'understand' },
    ],
    prerequisites: [],
    keyVocabulary: ['circuit', 'battery', 'bulb', 'switch', 'conductor', 'insulator', 'series', 'parallel'],
    estimatedLessons: 10,
    puzzleTypes: ['circuit-building', 'conductor-identification', 'circuit-analysis'],
    realWorldApplications: ['Home wiring', 'Electronics', 'Electrical safety'],
  },
];

// ============================================
// PRIMARY 6 SCIENCE SYLLABUS
// ============================================

export const p6ScienceTopics: SyllabusTopic[] = [
  // ENERGY
  {
    id: 'p6-sci-energy-forms',
    name: 'Forms and Uses of Energy',
    subject: 'SCIENCE',
    gradeLevel: 'P6',
    strand: 'energy',
    unit: 'Energy',
    description: 'Different forms of energy and energy conversion.',
    learningObjectives: [
      { id: 'p6-ef-1', description: 'Identify different forms of energy', bloomsLevel: 'remember' },
      { id: 'p6-ef-2', description: 'Describe energy conversion', bloomsLevel: 'understand' },
      { id: 'p6-ef-3', description: 'Explain that energy cannot be created or destroyed', bloomsLevel: 'understand' },
    ],
    prerequisites: ['p4-sci-heat', 'p4-sci-light', 'p5-sci-electrical'],
    keyVocabulary: ['kinetic energy', 'potential energy', 'light energy', 'heat energy', 'sound energy', 'electrical energy', 'conversion'],
    estimatedLessons: 8,
    puzzleTypes: ['energy-identification', 'conversion-chain', 'energy-trace'],
    realWorldApplications: ['Power plants', 'Renewable energy', 'Energy saving'],
  },

  // INTERACTIONS
  {
    id: 'p6-sci-forces',
    name: 'Forces',
    subject: 'SCIENCE',
    gradeLevel: 'P6',
    strand: 'interactions',
    unit: 'Forces',
    description: 'Types of forces and their effects.',
    learningObjectives: [
      { id: 'p6-frc-1', description: 'Identify different types of forces', bloomsLevel: 'remember' },
      { id: 'p6-frc-2', description: 'Describe effects of forces on objects', bloomsLevel: 'understand' },
      { id: 'p6-frc-3', description: 'Identify factors affecting friction', bloomsLevel: 'analyze' },
      { id: 'p6-frc-4', description: 'Describe magnetic force and its uses', bloomsLevel: 'understand' },
    ],
    prerequisites: [],
    // NOTE: As of 2025, specific terms like 'air resistance' and 'water resistance' are no longer required
    keyVocabulary: ['force', 'gravity', 'friction', 'magnetic force', 'push', 'pull'],
    estimatedLessons: 10,
    puzzleTypes: ['force-identification', 'friction-factors', 'magnetic-application'],
    realWorldApplications: ['Sports', 'Machines', 'Transportation'],
  },

  // INTERACTIONS (Environment)
  {
    id: 'p6-sci-adaptations',
    name: 'Adaptations',
    subject: 'SCIENCE',
    gradeLevel: 'P6',
    strand: 'interactions',
    unit: 'Adaptations',
    description: 'How living things adapt to their environment.',
    learningObjectives: [
      { id: 'p6-adp-1', description: 'Identify structural adaptations', bloomsLevel: 'remember' },
      { id: 'p6-adp-2', description: 'Identify behavioural adaptations', bloomsLevel: 'remember' },
      { id: 'p6-adp-3', description: 'Explain how adaptations help survival', bloomsLevel: 'understand' },
      { id: 'p6-adp-4', description: 'Compare adaptations of organisms in different habitats', bloomsLevel: 'analyze' },
    ],
    prerequisites: ['p4-sci-plants', 'p4-sci-animals'],
    keyVocabulary: ['adaptation', 'structural', 'behavioural', 'habitat', 'survival', 'camouflage', 'mimicry'],
    estimatedLessons: 10,
    puzzleTypes: ['adaptation-matching', 'habitat-organism', 'survival-explanation'],
    realWorldApplications: ['Conservation', 'Biomimicry', 'Evolution'],
  },
  {
    id: 'p6-sci-food-chains',
    name: 'Food Chains and Food Webs',
    subject: 'SCIENCE',
    gradeLevel: 'P6',
    strand: 'interactions',
    unit: 'Food Relationships',
    description: 'Energy flow in ecosystems through food chains and webs.',
    learningObjectives: [
      { id: 'p6-fc-1', description: 'Construct food chains', bloomsLevel: 'apply' },
      { id: 'p6-fc-2', description: 'Identify producers, consumers, decomposers', bloomsLevel: 'remember' },
      { id: 'p6-fc-3', description: 'Interpret food webs', bloomsLevel: 'analyze' },
      { id: 'p6-fc-4', description: 'Predict effects of population changes', bloomsLevel: 'evaluate' },
    ],
    prerequisites: ['p4-sci-plants', 'p4-sci-animals'],
    keyVocabulary: ['food chain', 'food web', 'producer', 'consumer', 'decomposer', 'predator', 'prey', 'herbivore', 'carnivore', 'omnivore'],
    estimatedLessons: 8,
    puzzleTypes: ['food-chain-construction', 'role-identification', 'population-prediction'],
    realWorldApplications: ['Ecosystem management', 'Conservation', 'Agriculture'],
  },
  {
    id: 'p6-sci-environment',
    name: 'Man\'s Impact on Environment',
    subject: 'SCIENCE',
    gradeLevel: 'P6',
    strand: 'interactions',
    unit: 'Environment',
    description: 'Human activities and their effects on the environment.',
    learningObjectives: [
      { id: 'p6-env-1', description: 'Identify ways humans affect the environment', bloomsLevel: 'remember' },
      { id: 'p6-env-2', description: 'Describe effects of pollution', bloomsLevel: 'understand' },
      { id: 'p6-env-3', description: 'Explain importance of conservation', bloomsLevel: 'understand' },
      { id: 'p6-env-4', description: 'Suggest ways to protect the environment', bloomsLevel: 'create' },
    ],
    prerequisites: ['p6-sci-food-chains'],
    keyVocabulary: ['pollution', 'deforestation', 'conservation', 'recycle', 'reduce', 'reuse', 'endangered', 'extinct'],
    estimatedLessons: 8,
    puzzleTypes: ['impact-identification', 'pollution-effects', 'conservation-solutions'],
    realWorldApplications: ['Environmental protection', 'Sustainability', 'Climate action'],
  },
];

// ============================================
// COMBINED SYLLABUS EXPORTS
// ============================================

export const allMathTopics: SyllabusTopic[] = [
  ...p4MathTopics,
  ...p5MathTopics,
  ...p6MathTopics,
];

export const allScienceTopics: SyllabusTopic[] = [
  ...p4ScienceTopics,
  ...p5ScienceTopics,
  ...p6ScienceTopics,
];

export const fullSyllabus: SyllabusTopic[] = [
  ...allMathTopics,
  ...allScienceTopics,
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getTopicsByGrade(gradeLevel: GradeLevel): SyllabusTopic[] {
  return fullSyllabus.filter(topic => topic.gradeLevel === gradeLevel);
}

export function getTopicsBySubject(subject: Subject): SyllabusTopic[] {
  return fullSyllabus.filter(topic => topic.subject === subject);
}

export function getTopicsByStrand(strand: string): SyllabusTopic[] {
  return fullSyllabus.filter(topic => topic.strand === strand);
}

export function getTopicById(topicId: string): SyllabusTopic | undefined {
  return fullSyllabus.find(topic => topic.id === topicId);
}

export function getPrerequisiteTopics(topicId: string): SyllabusTopic[] {
  const topic = getTopicById(topicId);
  if (!topic) return [];
  return topic.prerequisites.map(prereqId => getTopicById(prereqId)).filter((t): t is SyllabusTopic => t !== undefined);
}

export function getTopicsRequiringPrerequisite(topicId: string): SyllabusTopic[] {
  return fullSyllabus.filter(topic => topic.prerequisites.includes(topicId));
}

export function getSyllabusStats() {
  return {
    totalTopics: fullSyllabus.length,
    mathTopics: allMathTopics.length,
    scienceTopics: allScienceTopics.length,
    byGrade: {
      P4: getTopicsByGrade('P4').length,
      P5: getTopicsByGrade('P5').length,
      P6: getTopicsByGrade('P6').length,
    },
    totalLessons: fullSyllabus.reduce((sum, topic) => sum + topic.estimatedLessons, 0),
  };
}
