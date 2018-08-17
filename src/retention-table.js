import { defaultPattern, formatDates } from './common';
import ordinal from 'ordinal';
import html from 'hyperhtml/esm';
import style from './style.css';

const renderCell = ({ rangeIndex, rangeCount }, content) => {
  const bg = `rgba(255,255,255,${((rangeIndex + 1) / rangeCount) * 0.3})`;
  return html`<td class="${style.cell}" style="${{
    backgroundColor: bg
  }}">${content}</td>`;
};

const renderCohortRow = ({
  range,
  rangeCount,
  cohortIndex,
  evaluations,
  activity,
  colorPattern
}) => {
  const evaluationsCount = Object.keys(evaluations).length;

  return html`
        <tr class="${style.row}" style=${{
    backgroundColor: colorPattern[rangeCount - cohortIndex - 1]
  }}>
            <td>${formatDates(range)}</td>
            ${renderCell(
              {
                rangeCount,
                rangeIndex: 0
              },
              evaluationsCount
            )}
            ${activity.map(
              ({ activeCount, activeInstances, percentage }, i) => {
                const percentageLabel = percentage ? `${percentage}%` : '-';
                const content = html`${activeCount}<small class="${
                  style.subtext
                }">${percentageLabel}</small>`;
                return renderCell(
                  {
                    rangeCount,
                    rangeIndex: i + 1
                  },
                  content
                );
              }
            )}
        </tr>`;
};

const renderHeader = content =>
  html`<th class="${style.header}">${content}</th>`;

export const renderTable = ({
  container,
  matrix,
  colorPattern = defaultPattern
}) => {
  const rangeCount = matrix.length;
  return container.appendChild(html`
        <table class="${style.table}">
            <thead>
                <tr>
                    <th class="${style.header}">Cohort</th>
                    <th class="${style.header}">Evals started</th>
                    ${matrix.map((activity, index) =>
                      renderHeader(`${ordinal(index + 1)} week`)
                    )}
                </tr>
            </thead>
            ${matrix.map((cohort, cohortIndex) =>
              renderCohortRow({
                cohortIndex,
                rangeCount,
                range: cohort.range,
                evaluations: cohort.evaluations,
                activity: cohort.activity,
                colorPattern
              })
            )}
        </table>
    `);
};
