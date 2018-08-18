export const defaultPattern = [
  '#00bbde',
  '#fe6672',
  '#eeb058',
  '#8a8ad6',
  '#ff855c',
  '#00cfbb',
  '#5a9eed',
  '#73d483',
  '#c879bb',
  '#0099b6',
  '#d74d58',
  '#cb9141',
  '#6b6bb6',
  '#d86945',
  '#00aa99',
  '#4281c9',
  '#57b566',
  '#ac5c9e',
  '#27cceb',
  '#ff818b',
  '#f6bf71',
  '#9b9be1',
  '#ff9b79',
  '#26dfcd',
  '#73aff4',
  '#87e096',
  '#d88bcb'
];

export const formatDateShort = date =>
  date.toLocaleString('pl-PL', {
    month: '2-digit',
    day: 'numeric'
  });

export const formatDates = range => {
  return `${formatDateShort(new Date(range.from))} - ${formatDateShort(
    new Date(range.to)
  )}`;
};
