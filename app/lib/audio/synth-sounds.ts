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

// Typewriter key press
export function playTypewriter(): void {
  try {
    ensureAudioContext();
    createNoise(0.04, 0.15);
    createTone({ frequency: 300 + Math.random() * 100, duration: 0.02, type: 'square', volume: 0.1 });
  } catch (e) {
    console.debug('Audio not available');
  }
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

// Map all sound types to functions
export const synthSounds = {
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
};

export type SynthSoundType = keyof typeof synthSounds;

export function playSynthSound(sound: SynthSoundType): void {
  const playFn = synthSounds[sound];
  if (playFn) {
    playFn();
  }
}
