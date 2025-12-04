/**
 * CURRICULUM-ALIGNED PUZZLE GENERATORS
 *
 * Generates puzzles aligned to specific syllabus topics.
 * Each topic has one or more puzzle generators that create
 * unique problems with randomized values.
 */

import { nanoid } from 'nanoid';
import { Puzzle, PuzzleComplexity } from './types';
import { SyllabusTopic, getTopicById } from './syllabus';

// Random helpers
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDecimal(min: number, max: number, decimals: number = 2): number {
  return Number((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Context data for Singapore setting
const singaporeContext = {
  names: ['Wei Ming', 'Priya', 'Ahmad', 'Sarah', 'Jia Hui', 'Ravi', 'Siti', 'Marcus', 'Mei Lin', 'Darren', 'Aisha', 'Kumar'],
  places: ['Tampines', 'Jurong East', 'Bedok', 'Clementi', 'Ang Mo Kio', 'Bishan', 'Woodlands', 'Punggol', 'Sengkang'],
  schools: ['Sunrise Primary', 'Beacon Primary', 'Greenview Secondary', 'Riverside Primary', 'Lakeside Primary'],
  shops: ['Happy Mart', 'Fresh Grocer', 'Best Electronics', 'Value Store', 'Lucky Supermarket'],
  foods: ['chicken rice', 'nasi lemak', 'laksa', 'mee goreng', 'roti prata'],
  currencies: ['$'],
};

// ============================================
// PUZZLE GENERATOR INTERFACE
// ============================================

interface TopicPuzzleGenerator {
  topicId: string;
  generate: (complexity: PuzzleComplexity) => GeneratedPuzzleContent;
}

interface GeneratedPuzzleContent {
  question: string;
  answer: string;
  hint: string;
  type: 'math' | 'logic' | 'observation' | 'deduction';
  learningObjectivesCovered?: string[];
}

// ============================================
// P4 MATH PUZZLE GENERATORS
// ============================================

const p4MathGenerators: TopicPuzzleGenerator[] = [
  // WHOLE NUMBERS
  {
    topicId: 'p4-math-whole-numbers',
    generate: (complexity) => {
      const scenarios = [
        // Place value scenario
        () => {
          const num = randomInt(10000, 99999);
          const digitPosition = randomChoice(['ten thousands', 'thousands', 'hundreds', 'tens', 'ones']);
          const digitValues: Record<string, number> = {
            'ten thousands': Math.floor(num / 10000) % 10,
            'thousands': Math.floor(num / 1000) % 10,
            'hundreds': Math.floor(num / 100) % 10,
            'tens': Math.floor(num / 10) % 10,
            'ones': num % 10,
          };
          return {
            question: `Detective ${randomChoice(singaporeContext.names)} found a secret code: ${num.toLocaleString()}\n\nThe criminal's hideout number is the digit in the ${digitPosition} place.\nWhat is the hideout number?`,
            answer: `The digit in the ${digitPosition} place of ${num.toLocaleString()} is ${digitValues[digitPosition]}.`,
            hint: 'Remember place values from right to left: ones, tens, hundreds, thousands, ten thousands.',
            learningObjectivesCovered: ['p4-wn-2'],
          };
        },
        // Comparison scenario
        () => {
          const nums = [randomInt(50000, 99999), randomInt(50000, 99999), randomInt(50000, 99999)];
          const suspects = shuffleArray([...singaporeContext.names]).slice(0, 3);
          return {
            question: `Three suspects stole different amounts:\n- ${suspects[0]}: $${nums[0].toLocaleString()}\n- ${suspects[1]}: $${nums[1].toLocaleString()}\n- ${suspects[2]}: $${nums[2].toLocaleString()}\n\nArrange them from least to most stolen.`,
            answer: `Arranged from least to most:\n${[...nums].sort((a, b) => a - b).map((n, i) => `${i + 1}. $${n.toLocaleString()} (${suspects[nums.indexOf(n)]})`).join('\n')}`,
            hint: 'Compare the leftmost digits first. If they are the same, move to the next digit.',
            learningObjectivesCovered: ['p4-wn-3'],
          };
        },
        // Rounding scenario
        () => {
          const num = randomInt(1000, 50000);
          const roundTo = randomChoice([10, 100, 1000]);
          const rounded = Math.round(num / roundTo) * roundTo;
          return {
            question: `A witness estimated the stolen amount was about $${rounded.toLocaleString()} (rounded to the nearest ${roundTo}).\n\nIf the exact amount was $${num.toLocaleString()}, was the witness's estimate correct?\nWhat should the correct estimate be?`,
            answer: `$${num.toLocaleString()} rounded to nearest ${roundTo} = $${rounded.toLocaleString()}.\n${rounded === Math.round(num / roundTo) * roundTo ? 'The witness was CORRECT.' : 'The witness was INCORRECT.'}`,
            hint: `Look at the digit to the right of the ${roundTo}s place. If it's 5 or more, round up.`,
            learningObjectivesCovered: ['p4-wn-4'],
          };
        },
      ];
      const scenario = randomChoice(scenarios)();
      return { ...scenario, type: 'math' as const };
    },
  },

  // MULTIPLICATION AND DIVISION
  {
    topicId: 'p4-math-multiplication',
    generate: (complexity) => {
      const scenarios = [
        // Shopping calculation
        () => {
          const items = randomChoice(['notebooks', 'pens', 'erasers', 'rulers', 'markers']);
          const quantity = randomInt(12, complexity === 'EXPERT' ? 150 : 50);
          const price = randomDecimal(2, 15, 2);
          const total = quantity * price;
          const name = randomChoice(singaporeContext.names);
          return {
            question: `${name} bought ${quantity} ${items} for the investigation.\nEach ${items.slice(0, -1)} costs $${price.toFixed(2)}.\n\nHow much did ${name} spend in total?`,
            answer: `${quantity} × $${price.toFixed(2)} = $${total.toFixed(2)}`,
            hint: 'Multiply the quantity by the price per item.',
            learningObjectivesCovered: ['p4-mul-1', 'p4-mul-5'],
          };
        },
        // Equal sharing
        () => {
          const total = randomInt(100, 500);
          const groups = randomChoice([4, 5, 6, 8]);
          const each = Math.floor(total / groups);
          const remainder = total % groups;
          return {
            question: `The detective team needs to search ${total} houses.\n${groups} officers will share the work equally.\n\nHow many houses will each officer search?\nWill there be any houses left over?`,
            answer: `${total} ÷ ${groups} = ${each} remainder ${remainder}\nEach officer searches ${each} houses.\n${remainder > 0 ? `${remainder} house(s) left over.` : 'No houses left over.'}`,
            hint: 'Divide the total by the number of groups. The remainder is what cannot be shared equally.',
            learningObjectivesCovered: ['p4-div-1', 'p4-div-2'],
          };
        },
        // 2-digit by 2-digit
        () => {
          const a = randomInt(15, 35);
          const b = randomInt(12, 25);
          const place = randomChoice(singaporeContext.places);
          return {
            question: `In ${place}, each block has ${a} floors.\nEach floor has ${b} apartments.\n\nHow many apartments are in one block?`,
            answer: `${a} × ${b} = ${a * b} apartments`,
            hint: 'Break down the multiplication: multiply by ones first, then by tens, then add.',
            learningObjectivesCovered: ['p4-mul-3'],
          };
        },
      ];
      const scenario = randomChoice(scenarios)();
      return { ...scenario, type: 'math' as const };
    },
  },

  // FACTORS AND MULTIPLES
  {
    topicId: 'p4-math-factors-multiples',
    generate: (complexity) => {
      const scenarios = [
        // Finding factors
        () => {
          const num = randomChoice([24, 36, 48, 60, 72]);
          const factors = [];
          for (let i = 1; i <= num; i++) {
            if (num % i === 0) factors.push(i);
          }
          return {
            question: `A locker combination uses a factor of ${num}.\nThe suspect tried ${randomChoice(factors)} and got in!\n\nList ALL the factors of ${num} that could be the combination.`,
            answer: `Factors of ${num}: ${factors.join(', ')}\nTotal: ${factors.length} possible combinations.`,
            hint: 'A factor is a number that divides evenly into another number with no remainder.',
            learningObjectivesCovered: ['p4-fm-1'],
          };
        },
        // Common factors
        () => {
          const num1 = randomChoice([12, 18, 24, 30]);
          const num2 = randomChoice([16, 20, 24, 36]);
          const factors1 = [];
          const factors2 = [];
          for (let i = 1; i <= Math.max(num1, num2); i++) {
            if (num1 % i === 0) factors1.push(i);
            if (num2 % i === 0) factors2.push(i);
          }
          const common = factors1.filter(f => factors2.includes(f));
          return {
            question: `Two safes have codes that are common factors of ${num1} and ${num2}.\n\nFind all possible codes (common factors).`,
            answer: `Factors of ${num1}: ${factors1.join(', ')}\nFactors of ${num2}: ${factors2.join(', ')}\nCommon factors: ${common.join(', ')}`,
            hint: 'Find factors of each number first, then identify which ones appear in both lists.',
            learningObjectivesCovered: ['p4-fm-2'],
          };
        },
        // Multiples
        () => {
          const num = randomChoice([3, 4, 5, 6, 7, 8]);
          const multiples = [];
          for (let i = 1; i <= 10; i++) {
            multiples.push(num * i);
          }
          const target = randomChoice(multiples);
          return {
            question: `The thief's hideout number is a multiple of ${num}.\nThe detective knows it's between ${Math.floor(target * 0.8)} and ${Math.ceil(target * 1.2)}.\n\nWhat are all possible hideout numbers in this range?`,
            answer: `Multiples of ${num} in range: ${multiples.filter(m => m >= Math.floor(target * 0.8) && m <= Math.ceil(target * 1.2)).join(', ')}`,
            hint: 'Multiples of a number are what you get when you multiply that number by 1, 2, 3, etc.',
            learningObjectivesCovered: ['p4-fm-3'],
          };
        },
      ];
      const scenario = randomChoice(scenarios)();
      return { ...scenario, type: 'math' as const };
    },
  },

  // FRACTIONS
  {
    topicId: 'p4-math-fractions',
    generate: (complexity) => {
      const scenarios = [
        // Equivalent fractions
        () => {
          const originalNum = randomInt(1, 5);
          const originalDen = randomInt(originalNum + 1, 8);
          const multiplier = randomInt(2, 4);
          return {
            question: `A suspect left ${originalNum}/${originalDen} of a pizza at the crime scene.\nAnother witness said ${originalNum * multiplier}/${originalDen * multiplier} of the pizza was left.\n\nAre both statements saying the same thing? Explain.`,
            answer: `${originalNum}/${originalDen} = ${originalNum * multiplier}/${originalDen * multiplier} (multiply both by ${multiplier})\nYes, they are equivalent fractions - both describe the same amount!`,
            hint: 'Equivalent fractions represent the same value. Multiply/divide both numerator and denominator by the same number.',
            learningObjectivesCovered: ['p4-fr-1'],
          };
        },
        // Adding fractions
        () => {
          const den = randomChoice([4, 5, 6, 8]);
          const num1 = randomInt(1, den - 2);
          const num2 = randomInt(1, den - num1);
          return {
            question: `Detective Tan walked ${num1}/${den} km to the first witness.\nThen walked ${num2}/${den} km to the second witness.\n\nHow far did Detective Tan walk in total?`,
            answer: `${num1}/${den} + ${num2}/${den} = ${num1 + num2}/${den} km`,
            hint: 'When denominators are the same, just add the numerators and keep the denominator.',
            learningObjectivesCovered: ['p4-fr-4'],
          };
        },
        // Different denominators
        () => {
          const pairs = [[2, 4], [3, 6], [2, 6], [4, 8], [3, 9]];
          const [den1, den2] = randomChoice(pairs);
          const num1 = randomInt(1, den1 - 1);
          const num2 = randomInt(1, den2 - 1);
          const commonDen = Math.max(den1, den2);
          const newNum1 = num1 * (commonDen / den1);
          const newNum2 = num2 * (commonDen / den2);
          return {
            question: `Evidence Room A is ${num1}/${den1} full.\nEvidence Room B is ${num2}/${den2} full.\n\nWhat fraction of space is used in total?`,
            answer: `${num1}/${den1} = ${newNum1}/${commonDen}\n${num2}/${den2} = ${newNum2}/${commonDen}\nTotal: ${newNum1}/${commonDen} + ${newNum2}/${commonDen} = ${newNum1 + newNum2}/${commonDen}`,
            hint: 'First convert to equivalent fractions with the same denominator, then add.',
            learningObjectivesCovered: ['p4-fr-5'],
          };
        },
      ];
      const scenario = randomChoice(scenarios)();
      return { ...scenario, type: 'math' as const };
    },
  },

  // TIME
  {
    topicId: 'p4-math-time',
    generate: (complexity) => {
      const scenarios = [
        // 24-hour conversion
        () => {
          const hour12 = randomInt(1, 12);
          const minute = randomInt(0, 59);
          const isPM = Math.random() > 0.5;
          const hour24 = isPM ? (hour12 === 12 ? 12 : hour12 + 12) : (hour12 === 12 ? 0 : hour12);
          return {
            question: `A security camera recorded suspicious activity at ${hour12}:${minute.toString().padStart(2, '0')} ${isPM ? 'p.m.' : 'a.m.'}\n\nWrite this time in 24-hour notation.`,
            answer: `${hour12}:${minute.toString().padStart(2, '0')} ${isPM ? 'p.m.' : 'a.m.'} = ${hour24.toString().padStart(2, '0')}${minute.toString().padStart(2, '0')} (24-hour)`,
            hint: 'For p.m. times (except 12 p.m.), add 12 to the hour. For a.m. times, keep the hour (12 a.m. = 0000).',
            learningObjectivesCovered: ['p4-time-1', 'p4-time-2'],
          };
        },
        // Duration calculation
        () => {
          const startHour = randomInt(8, 14);
          const startMin = randomInt(0, 55);
          const durationHours = randomInt(1, 4);
          const durationMins = randomInt(10, 50);
          const endMins = startMin + durationMins;
          const endHour = startHour + durationHours + Math.floor(endMins / 60);
          const endMinFinal = endMins % 60;
          const name = randomChoice(singaporeContext.names);
          return {
            question: `${name} started investigating at ${startHour.toString().padStart(2, '0')}${startMin.toString().padStart(2, '0')}.\nThe investigation took ${durationHours} hour(s) and ${durationMins} minutes.\n\nWhat time did ${name} finish?`,
            answer: `Start: ${startHour.toString().padStart(2, '0')}${startMin.toString().padStart(2, '0')}\nDuration: ${durationHours}h ${durationMins}min\nEnd: ${endHour.toString().padStart(2, '0')}${endMinFinal.toString().padStart(2, '0')}`,
            hint: 'Add hours first, then add minutes. If minutes exceed 60, convert to hours.',
            learningObjectivesCovered: ['p4-time-3', 'p4-time-4'],
          };
        },
      ];
      const scenario = randomChoice(scenarios)();
      return { ...scenario, type: 'math' as const };
    },
  },

  // AREA AND PERIMETER
  {
    topicId: 'p4-math-area-perimeter',
    generate: (complexity) => {
      const scenarios = [
        // Rectangle perimeter
        () => {
          const length = randomInt(8, 25);
          const width = randomInt(5, length - 2);
          const perimeter = 2 * (length + width);
          return {
            question: `A crime scene is a rectangle ${length} m by ${width} m.\nDetectives need to put tape around the entire area.\n\nHow many meters of tape do they need?`,
            answer: `Perimeter = 2 × (${length} + ${width}) = 2 × ${length + width} = ${perimeter} m`,
            hint: 'Perimeter of rectangle = 2 × (length + width)',
            learningObjectivesCovered: ['p4-ap-1'],
          };
        },
        // Rectangle area
        () => {
          const length = randomInt(10, 30);
          const width = randomInt(6, 20);
          const area = length * width;
          return {
            question: `A warehouse floor is ${length} m by ${width} m.\nInvestigators need to search every square meter.\n\nHow many square meters need to be searched?`,
            answer: `Area = ${length} × ${width} = ${area} m²`,
            hint: 'Area of rectangle = length × width',
            learningObjectivesCovered: ['p4-ap-2'],
          };
        },
        // Composite figure
        () => {
          const l1 = randomInt(8, 15);
          const w1 = randomInt(4, 8);
          const l2 = randomInt(4, 8);
          const w2 = randomInt(3, 6);
          const area = (l1 * w1) + (l2 * w2);
          return {
            question: `A crime scene has an L-shape:\n- Main room: ${l1} m × ${w1} m\n- Extension: ${l2} m × ${w2} m\n\nWhat is the total area of the crime scene?`,
            answer: `Main room: ${l1} × ${w1} = ${l1 * w1} m²\nExtension: ${l2} × ${w2} = ${l2 * w2} m²\nTotal: ${l1 * w1} + ${l2 * w2} = ${area} m²`,
            hint: 'Break the L-shape into rectangles, find each area, then add them together.',
            learningObjectivesCovered: ['p4-ap-3', 'p4-ap-4'],
          };
        },
      ];
      const scenario = randomChoice(scenarios)();
      return { ...scenario, type: 'math' as const };
    },
  },
];

// ============================================
// P5 MATH PUZZLE GENERATORS
// ============================================

const p5MathGenerators: TopicPuzzleGenerator[] = [
  // RATIO
  {
    topicId: 'p5-math-ratio',
    generate: (complexity) => {
      const scenarios = [
        // Basic ratio
        () => {
          const r1 = randomInt(2, 5);
          const r2 = randomInt(2, 6);
          const totalParts = r1 + r2;
          const multiplier = randomInt(3, 10);
          const total = totalParts * multiplier;
          const names = shuffleArray([...singaporeContext.names]).slice(0, 2);
          return {
            question: `${names[0]} and ${names[1]} shared $${total} in the ratio ${r1}:${r2}.\n\nHow much did each person receive?`,
            answer: `Total parts: ${r1} + ${r2} = ${totalParts}\nValue of 1 part: $${total} ÷ ${totalParts} = $${multiplier}\n${names[0]}: ${r1} × $${multiplier} = $${r1 * multiplier}\n${names[1]}: ${r2} × $${multiplier} = $${r2 * multiplier}`,
            hint: 'Find the total parts, then find the value of one part by dividing.',
            learningObjectivesCovered: ['p5-rat-1', 'p5-rat-4'],
          };
        },
        // Equivalent ratios
        () => {
          const r1 = randomInt(2, 4);
          const r2 = randomInt(3, 6);
          const mult = randomInt(3, 8);
          return {
            question: `A recipe uses flour and sugar in ratio ${r1}:${r2}.\nIf ${r1 * mult} cups of flour are used, how many cups of sugar are needed?`,
            answer: `Flour:Sugar = ${r1}:${r2}\nIf flour = ${r1 * mult}, then multiplier = ${r1 * mult}/${r1} = ${mult}\nSugar = ${r2} × ${mult} = ${r2 * mult} cups`,
            hint: 'Find what number you multiply the first ratio value by to get the given amount.',
            learningObjectivesCovered: ['p5-rat-2', 'p5-rat-4'],
          };
        },
      ];
      const scenario = randomChoice(scenarios)();
      return { ...scenario, type: 'math' as const };
    },
  },

  // PERCENTAGE
  {
    topicId: 'p5-math-percentage',
    generate: (complexity) => {
      const scenarios = [
        // Finding percentage of quantity
        () => {
          const percent = randomChoice([10, 15, 20, 25, 30, 40, 50]);
          const total = randomInt(80, 300);
          const result = (percent / 100) * total;
          return {
            question: `${percent}% of the ${total} items in a warehouse were stolen.\n\nHow many items were stolen?`,
            answer: `${percent}% of ${total} = ${percent}/100 × ${total} = ${result} items`,
            hint: 'To find a percentage of a number, convert the percentage to a decimal (divide by 100) and multiply.',
            learningObjectivesCovered: ['p5-per-3'],
          };
        },
        // Discount
        () => {
          const original = randomInt(50, 200);
          const discount = randomChoice([10, 15, 20, 25, 30]);
          const discountAmount = (discount / 100) * original;
          const final = original - discountAmount;
          const shop = randomChoice(singaporeContext.shops);
          return {
            question: `${shop} has a ${discount}% discount on a $${original} item.\n\nHow much do you pay after the discount?`,
            answer: `Discount: ${discount}% of $${original} = $${discountAmount.toFixed(2)}\nFinal price: $${original} - $${discountAmount.toFixed(2)} = $${final.toFixed(2)}`,
            hint: 'First calculate the discount amount, then subtract from the original price.',
            learningObjectivesCovered: ['p5-per-4'],
          };
        },
      ];
      const scenario = randomChoice(scenarios)();
      return { ...scenario, type: 'math' as const };
    },
  },

  // VOLUME
  {
    topicId: 'p5-math-volume',
    generate: (complexity) => {
      const scenarios = [
        // Cuboid volume
        () => {
          const l = randomInt(5, 15);
          const w = randomInt(4, 12);
          const h = randomInt(3, 10);
          const volume = l * w * h;
          return {
            question: `A storage box is ${l} cm long, ${w} cm wide, and ${h} cm high.\n\nWhat is the volume of the box?`,
            answer: `Volume = length × width × height\n= ${l} × ${w} × ${h}\n= ${volume} cm³`,
            hint: 'Volume of a cuboid = length × width × height',
            learningObjectivesCovered: ['p5-vol-2'],
          };
        },
        // Cube volume
        () => {
          const side = randomInt(3, 10);
          const volume = side * side * side;
          return {
            question: `An evidence cube has sides of ${side} cm each.\n\nWhat is its volume?`,
            answer: `Volume = side × side × side\n= ${side} × ${side} × ${side}\n= ${volume} cm³`,
            hint: 'Volume of a cube = side × side × side',
            learningObjectivesCovered: ['p5-vol-1'],
          };
        },
      ];
      const scenario = randomChoice(scenarios)();
      return { ...scenario, type: 'math' as const };
    },
  },

  // AVERAGE
  {
    topicId: 'p5-math-average',
    generate: (complexity) => {
      const scenarios = [
        // Finding average
        () => {
          const count = randomInt(4, 6);
          const values = Array.from({ length: count }, () => randomInt(50, 100));
          const total = values.reduce((a, b) => a + b, 0);
          const average = total / count;
          return {
            question: `Detective scores for ${count} cases: ${values.join(', ')}\n\nWhat is the average score?`,
            answer: `Total: ${values.join(' + ')} = ${total}\nAverage: ${total} ÷ ${count} = ${average.toFixed(1)}`,
            hint: 'Average = Total sum ÷ Number of items',
            learningObjectivesCovered: ['p5-avg-1'],
          };
        },
        // Finding missing value
        () => {
          const average = randomInt(70, 90);
          const count = 5;
          const total = average * count;
          const known = Array.from({ length: count - 1 }, () => randomInt(60, 95));
          const knownSum = known.reduce((a, b) => a + b, 0);
          const missing = total - knownSum;
          return {
            question: `The average of 5 test scores is ${average}.\nFour scores are: ${known.join(', ')}\n\nWhat is the fifth score?`,
            answer: `Total needed: ${average} × 5 = ${total}\nSum of known: ${known.join(' + ')} = ${knownSum}\nMissing score: ${total} - ${knownSum} = ${missing}`,
            hint: 'Find the total (average × count), then subtract the known values.',
            learningObjectivesCovered: ['p5-avg-3'],
          };
        },
      ];
      const scenario = randomChoice(scenarios)();
      return { ...scenario, type: 'math' as const };
    },
  },
];

// ============================================
// P6 MATH PUZZLE GENERATORS
// ============================================

const p6MathGenerators: TopicPuzzleGenerator[] = [
  // ALGEBRA
  {
    topicId: 'p6-math-algebra',
    generate: (complexity) => {
      const scenarios = [
        // Simple equation
        () => {
          const answer = randomInt(5, 20);
          const coefficient = randomInt(2, 6);
          const constant = randomInt(10, 50);
          const result = coefficient * answer + constant;
          return {
            question: `The number of stolen items follows this pattern:\n${coefficient}x + ${constant} = ${result}\n\nFind the value of x (number of boxes).`,
            answer: `${coefficient}x + ${constant} = ${result}\n${coefficient}x = ${result} - ${constant}\n${coefficient}x = ${result - constant}\nx = ${result - constant} ÷ ${coefficient}\nx = ${answer}`,
            hint: 'Isolate x by moving constants to one side, then divide.',
            learningObjectivesCovered: ['p6-alg-4'],
          };
        },
        // Expression formation
        () => {
          const basePrice = randomInt(5, 15);
          const discount = randomInt(2, 5);
          const quantity = randomChoice(['n', 'x', 'y']);
          return {
            question: `A shop sells items at $${basePrice} each with $${discount} discount per item for bulk.\n\nWrite an expression for the total cost of ${quantity} items.`,
            answer: `Cost per item after discount: $${basePrice} - $${discount} = $${basePrice - discount}\nExpression: ${basePrice - discount}${quantity} or (${basePrice} - ${discount})${quantity}`,
            hint: 'First find the discounted price, then multiply by the variable.',
            learningObjectivesCovered: ['p6-alg-1', 'p6-alg-5'],
          };
        },
      ];
      const scenario = randomChoice(scenarios)();
      return { ...scenario, type: 'math' as const };
    },
  },

  // SPEED
  {
    topicId: 'p6-math-speed',
    generate: (complexity) => {
      const scenarios = [
        // Finding speed
        () => {
          const distance = randomInt(30, 150);
          const time = randomChoice([2, 3, 4, 5]);
          const speed = distance / time;
          return {
            question: `A suspect's car travelled ${distance} km in ${time} hours.\n\nWhat was the average speed?`,
            answer: `Speed = Distance ÷ Time\n= ${distance} km ÷ ${time} h\n= ${speed} km/h`,
            hint: 'Speed = Distance ÷ Time',
            learningObjectivesCovered: ['p6-spd-1'],
          };
        },
        // Finding distance
        () => {
          const speed = randomInt(40, 80);
          const time = randomDecimal(1.5, 4, 1);
          const distance = speed * time;
          return {
            question: `A police car travelled at ${speed} km/h for ${time} hours.\n\nHow far did it travel?`,
            answer: `Distance = Speed × Time\n= ${speed} km/h × ${time} h\n= ${distance} km`,
            hint: 'Distance = Speed × Time',
            learningObjectivesCovered: ['p6-spd-2'],
          };
        },
        // Finding time
        () => {
          const distance = randomInt(100, 300);
          const speed = randomInt(40, 80);
          const time = distance / speed;
          return {
            question: `A detective needs to travel ${distance} km at ${speed} km/h.\n\nHow long will the journey take?`,
            answer: `Time = Distance ÷ Speed\n= ${distance} km ÷ ${speed} km/h\n= ${time.toFixed(2)} hours`,
            hint: 'Time = Distance ÷ Speed',
            learningObjectivesCovered: ['p6-spd-3'],
          };
        },
      ];
      const scenario = randomChoice(scenarios)();
      return { ...scenario, type: 'math' as const };
    },
  },

  // CIRCLES
  {
    topicId: 'p6-math-circles',
    generate: (complexity) => {
      const scenarios = [
        // Circumference
        () => {
          const radius = randomInt(5, 15);
          const diameter = radius * 2;
          const circumference = 2 * Math.PI * radius;
          return {
            question: `A circular crime scene has radius ${radius} m.\n\nWhat is the circumference? (Use π = 3.14)`,
            answer: `Circumference = 2 × π × radius\n= 2 × 3.14 × ${radius}\n= ${(2 * 3.14 * radius).toFixed(2)} m`,
            hint: 'Circumference = 2 × π × radius OR π × diameter',
            learningObjectivesCovered: ['p6-cir-2'],
          };
        },
        // Area
        () => {
          const radius = randomInt(4, 12);
          const area = Math.PI * radius * radius;
          return {
            question: `A circular garden has radius ${radius} m.\n\nWhat is its area? (Use π = 3.14)`,
            answer: `Area = π × radius × radius\n= 3.14 × ${radius} × ${radius}\n= ${(3.14 * radius * radius).toFixed(2)} m²`,
            hint: 'Area of circle = π × r × r',
            learningObjectivesCovered: ['p6-cir-3'],
          };
        },
      ];
      const scenario = randomChoice(scenarios)();
      return { ...scenario, type: 'math' as const };
    },
  },
];

// ============================================
// SCIENCE PUZZLE GENERATORS
// ============================================

const scienceGenerators: TopicPuzzleGenerator[] = [
  // CLASSIFICATION
  {
    topicId: 'p4-sci-classification',
    generate: (complexity) => {
      const items = shuffleArray([
        { name: 'tree', living: true },
        { name: 'rock', living: false },
        { name: 'bird', living: true },
        { name: 'mushroom', living: true },
        { name: 'chair', living: false },
        { name: 'fish', living: true },
        { name: 'cloud', living: false },
        { name: 'bacteria', living: true },
      ]).slice(0, 6);

      return {
        question: `Classify these items found at the crime scene as LIVING or NON-LIVING:\n${items.map((i, idx) => `${idx + 1}. ${i.name}`).join('\n')}`,
        answer: `LIVING: ${items.filter(i => i.living).map(i => i.name).join(', ')}\nNON-LIVING: ${items.filter(i => !i.living).map(i => i.name).join(', ')}\n\nLiving things can grow, reproduce, respond to stimuli, and need food/energy.`,
        hint: 'Living things can grow, reproduce, and respond to their environment.',
        type: 'observation' as const,
        learningObjectivesCovered: ['p4-cls-1', 'p4-cls-2'],
      };
    },
  },

  // MATTER STATES
  {
    topicId: 'p4-sci-matter',
    generate: (complexity) => {
      const scenarios = [
        () => {
          const items = shuffleArray([
            { name: 'ice cube', state: 'solid' },
            { name: 'water', state: 'liquid' },
            { name: 'steam', state: 'gas' },
            { name: 'wood', state: 'solid' },
            { name: 'milk', state: 'liquid' },
            { name: 'oxygen', state: 'gas' },
          ]).slice(0, 5);

          return {
            question: `Identify the state of matter for each piece of evidence:\n${items.map((i, idx) => `${idx + 1}. ${i.name}`).join('\n')}`,
            answer: items.map(i => `${i.name}: ${i.state.toUpperCase()}`).join('\n'),
            hint: 'Solids have fixed shape and volume. Liquids have fixed volume but take container shape. Gases fill their container.',
            learningObjectivesCovered: ['p4-mat-1', 'p4-mat-2'],
          };
        },
        () => {
          const changes = [
            { process: 'Ice cream melting', from: 'solid', to: 'liquid', name: 'Melting' },
            { process: 'Water boiling', from: 'liquid', to: 'gas', name: 'Boiling/Evaporation' },
            { process: 'Dew forming', from: 'gas', to: 'liquid', name: 'Condensation' },
            { process: 'Frost forming', from: 'gas', to: 'solid', name: 'Deposition' },
          ];
          const change = randomChoice(changes);
          return {
            question: `At the crime scene, detectives observed: "${change.process}"\n\nWhat change of state is this? What states are involved?`,
            answer: `This is ${change.name}.\nState change: ${change.from.toUpperCase()} → ${change.to.toUpperCase()}`,
            hint: 'Think about what state the substance starts in and what it becomes.',
            learningObjectivesCovered: ['p4-mat-3'],
          };
        },
      ];
      const scenario = randomChoice(scenarios)();
      return { ...scenario, type: 'deduction' as const };
    },
  },

  // ELECTRICAL CIRCUITS
  {
    topicId: 'p5-sci-electrical',
    generate: (complexity) => {
      const scenarios = [
        () => {
          return {
            question: `A security alarm system stopped working. The circuit has:\n- Battery (working)\n- Buzzer\n- Switch (closed)\n- Wires\n\nThe bulb doesn't light. What could be wrong?`,
            answer: `Possible causes:\n1. Broken wire (circuit not complete)\n2. Dead battery (no energy source)\n3. Burned out buzzer\n4. Loose connection\n\nThe circuit needs a complete path for electricity to flow.`,
            hint: 'For a circuit to work, it needs: energy source, complete path, and working components.',
            learningObjectivesCovered: ['p5-elec-1', 'p5-elec-2'],
          };
        },
        () => {
          const materials = shuffleArray([
            { name: 'copper wire', conductor: true },
            { name: 'plastic ruler', conductor: false },
            { name: 'iron nail', conductor: true },
            { name: 'wooden stick', conductor: false },
            { name: 'aluminum foil', conductor: true },
            { name: 'rubber band', conductor: false },
          ]).slice(0, 5);

          return {
            question: `Which of these evidence items can conduct electricity?\n${materials.map((m, i) => `${i + 1}. ${m.name}`).join('\n')}`,
            answer: `CONDUCTORS: ${materials.filter(m => m.conductor).map(m => m.name).join(', ')}\nINSULATORS: ${materials.filter(m => !m.conductor).map(m => m.name).join(', ')}\n\nMetals are generally good conductors. Plastic, rubber, and wood are insulators.`,
            hint: 'Metals usually conduct electricity well. Non-metals usually do not.',
            learningObjectivesCovered: ['p5-elec-3'],
          };
        },
      ];
      const scenario = randomChoice(scenarios)();
      return { ...scenario, type: 'deduction' as const };
    },
  },

  // FOOD CHAINS
  {
    topicId: 'p6-sci-food-chains',
    generate: (complexity) => {
      const chains = [
        { organisms: ['grass', 'grasshopper', 'frog', 'snake', 'eagle'] },
        { organisms: ['algae', 'small fish', 'big fish', 'seal', 'killer whale'] },
        { organisms: ['leaves', 'caterpillar', 'bird', 'cat'] },
      ];
      const chain = randomChoice(chains);
      const shuffled = shuffleArray([...chain.organisms]);

      return {
        question: `Arrange these organisms into a food chain (start with the producer):\n${shuffled.map((o, i) => `${i + 1}. ${o}`).join('\n')}`,
        answer: `Food chain: ${chain.organisms.join(' → ')}\n\nProducer: ${chain.organisms[0]} (makes its own food)\nConsumers: ${chain.organisms.slice(1).join(', ')} (get energy from eating other organisms)`,
        hint: 'Start with the producer (plant/algae). Each organism is eaten by the next one.',
        type: 'logic' as const,
        learningObjectivesCovered: ['p6-fc-1', 'p6-fc-2'],
      };
    },
  },
];

// ============================================
// MAIN EXPORTS
// ============================================

const allGenerators: TopicPuzzleGenerator[] = [
  ...p4MathGenerators,
  ...p5MathGenerators,
  ...p6MathGenerators,
  ...scienceGenerators,
];

/**
 * Generate a puzzle for a specific syllabus topic
 */
export function generatePuzzleForTopic(
  topicId: string,
  complexity: PuzzleComplexity
): Puzzle | null {
  const generator = allGenerators.find(g => g.topicId === topicId);
  if (!generator) return null;

  const topic = getTopicById(topicId);
  if (!topic) return null;

  const content = generator.generate(complexity);

  const pointsMap = { BASIC: 15, STANDARD: 25, CHALLENGING: 40, EXPERT: 60 };
  const timeMap = { BASIC: 3, STANDARD: 7, CHALLENGING: 15, EXPERT: 25 };

  return {
    id: `puzzle-${nanoid(6)}`,
    title: topic.name,
    type: content.type,
    question: content.question,
    answer: content.answer,
    hint: content.hint,
    points: pointsMap[complexity],
    difficulty: complexity === 'BASIC' ? 1 : complexity === 'STANDARD' ? 2 : complexity === 'CHALLENGING' ? 3 : 4,
    complexity,
    estimatedMinutes: timeMap[complexity],
    requiresMultipleSteps: complexity !== 'BASIC',
    // Syllabus alignment
    topicId: topicId,
    learningObjectivesCovered: content.learningObjectivesCovered || [],
  };
}

/**
 * Get all available topic IDs that have puzzle generators
 */
export function getAvailablePuzzleTopics(): string[] {
  return allGenerators.map(g => g.topicId);
}

/**
 * Generate puzzles covering specific topics for a case
 */
export function generatePuzzlesForTopics(
  topicIds: string[],
  complexity: PuzzleComplexity
): Puzzle[] {
  return topicIds
    .map(id => generatePuzzleForTopic(id, complexity))
    .filter((p): p is Puzzle => p !== null);
}
