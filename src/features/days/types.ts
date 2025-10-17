/**
 * Themed Days Types
 * Each day of the week has its own vibe, community, and purpose
 */

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface DayTheme {
  id: DayOfWeek;
  name: string;
  icon: 'mask' | 'star' | 'dice' | 'heart' | 'party' | 'sparkle' | 'wave';
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
}

export const DAY_THEMES: Record<DayOfWeek, DayTheme> = {
  monday: {
    id: 'monday',
    name: 'Unpopular Monday',
    icon: 'mask',
    color: '#a78bfa',
    secondaryColor: '#c4b5fd',
    gradient: ['#a78bfa', '#8b5cf6'],
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
    name: 'Tiny Wins',
    icon: 'star',
    color: '#fbbf24',
    secondaryColor: '#fcd34d',
    gradient: ['#fbbf24', '#f59e0b'],
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
    name: 'Wildcard',
    icon: 'dice',
    color: '#22d3ee',
    secondaryColor: '#67e8f9',
    gradient: ['#22d3ee', '#06b6d4'],
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
    name: 'Thankful Thoughts',
    icon: 'heart',
    color: '#f472b6',
    secondaryColor: '#f9a8d4',
    gradient: ['#f472b6', '#ec4899'],
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
    name: 'Free Spirit',
    icon: 'party',
    color: '#fb7185',
    secondaryColor: '#fda4af',
    gradient: ['#fb7185', '#f43f5e'],
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
    name: 'Soul Actions',
    icon: 'sparkle',
    color: '#e879f9',
    secondaryColor: '#f0abfc',
    gradient: ['#e879f9', '#d946ef'],
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
    name: 'Silent Sunday',
    icon: 'wave',
    color: '#38bdf8',
    secondaryColor: '#7dd3fc',
    gradient: ['#38bdf8', '#0ea5e9'],
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

