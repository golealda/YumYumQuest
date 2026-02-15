import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSubscriptionActive } from './subscriptionPreference';

const QUESTS_KEY = 'premium_quests';
const SAVING_GOALS_KEY = 'premium_saving_goals';
const BONUS_RULE_KEY = 'premium_bonus_rule';

export type QuestDifficulty = 'basic' | 'template';

export interface QuestItem {
    id: string;
    title: string;
    rewardCoins: number;
    difficulty: QuestDifficulty;
    createdAt: string;
}

export interface SavingGoal {
    id: string;
    title: string;
    targetCoins: number;
    currentCoins: number;
    dailySavingCoins: number;
    createdAt: string;
}

export interface BonusRule {
    enabled: boolean;
    streakDays: number;
    bonusCoins: number;
}

export interface DailyHabitRecord {
    day: string;
    total: number;
    success: number;
    topHabit: string;
}

export interface AdvancedReport {
    weeklyScore: number;
    monthlyScore: number;
    topSuccessHabit: string;
    failurePattern: string;
    weekdayRates: Array<{ label: string; rate: number }>;
    spendingTendency: '소비형' | '저축형' | '균형형';
    goalPace: '빠름' | '보통' | '느림';
    rewardPreference: string;
}

const defaultRecords: DailyHabitRecord[] = [
    { day: '월', total: 4, success: 4, topHabit: '아침 정리' },
    { day: '화', total: 4, success: 3, topHabit: '숙제 완료' },
    { day: '수', total: 4, success: 2, topHabit: '독서 20분' },
    { day: '목', total: 4, success: 3, topHabit: '용돈 기록' },
    { day: '금', total: 5, success: 5, topHabit: '숙제 완료' },
    { day: '토', total: 3, success: 1, topHabit: '방 청소' },
    { day: '일', total: 3, success: 2, topHabit: '독서 20분' },
];

const defaultBonusRule: BonusRule = {
    enabled: true,
    streakDays: 7,
    bonusCoins: 20,
};

const parseJson = <T>(value: string | null, fallback: T): T => {
    if (!value) return fallback;
    try {
        return JSON.parse(value) as T;
    } catch (error) {
        return fallback;
    }
};

export const getQuestLimit = async (): Promise<number> => {
    const premium = await getSubscriptionActive();
    return premium ? Number.MAX_SAFE_INTEGER : 3;
};

export const getQuests = async (): Promise<QuestItem[]> => {
    const raw = await AsyncStorage.getItem(QUESTS_KEY);
    return parseJson<QuestItem[]>(raw, []);
};

export const addQuest = async (quest: Omit<QuestItem, 'id' | 'createdAt'>): Promise<{ ok: boolean; reason?: string }> => {
    const [premium, quests] = await Promise.all([getSubscriptionActive(), getQuests()]);

    if (!premium && quests.length >= 3) {
        return { ok: false, reason: '무료 플랜은 퀘스트 3개까지 등록할 수 있어요.' };
    }

    const next: QuestItem[] = [
        ...quests,
        {
            id: `quest_${Date.now()}`,
            createdAt: new Date().toISOString(),
            ...quest,
        },
    ];

    await AsyncStorage.setItem(QUESTS_KEY, JSON.stringify(next));
    return { ok: true };
};

export const getQuestTemplates = async (age: number): Promise<Array<{ title: string; rewardCoins: number }>> => {
    const premium = await getSubscriptionActive();

    if (!premium) {
        return [
            { title: '양치 2번 하기', rewardCoins: 5 },
            { title: '장난감 정리하기', rewardCoins: 5 },
        ];
    }

    if (age <= 8) {
        return [
            { title: '동화책 15분 읽기', rewardCoins: 8 },
            { title: '감사일기 3줄 쓰기', rewardCoins: 10 },
            { title: '주말 식탁 돕기', rewardCoins: 12 },
        ];
    }

    return [
        { title: '경제 뉴스 1개 요약', rewardCoins: 12 },
        { title: '예산표 직접 작성', rewardCoins: 15 },
        { title: '일주일 소비 회고', rewardCoins: 14 },
    ];
};

export const getSavingGoals = async (): Promise<SavingGoal[]> => {
    const raw = await AsyncStorage.getItem(SAVING_GOALS_KEY);
    return parseJson<SavingGoal[]>(raw, []);
};

export const upsertSavingGoal = async (goal: Omit<SavingGoal, 'id' | 'createdAt'> & { id?: string }): Promise<void> => {
    const goals = await getSavingGoals();

    if (goal.id) {
        const updated = goals.map((item) => {
            if (item.id !== goal.id) return item;
            return { ...item, ...goal } as SavingGoal;
        });
        await AsyncStorage.setItem(SAVING_GOALS_KEY, JSON.stringify(updated));
        return;
    }

    const next: SavingGoal[] = [
        ...goals,
        {
            id: `goal_${Date.now()}`,
            createdAt: new Date().toISOString(),
            title: goal.title,
            targetCoins: goal.targetCoins,
            currentCoins: goal.currentCoins,
            dailySavingCoins: goal.dailySavingCoins,
        },
    ];

    await AsyncStorage.setItem(SAVING_GOALS_KEY, JSON.stringify(next));
};

export const estimateGoalDate = (goal: SavingGoal): string => {
    const remaining = Math.max(goal.targetCoins - goal.currentCoins, 0);
    const safeDaily = Math.max(goal.dailySavingCoins, 1);
    const days = Math.ceil(remaining / safeDaily);
    const date = new Date();
    date.setDate(date.getDate() + days);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
};

export const getBonusRule = async (): Promise<BonusRule> => {
    const raw = await AsyncStorage.getItem(BONUS_RULE_KEY);
    return parseJson<BonusRule>(raw, defaultBonusRule);
};

export const setBonusRule = async (rule: BonusRule): Promise<void> => {
    await AsyncStorage.setItem(BONUS_RULE_KEY, JSON.stringify(rule));
};

export const applyStreakBonus = async (currentCoins: number, currentStreakDays: number): Promise<number> => {
    const rule = await getBonusRule();
    if (!rule.enabled) return currentCoins;
    if (currentStreakDays < rule.streakDays) return currentCoins;
    return currentCoins + rule.bonusCoins;
};

export const buildAdvancedReport = (records: DailyHabitRecord[] = defaultRecords): AdvancedReport => {
    const totalTasks = records.reduce((acc, row) => acc + row.total, 0);
    const successTasks = records.reduce((acc, row) => acc + row.success, 0);

    const weeklyScore = Math.round((successTasks / Math.max(totalTasks, 1)) * 100);
    const monthlyScore = Math.min(100, Math.round(weeklyScore * 0.95 + 4));

    const topHabitMap = new Map<string, number>();
    records.forEach((row) => {
        topHabitMap.set(row.topHabit, (topHabitMap.get(row.topHabit) ?? 0) + row.success);
    });

    const topSuccessHabit = [...topHabitMap.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '없음';

    const weakest = [...records].sort((a, b) => a.success / Math.max(a.total, 1) - b.success / Math.max(b.total, 1))[0];
    const failurePattern = weakest ? `${weakest.day} 수행률 저조` : '실패 패턴 없음';

    const weekdayRates = records.map((row) => ({
        label: row.day,
        rate: Math.round((row.success / Math.max(row.total, 1)) * 100),
    }));

    const spendingTendency: AdvancedReport['spendingTendency'] = weeklyScore >= 80 ? '저축형' : weeklyScore >= 60 ? '균형형' : '소비형';
    const goalPace: AdvancedReport['goalPace'] = monthlyScore >= 85 ? '빠름' : monthlyScore >= 65 ? '보통' : '느림';

    const rewardPreference = spendingTendency === '저축형' ? '장기 목표형 보상 선호' : '즉시 보상형 선호';

    return {
        weeklyScore,
        monthlyScore,
        topSuccessHabit,
        failurePattern,
        weekdayRates,
        spendingTendency,
        goalPace,
        rewardPreference,
    };
};

export const createReportPdfPayload = (report: AdvancedReport): string => {
    return [
        '[경제 교육 리포트]',
        `주간 성실도: ${report.weeklyScore}점`,
        `월간 성실도: ${report.monthlyScore}점`,
        `성공 습관: ${report.topSuccessHabit}`,
        `실패 패턴: ${report.failurePattern}`,
        `경제 성향: ${report.spendingTendency}`,
        `목표 달성 속도: ${report.goalPace}`,
        `보상 선호: ${report.rewardPreference}`,
    ].join('\n');
};
