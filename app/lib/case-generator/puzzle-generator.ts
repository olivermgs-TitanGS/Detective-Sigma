/**
 * MODULAR PUZZLE GENERATOR
 *
 * This generates truly unique puzzles by:
 * 1. Parameterized templates with variable substitution
 * 2. Random number generation within pedagogically valid ranges
 * 3. Combinatorial story elements
 * 4. Dynamic answer calculation (not hardcoded)
 */

import { nanoid } from 'nanoid';
import { Puzzle, PuzzleComplexity } from './types';

// Random number generators with pedagogically appropriate ranges
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDecimal(min: number, max: number, decimals: number = 2): number {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimals));
}

function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Singapore-appropriate names for story elements
const singaporeNames = {
  people: ['Wei Ming', 'Priya', 'Ahmad', 'Sarah', 'Jia Hui', 'Ravi', 'Siti', 'Marcus', 'Mei Lin', 'Darren'],
  places: ['Tampines Mall', 'Jurong East', 'Bedok', 'Clementi', 'Ang Mo Kio', 'Bishan', 'Woodlands'],
  shops: ['Happy Mart', 'Lucky Store', 'Best Electronics', 'Fresh Mart', 'Good Price Shop'],
  foods: ['chicken rice', 'nasi lemak', 'laksa', 'roti prata', 'char kway teow', 'bak kut teh'],
  vehicles: ['bus', 'MRT', 'taxi', 'bicycle', 'car'],
};

// ============================================
// MATH PUZZLE GENERATORS
// ============================================

interface MathPuzzleTemplate {
  title: string;
  generatePuzzle: (complexity: PuzzleComplexity) => {
    question: string;
    answer: string;
    hint: string;
    // MCQ support
    correctValue: string;       // Simple answer for MCQ matching
    options?: string[];         // MCQ options (including correct answer)
  };
  type: 'math';
  skills: string[];
}

/**
 * Generate plausible wrong options for numeric MCQ
 */
function generateNumericOptions(correctValue: number, isPercentage: boolean = false): string[] {
  const options: string[] = [];
  const prefix = isPercentage ? '' : '$';
  const suffix = isPercentage ? '%' : '';

  // Add the correct answer
  options.push(`${prefix}${correctValue.toLocaleString()}${suffix}`);

  // Generate wrong options with common calculation errors
  const wrongOffsets = [
    Math.round(correctValue * 0.85),   // 15% too low
    Math.round(correctValue * 1.15),   // 15% too high
    Math.round(correctValue * 0.5),    // Half (forgot to add components)
    Math.round(correctValue * 1.5),    // 50% too high
    Math.round(correctValue + 10),     // Simple addition error
    Math.round(correctValue - 10),     // Simple subtraction error
    Math.round(correctValue * 2),      // Doubled by mistake
  ];

  // Add unique wrong options
  for (const wrong of wrongOffsets) {
    if (wrong !== correctValue && wrong > 0 && !options.includes(`${prefix}${wrong.toLocaleString()}${suffix}`)) {
      options.push(`${prefix}${wrong.toLocaleString()}${suffix}`);
    }
    if (options.length >= 4) break;
  }

  // Ensure we have 4 options
  while (options.length < 4) {
    const randomWrong = Math.round(correctValue * (0.7 + Math.random() * 0.6));
    const formatted = `${prefix}${randomWrong.toLocaleString()}${suffix}`;
    if (!options.includes(formatted) && randomWrong > 0) {
      options.push(formatted);
    }
  }

  // Shuffle options
  return options.sort(() => Math.random() - 0.5);
}

/**
 * Generate plausible wrong options for suspect name MCQ
 */
function generateSuspectOptions(correctSuspect: string, allSuspects: string[]): string[] {
  const options = [correctSuspect];

  // Add other suspects
  for (const suspect of allSuspects) {
    if (suspect !== correctSuspect && options.length < 4) {
      options.push(suspect);
    }
  }

  // If not enough suspects, add "None of them" or "Multiple suspects"
  if (options.length < 4) {
    options.push('None of them could have done it');
  }
  if (options.length < 4) {
    options.push('Multiple suspects are possible');
  }

  // Shuffle options
  return options.sort(() => Math.random() - 0.5);
}

/**
 * Generate Yes/No options with explanations
 */
function generateYesNoOptions(correctAnswer: boolean, context: string): string[] {
  const options = [
    `Yes, ${context}`,
    `No, ${context.replace('could', 'could not').replace('is', 'is not')}`,
    'More information needed',
    'The data is inconclusive',
  ];
  return correctAnswer ? options : [options[1], options[0], options[2], options[3]];
}

export const mathPuzzleGenerators: MathPuzzleTemplate[] = [
  // CASH REGISTER / MONEY CALCULATION
  {
    title: 'The Cash Register Mystery',
    type: 'math',
    skills: ['multiplication', 'addition', 'verification'],
    generatePuzzle: (complexity) => {
      const shopName = randomChoice(singaporeNames.shops);
      const items: Array<{ name: string; qty: number; price: number }> = [];

      // Generate random items based on complexity
      const itemCount = complexity === 'BASIC' ? 2 : complexity === 'STANDARD' ? 3 : 4;
      const itemNames = ['notebooks', 'pens', 'erasers', 'rulers', 'markers', 'folders'];

      for (let i = 0; i < itemCount; i++) {
        items.push({
          name: itemNames[i],
          qty: randomInt(10, complexity === 'EXPERT' ? 150 : 50),
          price: randomDecimal(1.50, 15.00, 2),
        });
      }

      const openingBalance = randomInt(100, 300);
      const actualSales = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
      const claimedMissing = randomInt(20, 80);
      const actualClosing = openingBalance + actualSales - randomInt(0, claimedMissing);
      const actualMissing = openingBalance + actualSales - actualClosing;

      let question = `${shopName}'s cash register shows:\n`;
      question += `- Opening balance: $${openingBalance.toFixed(2)}\n`;
      items.forEach(item => {
        question += `- ${item.name.charAt(0).toUpperCase() + item.name.slice(1)} sold: ${item.qty} at $${item.price.toFixed(2)} each\n`;
      });
      question += `- Closing balance: $${actualClosing.toFixed(2)}\n\n`;
      question += `The manager claims $${claimedMissing} is missing. Calculate if this is correct, and determine the actual amount missing (if any).`;

      const itemCalcs = items.map(item =>
        `${item.qty} × $${item.price.toFixed(2)} = $${(item.qty * item.price).toFixed(2)}`
      ).join('\n');

      const answer = `Calculations:\n${itemCalcs}\n` +
        `Total sales: $${actualSales.toFixed(2)}\n` +
        `Expected closing: $${openingBalance} + $${actualSales.toFixed(2)} = $${(openingBalance + actualSales).toFixed(2)}\n` +
        `Actual closing: $${actualClosing.toFixed(2)}\n` +
        `Missing: $${actualMissing.toFixed(2)}\n` +
        `The manager is ${Math.abs(actualMissing - claimedMissing) < 0.01 ? 'CORRECT' : 'WRONG'} - ${
          actualMissing > 0 ? `only $${actualMissing.toFixed(2)} is missing` : 'nothing is missing'
        }`;

      return {
        question,
        answer,
        hint: 'Calculate total sales for each item, add to opening balance, compare with actual closing.',
        correctValue: `$${actualMissing.toFixed(2)}`,
        options: generateNumericOptions(actualMissing),
      };
    },
  },

  // TIMELINE / TIME CALCULATION
  {
    title: 'The Suspect Timeline',
    type: 'math',
    skills: ['time calculation', 'duration', 'logical reasoning'],
    generatePuzzle: (complexity) => {
      const suspects = randomChoice(singaporeNames.people);
      const suspectCount = complexity === 'BASIC' ? 2 : complexity === 'STANDARD' ? 3 : 4;
      const suspectNames: string[] = [];
      for (let i = 0; i < suspectCount; i++) {
        let name = randomChoice(singaporeNames.people);
        while (suspectNames.includes(name)) {
          name = randomChoice(singaporeNames.people);
        }
        suspectNames.push(name);
      }

      // Generate crime window
      const crimeStartHour = randomInt(14, 18);
      const crimeStartMin = randomInt(0, 3) * 15;
      const crimeEndMin = crimeStartMin + randomInt(15, 45);

      // Generate suspect timelines
      const suspectTimelines = suspectNames.map((name, idx) => {
        const arrivalHour = randomInt(crimeStartHour - 2, crimeStartHour + 1);
        const arrivalMin = randomInt(0, 59);
        const stayHours = randomInt(0, 2);
        const stayMins = randomInt(15, 55);

        return {
          name,
          arrivalHour,
          arrivalMin,
          stayHours,
          stayMins,
        };
      });

      let question = `Three suspects were seen at different times:\n\n`;
      suspectTimelines.forEach(s => {
        const arrTime = `${s.arrivalHour}:${s.arrivalMin.toString().padStart(2, '0')} PM`;
        question += `- ${s.name}: Arrived at ${arrTime}, stayed for ${s.stayHours} hour${s.stayHours !== 1 ? 's' : ''} ${s.stayMins} minutes\n`;
      });
      question += `\nThe crime happened between ${crimeStartHour}:${crimeStartMin.toString().padStart(2, '0')} PM and ${crimeStartHour}:${(crimeStartMin + 30).toString().padStart(2, '0')} PM.\n`;
      question += `Which suspect(s) could have committed the crime? Show your calculations.`;

      // Calculate answer
      const crimeWindow = { start: crimeStartHour * 60 + crimeStartMin, end: crimeStartHour * 60 + crimeStartMin + 30 };
      const couldCommit: string[] = [];

      let answerText = 'Timeline calculations:\n\n';
      suspectTimelines.forEach(s => {
        const arrivalMins = s.arrivalHour * 60 + s.arrivalMin;
        const departureMins = arrivalMins + s.stayHours * 60 + s.stayMins;
        const depHour = Math.floor(departureMins / 60);
        const depMin = departureMins % 60;

        answerText += `${s.name}:\n`;
        answerText += `  Arrived: ${s.arrivalHour}:${s.arrivalMin.toString().padStart(2, '0')} PM\n`;
        answerText += `  Stayed: ${s.stayHours}h ${s.stayMins}min\n`;
        answerText += `  Left: ${depHour}:${depMin.toString().padStart(2, '0')} PM\n`;

        if (arrivalMins <= crimeWindow.start && departureMins >= crimeWindow.end) {
          answerText += `  → Present during ENTIRE crime window ✓\n\n`;
          couldCommit.push(s.name);
        } else if (departureMins > crimeWindow.start && arrivalMins < crimeWindow.end) {
          answerText += `  → Present during PART of crime window ✓\n\n`;
          couldCommit.push(s.name);
        } else {
          answerText += `  → NOT present during crime window ✗\n\n`;
        }
      });

      answerText += `CONCLUSION: ${couldCommit.length > 0 ? couldCommit.join(' and ') : 'None of the suspects'} could have committed the crime.`;

      // Build correct answer text for MCQ
      const correctAnswer = couldCommit.length > 0 ? couldCommit.join(' and ') : 'None of them';

      return {
        question,
        answer: answerText,
        hint: 'Calculate departure time for each suspect (arrival + stay duration). Check overlap with crime window.',
        correctValue: correctAnswer,
        options: generateSuspectOptions(correctAnswer, suspectNames),
      };
    },
  },

  // RATIO AND PROPORTION
  {
    title: 'The Stolen Goods Division',
    type: 'math',
    skills: ['ratio', 'proportion', 'multiplication'],
    generatePuzzle: (complexity) => {
      const parts = complexity === 'BASIC' ? [2, 3] : complexity === 'STANDARD' ? [2, 3, 5] : [3, 4, 5, 8];
      const totalParts = parts.reduce((a, b) => a + b, 0);
      const smallestPart = Math.min(...parts);
      const smallestValue = randomInt(20, 100) * smallestPart; // Ensure divisible
      const onePartValue = smallestValue / smallestPart;
      const totalValue = onePartValue * totalParts;

      let question = `The stolen items were divided among ${parts.length} people in the ratio ${parts.join(':')}.`;
      question += `\nThe person with the smallest share got items worth $${smallestValue}.`;
      question += `\n\nFind:\n1. The total value of stolen items`;
      question += `\n2. The value each person received`;

      const answer = `Ratio ${parts.join(':')} means ${totalParts} parts total.\n` +
        `Smallest share (${smallestPart} parts) = $${smallestValue}\n` +
        `1 part = $${smallestValue} ÷ ${smallestPart} = $${onePartValue}\n\n` +
        `Each person's share:\n` +
        parts.map((p, i) => `Person ${i + 1}: ${p} parts × $${onePartValue} = $${p * onePartValue}`).join('\n') +
        `\n\nTotal: ${totalParts} parts × $${onePartValue} = $${totalValue}`;

      return {
        question,
        answer,
        hint: 'Find what 1 "part" is worth by dividing smallest share by its ratio number.',
        correctValue: `$${totalValue}`,
        options: generateNumericOptions(totalValue),
      };
    },
  },

  // PERCENTAGE PROBLEMS
  {
    title: 'The Inventory Theft',
    type: 'math',
    skills: ['percentage', 'multiplication', 'addition'],
    generatePuzzle: (complexity) => {
      const items = [
        { name: 'laptops', baseQty: randomInt(40, 100), price: randomInt(800, 1500), percent: randomInt(10, 30) },
        { name: 'tablets', baseQty: randomInt(50, 120), price: randomInt(300, 700), percent: randomInt(15, 35) },
        { name: 'phones', baseQty: randomInt(80, 200), price: randomInt(400, 1000), percent: randomInt(5, 25) },
      ];

      const selectedItems = items.slice(0, complexity === 'BASIC' ? 2 : complexity === 'STANDARD' ? 3 : 3);
      const location = randomChoice(singaporeNames.places);

      let question = `A warehouse in ${location} reported theft. The stolen items were:\n\n`;
      selectedItems.forEach(item => {
        question += `- ${item.percent}% of ${item.name} (they had ${item.baseQty})\n`;
      });
      question += `\nPrices: `;
      question += selectedItems.map(i => `${i.name} = $${i.price} each`).join(', ');
      question += `\n\nCalculate:\n1. How many of each item was stolen\n2. The total value of stolen items`;

      let answerText = 'Calculations:\n\n';
      let totalValue = 0;

      selectedItems.forEach(item => {
        const stolen = Math.round(item.baseQty * item.percent / 100);
        const value = stolen * item.price;
        totalValue += value;
        answerText += `${item.name.charAt(0).toUpperCase() + item.name.slice(1)}:\n`;
        answerText += `  ${item.percent}% of ${item.baseQty} = ${stolen} items\n`;
        answerText += `  ${stolen} × $${item.price} = $${value.toLocaleString()}\n\n`;
      });

      answerText += `Total stolen value: $${totalValue.toLocaleString()}`;

      return {
        question,
        answer: answerText,
        hint: 'Calculate stolen quantity (% × total), then multiply by price for each item.',
        correctValue: `$${totalValue.toLocaleString()}`,
        options: generateNumericOptions(totalValue),
      };
    },
  },

  // SPEED-DISTANCE-TIME
  {
    title: 'The Escape Route',
    type: 'math',
    skills: ['speed', 'distance', 'time', 'unit conversion'],
    generatePuzzle: (complexity) => {
      const location = randomChoice(singaporeNames.places);
      const speed = randomInt(8, 15); // km/h running speed
      const policeDelay = randomInt(10, 20); // minutes
      const distance = randomDecimal(1.5, 4.0, 1);

      const timeToReach = (distance / speed) * 60; // in minutes
      const canEscape = timeToReach < policeDelay;

      let question = `A witness saw the suspect running from ${location} at ${speed} km/h.\n`;
      question += `The police arrived ${policeDelay} minutes later.\n`;
      question += `A second witness spotted someone matching the description at a bus stop ${distance} km away.\n\n`;
      question += `Calculate:\n1. How long would it take to run to the bus stop?\n`;
      question += `2. Could the suspect have reached the bus stop before police arrived?`;

      const answer = `Speed = ${speed} km/h = ${speed} km per 60 min = ${(speed/60).toFixed(3)} km/min\n\n` +
        `Time to reach bus stop = ${distance} km ÷ ${(speed/60).toFixed(3)} km/min\n` +
        `= ${timeToReach.toFixed(1)} minutes\n\n` +
        `Police arrived after ${policeDelay} minutes.\n` +
        `${timeToReach.toFixed(1)} ${canEscape ? '<' : '>'} ${policeDelay}\n\n` +
        `${canEscape ? 'YES' : 'NO'}, the suspect ${canEscape ? 'COULD' : 'COULD NOT'} have reached the bus stop ` +
        `${canEscape ? `(${(policeDelay - timeToReach).toFixed(1)} minutes to spare)` : `(would take ${(timeToReach - policeDelay).toFixed(1)} minutes longer)`}`;

      const correctAnswer = canEscape ? 'Yes, suspect could escape' : 'No, suspect could not escape';

      return {
        question,
        answer,
        hint: 'Convert speed to km per minute. Time = Distance ÷ Speed.',
        correctValue: correctAnswer,
        options: generateYesNoOptions(canEscape, 'the suspect could have reached the bus stop'),
      };
    },
  },

  // DATA TABLE ANALYSIS (CHALLENGING+)
  {
    title: 'The Financial Records Investigation',
    type: 'math',
    skills: ['data analysis', 'pattern recognition', 'calculation'],
    generatePuzzle: (complexity) => {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      const shopName = randomChoice(singaporeNames.shops);

      // Generate daily data with a suspicious pattern
      const avgPerCustomer = randomDecimal(12, 18, 2);
      const data = days.map(day => {
        const customers = randomInt(80, 200);
        // Normal variation would give different per-customer values
        // Suspicious: same per-customer value every day
        const isSuspicious = complexity === 'CHALLENGING' || complexity === 'EXPERT';
        const revenue = isSuspicious
          ? Math.round(customers * avgPerCustomer * 100) / 100 // Suspiciously consistent
          : Math.round(customers * avgPerCustomer * (0.9 + Math.random() * 0.2) * 100) / 100; // Natural variation

        return { day, customers, revenue };
      });

      let question = `You're investigating ${shopName}. Analyze their weekly financial data:\n\n`;
      question += `| Day | Customers | Revenue |\n`;
      question += `|-----|-----------|--------|\n`;
      data.forEach(d => {
        question += `| ${d.day.substring(0, 3)} | ${d.customers} | $${d.revenue.toFixed(2)} |\n`;
      });

      question += `\nIndustry average is $12-18 per customer with natural daily variation of ±15%.\n\n`;
      question += `Tasks:\n1. Calculate revenue per customer for each day\n`;
      question += `2. Identify if the pattern is suspicious and explain why`;

      let answerText = 'Revenue per customer calculations:\n\n';
      const perCustomer = data.map(d => ({
        day: d.day,
        calc: d.revenue / d.customers,
      }));

      perCustomer.forEach(p => {
        answerText += `${p.day}: $${data.find(d => d.day === p.day)!.revenue.toFixed(2)} ÷ ${data.find(d => d.day === p.day)!.customers} = $${p.calc.toFixed(2)}\n`;
      });

      const variance = Math.max(...perCustomer.map(p => p.calc)) - Math.min(...perCustomer.map(p => p.calc));
      const isSuspicious = variance < 0.50;

      answerText += `\nVariance in per-customer revenue: $${variance.toFixed(2)}\n`;
      answerText += `Expected variance with normal business: $1.80-2.70 (15% of avg)\n\n`;
      answerText += isSuspicious
        ? `SUSPICIOUS: The per-customer revenue is TOO CONSISTENT ($${variance.toFixed(2)} variance). Natural business variation should show $1.50-3.00 difference between days. This suggests artificial number manipulation.`
        : `NORMAL: The variance ($${variance.toFixed(2)}) falls within expected natural business variation.`;

      const correctAnswer = isSuspicious ? 'Suspicious - numbers manipulated' : 'Normal - natural variation';

      return {
        question,
        answer: answerText,
        hint: 'Calculate revenue per customer for each day. Look for patterns that are statistically unlikely.',
        correctValue: correctAnswer,
        options: [
          'Suspicious - numbers manipulated',
          'Normal - natural variation',
          'Insufficient data to determine',
          'Revenue is below industry average',
        ].sort(() => Math.random() - 0.5),
      };
    },
  },
];

// ============================================
// MAIN EXPORT: Generate unique puzzle
// ============================================

export function generateUniquePuzzle(
  subject: 'MATH' | 'SCIENCE' | 'INTEGRATED',
  complexity: PuzzleComplexity,
  existingTitles: string[] = []
): Puzzle {
  // Select generator based on subject
  let generators = mathPuzzleGenerators;

  // Filter out already used puzzles if possible
  let availableGenerators = generators.filter(g => !existingTitles.includes(g.title));
  if (availableGenerators.length === 0) {
    availableGenerators = generators; // Fall back to all if all used
  }

  const generator = randomChoice(availableGenerators);
  const generated = generator.generatePuzzle(complexity);

  const points = {
    BASIC: 15,
    STANDARD: 25,
    CHALLENGING: 40,
    EXPERT: 60,
  };

  const estimatedMinutes = {
    BASIC: 3,
    STANDARD: 7,
    CHALLENGING: 15,
    EXPERT: 25,
  };

  return {
    id: `puzzle-${nanoid(6)}`,
    title: generator.title,
    type: generator.type,
    question: generated.question,
    answer: generated.answer,
    options: generated.options,  // MCQ options
    hint: generated.hint,
    points: points[complexity],
    difficulty: complexity === 'BASIC' ? 1 : complexity === 'STANDARD' ? 2 : complexity === 'CHALLENGING' ? 3 : 4,
    complexity,
    estimatedMinutes: estimatedMinutes[complexity],
    requiresMultipleSteps: complexity !== 'BASIC',
  };
}

/**
 * Generate multiple unique puzzles for a case
 */
export function generateUniquePuzzles(
  subject: 'MATH' | 'SCIENCE' | 'INTEGRATED',
  complexity: PuzzleComplexity,
  count: number
): Puzzle[] {
  const puzzles: Puzzle[] = [];
  const usedTitles: string[] = [];

  for (let i = 0; i < count; i++) {
    const puzzle = generateUniquePuzzle(subject, complexity, usedTitles);
    puzzles.push(puzzle);
    usedTitles.push(puzzle.title);
  }

  return puzzles;
}
