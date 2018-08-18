const millisecondsPerDay = 24 * 60 * 60 * 1000;

const subDays = (date, days) => new Date(date.getTime() - days * millisecondsPerDay);

const addMilliseconds = (date, millis) => new Date(date.getTime() + millis);

const isAfter = (a, b) => Date.parse(a) > Date.parse(b);

const endOfDay = date => {
  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999);
  return endOfDay;
};

export const generateRanges = ({ endingDate = endOfDay(Date.now()), daysInRange = 7, rangeCount = 4 }) =>
  Array.from({ length: rangeCount }, (v, i) => {
    const from = addMilliseconds(subDays(endingDate, daysInRange * (rangeCount - i)), 1);
    const to = subDays(endingDate, daysInRange * (rangeCount - i - 1));
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

const groupInitialEventsByWeek = (initalEvents, ranges) => {
  const grouped = ranges.map(w => new Map());
  initalEvents.forEach(initialEvent => {
    const rangeIndex = getWeekIndex(initialEvent.date, ranges);
    if (rangeIndex < 0) {
      return;
    }
    grouped[rangeIndex].set(initialEvent.id, initialEvent.date);
  });
  return grouped;
};

const getActiveInstances = async (getActivity, from, to, weekIndex) => {
  const functions = typeof getActivity === 'object' ? getActivity : { activity: getActivity };
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

  const activity = new Map();

  all.forEach(activityResults => {
    const name = activityResults.name;
    activityResults.results.forEach(instance => {
      if (activity.has(instance)) {
        activity.get(instance).push(name);
      } else {
        activity.set(instance, [name]);
      }
    });
  });
  return activity;
};

const getActivityInRanges = async (getActivity, ranges) => {
  const activityInRanges = [];
  for (let rangeIndex in ranges) {
    const range = ranges[rangeIndex];
    const activity = await getActiveInstances(getActivity, range.from, range.to, rangeIndex);
    activityInRanges[rangeIndex] = activity;
  }
  return activityInRanges;
};

const getInstancesActiveInRange = (initialEventInRange, activity) => {
  const activeInstances = new Map();
  for (let [instanceId, instanceActivity] of activity) {
    if (initialEventInRange.has(instanceId)) {
      activeInstances.set(instanceId, instanceActivity);
    }
  }
  return activeInstances;
};

const mapToObject = map => {
  const obj = {};
  for (let [k, v] of map) {
    obj[k] = v;
  }
  return obj;
};

const buildRetentionMatrix = ({ dateRanges, activityInRanges, groupedInitialEvents }) => {
  return dateRanges.map((range, rangeIndex) => {
    const initialEventInRange = groupedInitialEvents[rangeIndex];

    const activity = Object.keys(activityInRanges)
      .filter(index => index >= rangeIndex)
      .map((index, i) => {
        const activity = activityInRanges[index];
        const activeInstances = getInstancesActiveInRange(initialEventInRange, activity);
        const activeCount = activeInstances.size;
        const evalsCount = initialEventInRange.size;
        const percentage = Math.round((activeCount / evalsCount) * 100);
        return {
          activeCount,
          percentage,
          activeInstances: mapToObject(activeInstances)
        };
      });

    return {
      range,
      activity,
      evaluations: mapToObject(initialEventInRange)
    };
  });
};

export const buildMatrix = async ({ dateRanges = generateRanges(), getInitialEvents, getActivity }) => {
  const initialEvents = await getInitialEvents();
  const groupedInitialEvents = groupInitialEventsByWeek(initialEvents, dateRanges);
  const activityInRanges = await getActivityInRanges(getActivity, dateRanges);
  const matrix = buildRetentionMatrix({ dateRanges, groupedInitialEvents, activityInRanges });
  return matrix;
};
