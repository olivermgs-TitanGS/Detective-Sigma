import { generateCase } from './lib/case-generator/generator';

async function test() {
  console.log('Testing case generation with image requests...\n');

  const testCase = await generateCase({
    difficulty: 'INSPECTOR',
    subject: 'MATH',
    gradeLevel: 'P5',
    puzzleComplexity: 'STANDARD',
  });

  console.log('=== CASE GENERATED ===');
  console.log('Title:', testCase.title);
  console.log('Crime:', testCase.story.crime);
  console.log('Location:', testCase.scenes[0]?.name);
  console.log('');

  console.log('=== SUSPECTS ===');
  testCase.suspects.forEach(s => {
    console.log(`- ${s.name} (${s.role})${s.isGuilty ? ' [GUILTY]' : ''}`);
  });
  console.log('');

  console.log('=== IMAGE REQUESTS ===');
  console.log('Cover:', testCase.imageRequests?.cover ? 'YES' : 'NO');
  console.log('Scenes:', testCase.imageRequests?.scenes?.length || 0);
  console.log('Suspects:', testCase.imageRequests?.suspects?.length || 0);
  console.log('Evidence:', testCase.imageRequests?.evidence?.length || 0);
  console.log('');

  if (testCase.imageRequests?.cover) {
    console.log('=== COVER PROMPT (first 300 chars) ===');
    console.log(testCase.imageRequests.cover.prompt.substring(0, 300) + '...');
    console.log('');
  }

  if (testCase.imageRequests?.suspects?.[0]) {
    const suspect = testCase.imageRequests.suspects[0];
    console.log('=== SUSPECT PROMPT ===');
    console.log('Name:', suspect.metadata?.name);
    console.log('Ethnicity:', suspect.metadata?.ethnicity);
    console.log('Expression:', suspect.metadata?.expression);
    console.log('Prompt (400 chars):', suspect.prompt.substring(0, 400) + '...');
    console.log('');
  }

  if (testCase.imageRequests?.scenes?.[0]) {
    console.log('=== SCENE PROMPT (300 chars) ===');
    console.log(testCase.imageRequests.scenes[0].prompt.substring(0, 300) + '...');
  }

  console.log('\n=== TEST PASSED ===');
}

test().catch(e => console.error('Error:', e));
