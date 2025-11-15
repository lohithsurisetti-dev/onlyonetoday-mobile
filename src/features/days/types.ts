/**
 * Themed Days Types
 * Each day of the week has its own vibe, community, and purpose
 */

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface DayTheme {
  id: DayOfWeek;
  name: string;
  icon: 'mask' | 'star' | 'dice' | 'heart' | 'calendar' | 'brush' | 'power';
  color: string;
  secondaryColor: string;
  gradient: string[];
  description: string;
  shortDesc: string;
  vibe: string;
  placeholder: string;
  reactions: {
    first: { emoji: string; label: string };
    second: { emoji: string; label: string };
    third: { emoji: string; label: string };
  };
}

export interface DayPost {
  id: string;
  content: string;
  username: string;
  day: DayOfWeek;
  timestamp: number;
  timeAgo: string;
  reactionCounts: {
    first: number;
    second: number;
    third: number;
  };
  weekNumber: number;
  scope: 'world' | 'city' | 'state' | 'country';
  location?: string;
  location_city?: string;
  location_state?: string;
  location_country?: string;
}

export const DAY_THEMES: Record<DayOfWeek, DayTheme> = {
  monday: {
    id: 'monday',
    name: 'Unpopular Monday',
    icon: 'mask',
    color: '#8b5cf6', // Nebula Violet - deep space purple
    secondaryColor: '#a78bfa', // Violet-400
    gradient: ['#8b5cf6', '#7c3aed'], // Violet-500 to Violet-600
    description: 'Share your unpopular opinions, hot takes, and work/college frustrations (but make it funny)',
    shortDesc: 'Hot takes & rebel thoughts',
    vibe: 'Rebellious, Funny, Cathartic',
    placeholder: 'Drop your unpopular opinion...',
    reactions: {
      first: { emoji: '😤', label: 'Agree' },
      second: { emoji: '🤨', label: 'Hmm' },
      third: { emoji: '🔥', label: 'Spicy' },
    },
  },
  tuesday: {
    id: 'tuesday',
    name: 'Tiny Tuesday',
    icon: 'star',
    color: '#94a3b8', // Aurora Silver - starlight silver (Slate-400)
    secondaryColor: '#cbd5e1', // Slate-300
    gradient: ['#cbd5e1', '#94a3b8'], // Slate-300 to Slate-400
    description: 'Celebrate small victories that nobody notices - your everyday accomplishments matter',
    shortDesc: 'Small victories & baby steps',
    vibe: 'Wholesome, Encouraging, Positive',
    placeholder: 'Share your tiny win...',
    reactions: {
      first: { emoji: '🎉', label: 'Proud' },
      second: { emoji: '💪', label: 'Strong' },
      third: { emoji: '⭐', label: 'Star' },
    },
  },
  wednesday: {
    id: 'wednesday',
    name: 'Random Wednesday',
    icon: 'dice',
    color: '#6366f1', // Galaxy Indigo - deep indigo-blue
    secondaryColor: '#818cf8', // Indigo-400
    gradient: ['#6366f1', '#4f46e5'], // Indigo-500 to Indigo-600
    description: 'Try something completely new - random acts of spontaneity and "why not?" moments',
    shortDesc: 'Spontaneous & experimental',
    vibe: 'Adventurous, Playful, Chaotic',
    placeholder: 'What wild thing did you do?',
    reactions: {
      first: { emoji: '🎲', label: 'Random' },
      second: { emoji: '🚀', label: 'Go' },
      third: { emoji: '😂', label: 'LOL' },
    },
  },
  thursday: {
    id: 'thursday',
    name: 'Thankful Thursday',
    icon: 'heart',
    color: '#d946ef', // Cosmic Magenta - deep fuchsia (purple-red, not pink)
    secondaryColor: '#e879f9', // Fuchsia-400
    gradient: ['#d946ef', '#c026d3'], // Fuchsia-500 to Fuchsia-600
    description: 'Share gratitude, appreciation, and mindful moments - the small things that made your day',
    shortDesc: 'Gratitude & mindfulness',
    vibe: 'Reflective, Grateful, Warm',
    placeholder: 'What are you grateful for?',
    reactions: {
      first: { emoji: '🙏', label: 'Blessed' },
      second: { emoji: '💗', label: 'Love' },
      third: { emoji: '🌸', label: 'Soft' },
    },
  },
  friday: {
    id: 'friday',
    name: 'Weekend Friday',
    icon: 'calendar',
    color: '#10b981', // Aurora Emerald - northern lights green
    secondaryColor: '#34d399', // Emerald-400
    gradient: ['#10b981', '#059669'], // Emerald-500 to Emerald-600
    description: 'Weekend plans, excitement, and freedom - share what you\'re looking forward to',
    shortDesc: 'Weekend vibes & plans',
    vibe: 'Liberated, Playful, Celebratory',
    placeholder: 'What\'s your weekend vibe?',
    reactions: {
      first: { emoji: '🎊', label: 'Party' },
      second: { emoji: '😎', label: 'Cool' },
      third: { emoji: '🌈', label: 'Vibe' },
    },
  },
  saturday: {
    id: 'saturday',
    name: 'Creative Saturday',
    icon: 'brush',
    color: '#00f5ff', // Neon Cyan - electric, vibrant, creative
    secondaryColor: '#33f5ff', // Lighter neon cyan
    gradient: ['#00f5ff', '#00d4e6'], // Neon cyan to deeper cyan
    description: 'Things that feed your soul - hobbies, passions, creative pursuits, and authentic self',
    shortDesc: 'Passions & creativity',
    vibe: 'Authentic, Personal, Meaningful',
    placeholder: 'What feeds your soul today?',
    reactions: {
      first: { emoji: '🎨', label: 'Art' },
      second: { emoji: '✨', label: 'Magic' },
      third: { emoji: '💜', label: 'Soul' },
    },
  },
  sunday: {
    id: 'sunday',
    name: 'Offline Sunday',
    icon: 'power',
    color: '#3b82f6', // Stellar Blue - deep space blue
    secondaryColor: '#60a5fa', // Blue-400
    gradient: ['#3b82f6', '#2563eb'], // Blue-500 to Blue-600
    description: 'Digital detox, slow living, rest and recovery - embrace the quiet moments',
    shortDesc: 'Peace & simplicity',
    vibe: 'Peaceful, Minimal, Restorative',
    placeholder: 'Share your peaceful moment...',
    reactions: {
      first: { emoji: '🧘', label: 'Zen' },
      second: { emoji: '😌', label: 'Calm' },
      third: { emoji: '🕊️', label: 'Peace' },
    },
  },
};

export const getCurrentDay = (): DayOfWeek => {
  const dayIndex = new Date().getDay();
  const days: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[dayIndex];
};

export const getDayTheme = (day: DayOfWeek): DayTheme => {
  return DAY_THEMES[day];
};

export const getAllDayThemes = (): DayTheme[] => {
  return [
    DAY_THEMES.monday,
    DAY_THEMES.tuesday,
    DAY_THEMES.wednesday,
    DAY_THEMES.thursday,
    DAY_THEMES.friday,
    DAY_THEMES.saturday,
    DAY_THEMES.sunday,
  ];
};

