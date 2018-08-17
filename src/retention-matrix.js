import {
  subWeeks,
  addWeeks,
  isAfter,
  endOfDay,
  addMilliseconds
} from 'date-fns';

const generateRanges = (startingDate, count) =>
  Array.from({ length: count }, (v, i) => {
    const from = addMilliseconds(subWeeks(startingDate, count - i), 1);
    const to = subWeeks(startingDate, count - i - 1);
    return {
      from,
      to
    };
  });

const getWeekIndex = (date, weeks) => {
  return weeks.findIndex(week => {
    return isAfter(date, week.from) && isAfter(week.to, date);
  });
};

const groupEvaluationsByWeek = (evaluations, weeks) => {
  return evaluations.reduce((grouped, evaluation) => {
    const weekIndex = getWeekIndex(evaluation.date, weeks);
    if (weekIndex < 0) {
      return grouped;
    }
    return [
      ...grouped.slice(0, weekIndex),
      {
        ...grouped[weekIndex],
        [evaluation.id]: evaluation.date
      },
      ...grouped.slice(weekIndex + 1)
    ];
  }, weeks.map(w => ({})));
};

// const timeframeFormat = date => date.toISOString();

const getActiveInstances = async (getActivity, from, to, weekIndex) => {
  const functions =
    typeof getActivity === 'object' ? getActivity : { activity: getActivity };
  const all = await Promise.all(
    Object.keys(functions).map(async name => {
      const f = functions[name];
      const results = await f(from, to, weekIndex);
      return {
        name,
        results
      };
    })
  );

  const activity = all.reduce((a, activityResults) => {
    const name = activityResults.name;
    return activityResults.results.reduce(
      (obj, instance) => ({
        ...obj,
        [instance]: [...(obj[instance] || []), name]
      }),
      a
    );
  }, {});

  return activity;
};

const getWeeklyActivity = async (getActivity, weeks) => {
  const weeklyActivity = [];
  for (let weekIndex in weeks) {
    const week = weeks[weekIndex];
    const activity = await getActiveInstances(
      getActivity,
      week.from,
      week.to,
      weekIndex
    );
    weeklyActivity[weekIndex] = activity;
  }
  return weeklyActivity;
};

const getInstancesActiveInWeek = (weeklyEvaluations, activity) => {
  return Object.keys(activity).reduce((active, instanceId) => {
    if (weeklyEvaluations[instanceId]) {
      return {
        ...active,
        [instanceId]: activity[instanceId]
      };
    }
    return active;
  }, {});
};

const buildRetentionMatrix = ({ ranges, weeklyActivity, evaluations }) => {
  return ranges.map((range, rangeIndex) => {
    const weeklyEvaluations = evaluations[rangeIndex];

    const activity = Object.keys(weeklyActivity)
      .filter(index => index >= rangeIndex)
      .map((index, i) => {
        const activity = weeklyActivity[index];
        const activeInstances = getInstancesActiveInWeek(
          weeklyEvaluations,
          activity
        );
        const activeCount = Object.keys(activeInstances).length;
        const evalsCount = Object.keys(weeklyEvaluations).length;
        const percentage = Math.round((activeCount / evalsCount) * 100);
        return {
          activeCount,
          percentage,
          activeInstances
        };
      });

    return {
      range,
      activity,
      evaluations: weeklyEvaluations
    };
  });
};

export const buildMatrix = async ({
  startingDate = endOfDay(Date.now()),
  numberOfWeeks,
  getInitialEvents,
  getActivity
}) => {
  const ranges = generateRanges(startingDate, numberOfWeeks);
  const startingEvents = await getInitialEvents();
  const evaluations = groupEvaluationsByWeek(startingEvents, ranges);
  const weeklyActivity = await getWeeklyActivity(getActivity, ranges);
  const matrix = buildRetentionMatrix({ ranges, evaluations, weeklyActivity });
  return matrix;
};
