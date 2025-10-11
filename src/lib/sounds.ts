// 3種類のアラーム音定義

export type SoundType = 'bell' | 'chime' | 'harp'

// ベル音: 優しいベルの音（C5 -> G5 -> C6）
const bellSound = {
  name: 'ベル',
  description: '優しいベルの音',
  melody: [
    { frequency: 523.25, duration: 0.4 }, // C5
    { frequency: 783.99, duration: 0.4 }, // G5
    { frequency: 1046.50, duration: 0.6 }, // C6
  ]
}

// チャイム音: 心地よいチャイム（C5 -> E5 -> G5 -> C6）
const chimeSound = {
  name: 'チャイム',
  description: '心地よいチャイム',
  melody: [
    { frequency: 523.25, duration: 0.3 }, // C5
    { frequency: 659.25, duration: 0.3 }, // E5
    { frequency: 783.99, duration: 0.3 }, // G5
    { frequency: 1046.50, duration: 0.4 }, // C6
  ]
}

// ハープ音: 柔らかいハープの音（C5 -> D5 -> E5 -> G5 -> A5）
const harpSound = {
  name: 'ハープ',
  description: '柔らかいハープの音',
  melody: [
    { frequency: 523.25, duration: 0.25 }, // C5
    { frequency: 587.33, duration: 0.25 }, // D5
    { frequency: 659.25, duration: 0.25 }, // E5
    { frequency: 783.99, duration: 0.25 }, // G5
    { frequency: 880.00, duration: 0.35 }, // A5
  ]
}

export const soundTypes = {
  bell: bellSound,
  chime: chimeSound,
  harp: harpSound,
}

export function playSound(soundType: SoundType, volume: number): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const sound = soundTypes[soundType]

    let currentTime = audioContext.currentTime

    sound.melody.forEach((note) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // サイン波で柔らかい音に
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(note.frequency, currentTime)

      // フェードイン・フェードアウトで滑らかに
      const startTime = currentTime
      const endTime = startTime + note.duration

      gainNode.gain.setValueAtTime(0, startTime)
      gainNode.gain.linearRampToValueAtTime(volume * 0.6, startTime + 0.05) // フェードイン
      gainNode.gain.setValueAtTime(volume * 0.6, endTime - 0.1)
      gainNode.gain.linearRampToValueAtTime(0, endTime) // フェードアウト

      oscillator.start(startTime)
      oscillator.stop(endTime)

      currentTime = endTime
    })
  } catch (error) {
    console.error('Failed to play sound:', error)
  }
}
