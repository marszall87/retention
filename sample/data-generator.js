const chance = require('chance').Chance();
const fs = require('fs');

const ranges = [
  {
    from: '2018-02-01T00:00:00.000Z',
    to: '2018-02-07T23:59:59.999Z'
  },
  {
    from: '2018-02-08T00:00:00.000Z',
    to: '2018-02-14T23:59:59.999Z'
  },
  {
    from: '2018-02-15T00:00:00.000Z',
    to: '2018-02-21T23:59:59.999Z'
  },
  {
    from: '2018-02-22T00:00:00.000Z',
    to: '2018-02-28T23:59:59.999Z'
  }
];

const userCount = 4000;

const ids = Array.from({ length: userCount }).map(() => {
  return chance.hash({ length: 8 });
});

const activityLikelihoods = [[35, 15, 10, 5], [40, 18, 12], [42, 30], [47]];

const idsWithRange = ids.map(id => {
  const range = chance.pickone(ranges);
  const date = new Date(chance.integer({ min: Date.parse(range.from), max: Date.parse(range.to) }));
  return { id, date, range };
});

const initialEvents = idsWithRange.map(({ id, range }) => {
  const date = new Date(chance.integer({ min: Date.parse(range.from), max: Date.parse(range.to) }));
  return { id, date };
});

const generateActivityEvents = idsWithRange =>
  idsWithRange.reduce((events, { id, range }) => {
    const rangeIndex = ranges.indexOf(range);
    return [
      ...events.map((r, index) => {
        if (index < rangeIndex) {
          return r;
        }
        const likelihood = activityLikelihoods[rangeIndex][index - rangeIndex];
        if (!chance.bool({ likelihood })) {
          return r;
        }
        const ids = r.ids || [];
        return {
          ...r,
          ids: [...ids, id]
        };
      })
    ];
  }, ranges);

const eventsA = generateActivityEvents(idsWithRange);
const eventsB = generateActivityEvents(idsWithRange);
const eventsC = generateActivityEvents(idsWithRange);

fs.writeFileSync('./initial-events.json', JSON.stringify(initialEvents, null, 2));
fs.writeFileSync('./events-a.json', JSON.stringify(eventsA, null, 2));
fs.writeFileSync('./events-b.json', JSON.stringify(eventsB, null, 2));
fs.writeFileSync('./events-c.json', JSON.stringify(eventsC, null, 2));
