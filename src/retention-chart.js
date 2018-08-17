import c3 from 'c3';
import ordinal from 'ordinal';
import { defaultPattern, formatDates } from './common';

export default ({ container, matrix, colorPattern = defaultPattern, options = {} }) => {
    const columns = [...matrix].reverse().map((cohort, index) => {
        const label = formatDates(cohort.range);
        if (Object.keys(cohort.evaluations).length === 0) {
            return [label];
        }
        const values = cohort.activity.map(({ percentage }) => percentage);
        return [label, ...values];
    });

    return c3.generate({
        bindto: container,
        data: {
            columns
        },
        axis: {
            x: {
                type: 'category',
                categories: matrix.map((range, i) => `${ordinal(i + 1)} week`)
            },
            y: {
                padding: {
                    bottom: 0,
                    top: 10
                },
                min: 0,
                max: 100,
                tick: {
                    format: x => `${x} %`
                }
            }
        },
        legend: {
            show: false
        },
        color: {
            pattern: colorPattern
        },
        ...options
    });
};
