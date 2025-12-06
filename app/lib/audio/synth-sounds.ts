'use client';

// Synthetic sound generator using Web Audio API
// Creates detective-themed sounds without needing audio files

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
}

// Ensure audio context is resumed (needed for autoplay policies)
export async function ensureAudioContext(): Promise<void> {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
}

// Base sound parameters
interface SoundParams {
  frequency?: number;
  duration?: number;
  type?: OscillatorType;
  volume?: number;
  attack?: number;
  decay?: number;
  detune?: number;
}

// Create a basic tone
function createTone(params: SoundParams = {}): void {
  const ctx = getAudioContext();
  const {
    frequency = 440,
    duration = 0.1,
    type = 'sine',
    volume = 0.3,
    attack = 0.01,
    decay = 0.1,
    detune = 0,
  } = params;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
  oscillator.detune.setValueAtTime(detune, ctx.currentTime);

  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + attack);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration + decay);
}

// Create noise burst (for clicks, paper sounds)
function createNoise(duration: number = 0.05, volume: number = 0.2): void {
  const ctx = getAudioContext();
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
  }

  const source = ctx.createBufferSource();
  const gainNode = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  filter.type = 'highpass';
  filter.frequency.setValueAtTime(2000, ctx.currentTime);

  source.buffer = buffer;
  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  source.start();
}

// ==================== DETECTIVE THEMED SOUNDS ====================

// Button click - sharp, satisfying click
export function playButtonClick(): void {
  try {
    ensureAudioContext();
    createTone({ frequency: 800, duration: 0.08, type: 'square', volume: 0.15 });
    createNoise(0.03, 0.1);
  } catch (e) {
    console.debug('Audio not available');
  }
}

// Button hover - subtle tick
export function playButtonHover(): void {
  try {
    ensureAudioContext();
    createTone({ frequency: 600, duration: 0.03, type: 'sine', volume: 0.08 });
  } catch (e) {
    console.debug('Audio not available');
  }
}

// Typewriter key press - subtle noir style, soft mechanical click
export function playTypewriter(): void {
  try {
    ensureAudioContext();
    const ctx = getAudioContext();

    // Very subtle mechanical click - noir typewriter style
    const variation = Math.random();
    const baseFreq = 180 + variation * 40; // Subtle frequency variation

    // Soft, muffled click sound
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Low-pass filter to muffle the sound (like a distant typewriter)
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.Q.setValueAtTime(0.5, ctx.currentTime);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(baseFreq, ctx.currentTime);

    // Very quick, soft attack and decay
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.003); // Very soft
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025);

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.03);

    // Occasional subtle paper touch sound (10% chance)
    if (variation > 0.9) {
      createFilteredNoise(0.015, 0.02, 1500, 'highpass');
    }
  } catch (e) {
    console.debug('Audio not available');
  }
}

// Create filtered noise for subtle ambient sounds
function createFilteredNoise(duration: number, volume: number, filterFreq: number, filterType: BiquadFilterType): void {
  const ctx = getAudioContext();
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
  }

  const source = ctx.createBufferSource();
  const gainNode = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  filter.type = filterType;
  filter.frequency.setValueAtTime(filterFreq, ctx.currentTime);

  source.buffer = buffer;
  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  source.start();
}

// Paper rustle
export function playPaperRustle(): void {
  try {
    ensureAudioContext();
    for (let i = 0; i < 3; i++) {
      setTimeout(() => createNoise(0.08, 0.08), i * 30);
    }
  } catch (e) {
    console.debug('Audio not available');
  }
}

// Folder open - whoosh with click
export function playFolderOpen(): void {
  try {
    ensureAudioContext();
    createTone({ frequency: 200, duration: 0.15, type: 'sine', volume: 0.1 });
    createNoise(0.1, 0.12);
    setTimeout(() => createTone({ frequency: 400, duration: 0.05, type: 'square', volume: 0.1 }), 50);
  } catch (e) {
    console.debug('Audio not available');
  }
}

// Stamp - heavy thud
export function playStamp(): void {
  try {
    ensureAudioContext();
    createTone({ frequency: 80, duration: 0.2, type: 'sine', volume: 0.4 });
    createNoise(0.15, 0.3);
    createTone({ frequency: 150, duration: 0.1, type: 'square', volume: 0.2 });
  } catch (e) {
    console.debug('Audio not available');
  }
}

// Success fanfare
export function playSuccess(): void {
  try {
    ensureAudioContext();
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => {
        createTone({ frequency: freq, duration: 0.2, type: 'sine', volume: 0.2 });
      }, i * 100);
    });
  } catch (e) {
    console.debug('Audio not available');
  }
}

// Error buzz
export function playError(): void {
  try {
    ensureAudioContext();
    createTone({ frequency: 200, duration: 0.3, type: 'sawtooth', volume: 0.15, detune: -50 });
    setTimeout(() => createTone({ frequency: 180, duration: 0.2, type: 'sawtooth', volume: 0.1 }), 150);
  } catch (e) {
    console.debug('Audio not available');
  }
}

// Clue found - mysterious shimmer
export function playClueFound(): void {
  try {
    ensureAudioContext();
    const notes = [880, 1109, 1319, 1760]; // A5, C#6, E6, A6
    notes.forEach((freq, i) => {
      setTimeout(() => {
        createTone({ frequency: freq, duration: 0.4 - i * 0.05, type: 'sine', volume: 0.15 - i * 0.02 });
      }, i * 80);
    });
  } catch (e) {
    console.debug('Audio not available');
  }
}

// Achievement unlock
export function playAchievement(): void {
  try {
    ensureAudioContext();
    // Triumphant arpeggio
    const notes = [523, 659, 784, 1047, 1319]; // C5, E5, G5, C6, E6
    notes.forEach((freq, i) => {
      setTimeout(() => {
        createTone({ frequency: freq, duration: 0.3, type: 'sine', volume: 0.25 - i * 0.03 });
        createTone({ frequency: freq * 1.5, duration: 0.2, type: 'sine', volume: 0.1 });
      }, i * 80);
    });
  } catch (e) {
    console.debug('Audio not available');
  }
}

// Points earned - coin sound
export function playPoints(): void {
  try {
    ensureAudioContext();
    createTone({ frequency: 988, duration: 0.1, type: 'square', volume: 0.15 });
    setTimeout(() => createTone({ frequency: 1319, duration: 0.15, type: 'square', volume: 0.12 }), 80);
  } catch (e) {
    console.debug('Audio not available');
  }
}

// Whoosh - transition sound
export function playWhoosh(): void {
  try {
    ensureAudioContext();
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(100, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);

    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.2);

    createNoise(0.15, 0.15);
  } catch (e) {
    console.debug('Audio not available');
  }
}

// Modal open
export function playModalOpen(): void {
  try {
    ensureAudioContext();
    createTone({ frequency: 400, duration: 0.1, type: 'sine', volume: 0.12 });
    createTone({ frequency: 600, duration: 0.15, type: 'sine', volume: 0.1 });
  } catch (e) {
    console.debug('Audio not available');
  }
}

// Modal close
export function playModalClose(): void {
  try {
    ensureAudioContext();
    createTone({ frequency: 500, duration: 0.08, type: 'sine', volume: 0.1 });
    createTone({ frequency: 350, duration: 0.1, type: 'sine', volume: 0.08 });
  } catch (e) {
    console.debug('Audio not available');
  }
}

// Notification ping
export function playNotification(): void {
  try {
    ensureAudioContext();
    createTone({ frequency: 880, duration: 0.1, type: 'sine', volume: 0.2 });
    setTimeout(() => createTone({ frequency: 1175, duration: 0.15, type: 'sine', volume: 0.15 }), 100);
  } catch (e) {
    console.debug('Audio not available');
  }
}

// Camera shutter
export function playCameraShutter(): void {
  try {
    ensureAudioContext();
    createNoise(0.08, 0.25);
    createTone({ frequency: 200, duration: 0.05, type: 'square', volume: 0.15 });
    setTimeout(() => {
      createNoise(0.05, 0.15);
      createTone({ frequency: 300, duration: 0.03, type: 'square', volume: 0.1 });
    }, 100);
  } catch (e) {
    console.debug('Audio not available');
  }
}

// Correct answer
export function playCorrect(): void {
  try {
    ensureAudioContext();
    createTone({ frequency: 523, duration: 0.1, type: 'sine', volume: 0.2 });
    setTimeout(() => createTone({ frequency: 659, duration: 0.15, type: 'sine', volume: 0.18 }), 80);
  } catch (e) {
    console.debug('Audio not available');
  }
}

// Wrong answer
export function playWrong(): void {
  try {
    ensureAudioContext();
    createTone({ frequency: 250, duration: 0.15, type: 'sawtooth', volume: 0.12 });
    setTimeout(() => createTone({ frequency: 200, duration: 0.2, type: 'sawtooth', volume: 0.1 }), 100);
  } catch (e) {
    console.debug('Audio not available');
  }
}

// ==================== NEW NOIR DETECTIVE SOUNDS ====================

// Suspect selection - mysterious, intriguing tone
export function playSuspectSelect(): void {
  try {
    ensureAudioContext();
    // Low mysterious tone with slight vibrato
    createTone({ frequency: 220, duration: 0.2, type: 'sine', volume: 0.12 });
    createTone({ frequency: 165, duration: 0.25, type: 'sine', volume: 0.08 });
    setTimeout(() => {
      createTone({ frequency: 277, duration: 0.15, type: 'sine', volume: 0.1 });
    }, 100);
  } catch (e) {
    console.debug('Audio not available');
  }
}

// Interrogation click - dramatic button press for dialogue
export function playInterrogation(): void {
  try {
    ensureAudioContext();
    // Subtle dramatic click
    createTone({ frequency: 180, duration: 0.08, type: 'sine', volume: 0.1 });
    createFilteredNoise(0.03, 0.06, 600, 'lowpass');
  } catch (e) {
    console.debug('Audio not available');
  }
}

// Page turn - soft paper sound
export function playPageTurn(): void {
  try {
    ensureAudioContext();
    // Soft swoosh with paper texture
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    filter.Q.setValueAtTime(0.8, ctx.currentTime);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(150, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);

    // Add subtle paper texture
    createFilteredNoise(0.08, 0.04, 2000, 'highpass');
  } catch (e) {
    console.debug('Audio not available');
  }
}

// Document slide - paper sliding on desk
export function playDocumentSlide(): void {
  try {
    ensureAudioContext();
    createFilteredNoise(0.1, 0.05, 800, 'lowpass');
    createTone({ frequency: 120, duration: 0.08, type: 'sine', volume: 0.04 });
  } catch (e) {
    console.debug('Audio not available');
  }
}

// Reveal suspense - dramatic discovery moment
export function playRevealSuspense(): void {
  try {
    ensureAudioContext();
    const ctx = getAudioContext();

    // Low suspenseful drone
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(110, ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(165, ctx.currentTime + 0.4);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.3);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);

    // Add shimmer at the end
    setTimeout(() => {
      createTone({ frequency: 440, duration: 0.2, type: 'sine', volume: 0.08 });
      createTone({ frequency: 554, duration: 0.15, type: 'sine', volume: 0.06 });
    }, 300);
  } catch (e) {
    console.debug('Audio not available');
  }
}

// Text input focus - subtle focus sound
export function playTextFocus(): void {
  try {
    ensureAudioContext();
    createTone({ frequency: 400, duration: 0.04, type: 'sine', volume: 0.05 });
  } catch (e) {
    console.debug('Audio not available');
  }
}

// Case file open - folder creak with weight
export function playCaseFileOpen(): void {
  try {
    ensureAudioContext();
    // Heavy folder opening sound
    createTone({ frequency: 100, duration: 0.15, type: 'sine', volume: 0.08 });
    createFilteredNoise(0.12, 0.08, 400, 'lowpass');
    setTimeout(() => {
      createTone({ frequency: 200, duration: 0.08, type: 'sine', volume: 0.06 });
      createFilteredNoise(0.05, 0.04, 800, 'highpass');
    }, 80);
  } catch (e) {
    console.debug('Audio not available');
  }
}

// Evidence examine - forensic analysis tone
export function playEvidenceExamine(): void {
  try {
    ensureAudioContext();
    // Scientific/forensic beep sequence
    createTone({ frequency: 660, duration: 0.08, type: 'sine', volume: 0.1 });
    setTimeout(() => createTone({ frequency: 880, duration: 0.1, type: 'sine', volume: 0.08 }), 100);
    setTimeout(() => createTone({ frequency: 1100, duration: 0.06, type: 'sine', volume: 0.06 }), 180);
  } catch (e) {
    console.debug('Audio not available');
  }
}

// Dialogue advance - subtle conversation progression
export function playDialogueAdvance(): void {
  try {
    ensureAudioContext();
    createTone({ frequency: 350, duration: 0.05, type: 'sine', volume: 0.06 });
    createTone({ frequency: 440, duration: 0.06, type: 'sine', volume: 0.05 });
  } catch (e) {
    console.debug('Audio not available');
  }
}

// Scene transition - atmospheric whoosh
export function playSceneTransition(): void {
  try {
    ensureAudioContext();
    const ctx = getAudioContext();

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.2);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(80, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.25);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);

    createFilteredNoise(0.2, 0.08, 600, 'lowpass');
  } catch (e) {
    console.debug('Audio not available');
  }
}

// Option select - multiple choice selection
export function playOptionSelect(): void {
  try {
    ensureAudioContext();
    createTone({ frequency: 500, duration: 0.06, type: 'sine', volume: 0.1 });
    createFilteredNoise(0.02, 0.04, 1000, 'highpass');
  } catch (e) {
    console.debug('Audio not available');
  }
}

// Hover subtle - very soft hover sound
export function playHoverSubtle(): void {
  try {
    ensureAudioContext();
    createTone({ frequency: 500, duration: 0.02, type: 'sine', volume: 0.03 });
  } catch (e) {
    console.debug('Audio not available');
  }
}

// Map all sound types to functions
export const synthSounds = {
  // Original sounds
  click: playButtonClick,
  buttonClick: playButtonClick,
  buttonHover: playButtonHover,
  typewriter: playTypewriter,
  paperRustle: playPaperRustle,
  folderOpen: playFolderOpen,
  folderClose: playModalClose,
  stamp: playStamp,
  success: playSuccess,
  error: playError,
  clueFound: playClueFound,
  achievement: playAchievement,
  points: playPoints,
  whoosh: playWhoosh,
  modalOpen: playModalOpen,
  modalClose: playModalClose,
  notification: playNotification,
  cameraShutter: playCameraShutter,
  correct: playCorrect,
  wrong: playWrong,
  levelUp: playAchievement,
  streak: playPoints,
  confetti: playSuccess,
  combo: playPoints,
  tabSwitch: playButtonClick,
  pinDrop: playClueFound,
  // New noir detective sounds
  suspectSelect: playSuspectSelect,
  interrogation: playInterrogation,
  pageTurn: playPageTurn,
  documentSlide: playDocumentSlide,
  revealSuspense: playRevealSuspense,
  textFocus: playTextFocus,
  caseFileOpen: playCaseFileOpen,
  evidenceExamine: playEvidenceExamine,
  dialogueAdvance: playDialogueAdvance,
  sceneTransition: playSceneTransition,
  optionSelect: playOptionSelect,
  hoverSubtle: playHoverSubtle,
};

export type SynthSoundType = keyof typeof synthSounds;

export function playSynthSound(sound: SynthSoundType): void {
  const playFn = synthSounds[sound];
  if (playFn) {
    playFn();
  }
}
