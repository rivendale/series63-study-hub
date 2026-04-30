// Series 63 exam structure per NASAA / FINRA, current as of 2026.
// 65 questions delivered: 60 scored + 5 unscored "pretest" items
// distributed randomly. 75-minute window. Pass = 43 of 60 scored
// (rounds to 72%). Content outline effective June 12, 2023.

export const examInfo = {
  name: 'Series 63',
  fullName: 'Uniform Securities Agent State Law Examination',
  totalQuestions: 65,
  scoredQuestions: 60,
  pretestQuestions: 5,
  passingScore: 43,
  passPercentage: 72,
  passingPercent: 72,
  timeMinutes: 75,
  retakeWaitDays: {
    afterFirstFail: 30,
    afterSecondFail: 30,
    afterThirdFail: 180,
  },
  enrollmentWindowDays: 120,
  testCenter: 'Prometric',
  sponsor: 'NASAA / FINRA',
  developer: 'NASAA',
  contentRevisionDate: '2023-06-12',
  version: '1.0.0',
};
