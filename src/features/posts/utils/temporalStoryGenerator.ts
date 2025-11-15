/**
 * Temporal Story Generator
 * V2: Generates emotionally engaging, story-driven temporal narratives
 */

import type { TemporalStory } from '../components/TemporalStoryCard';

interface TemporalData {
  matches: number;
  total: number;
  comparison?: string;
}

interface TemporalPeriods {
  week: TemporalData;
  month: TemporalData;
  year: TemporalData;
  allTime: TemporalData;
}

/**
 * Generate story-driven temporal cards based on data
 */
export function generateTemporalStories(
  temporal: TemporalPeriods,
  currentMatchCount: number
): TemporalStory[] {
  const stories: TemporalStory[] = [];

  // Analyze each timeframe and generate appropriate story
  const timeframes: Array<keyof TemporalPeriods> = ['week', 'month', 'year', 'allTime'];
  
  for (const timeframe of timeframes) {
    const data = temporal[timeframe];
    const matches = data.matches || 0;
    const total = data.total || 1;
    
    // Determine story type and generate narrative
    const story = generateStoryForTimeframe(
      timeframe,
      matches,
      total,
      currentMatchCount,
      temporal
    );
    
    if (story) {
      stories.push(story);
    }
  }

  // Return all 4 stories (week, month, year, allTime) for 2x2 grid
  // Keep original order: week, month, year, allTime
  return stories;
}

function generateStoryForTimeframe(
  timeframe: 'week' | 'month' | 'year' | 'allTime',
  matches: number,
  total: number,
  currentMatchCount: number,
  allPeriods: TemporalPeriods
): TemporalStory | null {
  const others = Math.max(0, matches - 1);
  
  // Check for milestones (10th, 25th, 50th, 100th, etc.)
  const milestones = [10, 25, 50, 100, 250, 500, 1000];
  const milestone = milestones.find(m => matches === m);

  // Determine trend by comparing with previous period
  let trend: 'up' | 'down' | 'stable' | undefined;
  if (timeframe === 'month') {
    const weekMatches = allPeriods.week.matches || 0;
    if (matches > weekMatches * 4) trend = 'up';
    else if (matches < weekMatches * 2) trend = 'down';
    else trend = 'stable';
  } else if (timeframe === 'year') {
    const monthMatches = allPeriods.month.matches || 0;
    if (matches > monthMatches * 12) trend = 'up';
    else if (matches < monthMatches * 6) trend = 'down';
    else trend = 'stable';
  }

  // Generate story based on scenario
  if (matches <= 1) {
    // Pioneer story
    const titles = {
      week: "You're the Week's Pioneer! 🌟",
      month: "You're the Month's Trailblazer! 🚀",
      year: "You're the Year's Innovator! 💫",
      allTime: "You're the First Ever! ✨",
    };
    
    const stories = {
      week: "You started this trend. No one else did this yet this week.",
      month: "You're leading the way. You're the first to do this this month.",
      year: "You're the pioneer. You're the first to share this this year.",
      allTime: "You're making history. You're the very first person to do this.",
    };

    return {
      timeframe,
      type: 'pioneer',
      title: titles[timeframe],
      story: stories[timeframe],
      matches,
      total,
    };
  }

  if (milestone) {
    // Milestone story
    const milestoneTitles = {
      week: `You're the ${milestone}th Person This Week! 🎉`,
      month: `You're the ${milestone}th Person This Month! 🎊`,
      year: `You're the ${milestone}th Person This Year! 🏆`,
      allTime: `You're the ${milestone}th Person Ever! 🌟`,
    };

    const milestoneStories = {
      week: `You hit a milestone! ${milestone} people have done this this week.`,
      month: `You're part of something special. ${milestone} people joined you this month.`,
      year: `You're celebrating a milestone. ${milestone} people have done this this year.`,
      allTime: `You're making history. You're the ${milestone}th person to do this.`,
    };

    return {
      timeframe,
      type: 'milestone',
      title: milestoneTitles[timeframe],
      story: milestoneStories[timeframe],
      matches,
      total,
      milestone,
    };
  }

  if (trend === 'up' && matches > 5) {
    // Growth story
    const growthTitles = {
      week: "This Is Catching On! 📈",
      month: "This Is Growing Fast! 🚀",
      year: "This Is Trending! 🔥",
      allTime: "This Is Popular! 💫",
    };

    const growthStories = {
      week: `${others} people joined you this week. This is becoming a movement.`,
      month: `${others} people did this this month. You're part of a growing community.`,
      year: `${others} people have done this this year. This is catching on!`,
      allTime: `${others} people have done this. You're part of a popular trend.`,
    };

    return {
      timeframe,
      type: 'growth',
      title: growthTitles[timeframe],
      story: growthStories[timeframe],
      matches,
      total,
      trend: 'up',
    };
  }

  if (matches > 10) {
    // Community story
    const communityTitles = {
      week: "You're Part of a Community! 👥",
      month: "You're Connected! 🤝",
      year: "You're in Good Company! 🌍",
      allTime: "You're Not Alone! 💙",
    };

    const communityStories = {
      week: `You're part of a ${matches}-person community this week. You're connected.`,
      month: `${others} others did this this month. You're part of something bigger.`,
      year: `${others} people have done this this year. You're in good company.`,
      allTime: `${others} people have done this. You're part of a community.`,
    };

    return {
      timeframe,
      type: 'community',
      title: communityTitles[timeframe],
      story: communityStories[timeframe],
      matches,
      total,
    };
  }

  if (matches <= 3 && matches > 1) {
    // Rare story
    const rareTitles = {
      week: "You're Keeping This Alive! 💎",
      month: "This Is Rare! ✨",
      year: "You're One of the Few! 🌟",
      allTime: "This Is Special! 💫",
    };

    const rareStories = {
      week: `Only ${others} others did this this week. You're keeping something rare alive.`,
      month: `Only ${others} others did this this month. This is special and rare.`,
      year: `Only ${others} others have done this this year. You're one of the few.`,
      allTime: `Only ${others} others have done this. This is truly special.`,
    };

    return {
      timeframe,
      type: 'rare',
      title: rareTitles[timeframe],
      story: rareStories[timeframe],
      matches,
      total,
      trend: 'down',
    };
  }

  // Stable/Default story
  const stableTitles = {
    week: "You're Part of This! 🌟",
    month: "You're Connected! 💫",
    year: "You're in This! ✨",
    allTime: "You're Part of History! 🚀",
  };

  const stableStories = {
    week: `${others} others did this this week. You're part of this.`,
    month: `${others} others did this this month. You're connected.`,
    year: `${others} others have done this this year. You're in this.`,
    allTime: `${others} others have done this. You're part of history.`,
  };

  return {
    timeframe,
    type: 'stable',
    title: stableTitles[timeframe],
    story: stableStories[timeframe],
    matches,
    total,
    trend: 'stable',
  };
}

