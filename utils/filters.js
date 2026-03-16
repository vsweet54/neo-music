// DisTube Built-in Filters + Custom
const FILTERS = {
  // Bass
  bassboost: { label: '🔊 Bass Boost', value: 'bassboost' },
  bassboost_high: { label: '💥 Bass Boost High', value: 'bassboost_high' },
  bassboost_low: { label: '🔈 Bass Boost Low', value: 'bassboost_low' },

  // Pitch/Speed
  nightcore: { label: '⚡ Nightcore', value: 'nightcore' },
  vaporwave: { label: '🌊 Vaporwave', value: 'vaporwave' },

  // Spatial
  '8d': { label: '🎧 8D Audio', value: '8d' },
  surrounding: { label: '🔄 Surrounding', value: 'surrounding' },
  pulsator: { label: '💫 Pulsator', value: 'pulsator' },

  // Effects
  echo: { label: '🔁 Echo', value: 'echo' },
  karaoke: { label: '🎤 Karaoke', value: 'karaoke' },
  flanger: { label: '🌀 Flanger', value: 'flanger' },
  gate: { label: '🚪 Gate', value: 'gate' },
  haas: { label: '🎼 Haas', value: 'haas' },
  reverse: { label: '⏪ Reverse', value: 'reverse' },
  normalizer: { label: '📊 Normalizer', value: 'normalizer' },
  normalizer2: { label: '📈 Normalizer2', value: 'normalizer2' },
  lofi: { label: '☕ Lo-Fi', value: 'lofi' },

  // Clear
  clear: { label: '✨ Clear All', value: 'clear' },
};

const FILTER_CHOICES = Object.values(FILTERS).map(f => ({
  name: f.label,
  value: f.value,
}));

module.exports = { FILTERS, FILTER_CHOICES };
