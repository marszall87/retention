# Retention - build retention matrix, render table or chart with data

![Screenshot](https://raw.githubusercontent.com/marszall87/retention/master/screenshot.png)

## Installation

```sh
$ npm i retention
```

D3 and C3 libraries are not included in the bundle, you have to install them separately.

#### ES6 modules

```js
import { buildMatrix, renderTable, renderChart } from 'retention';
```

#### CommonJS

```js
const { buildMatrix } = require('retention');
```

_Notice:_ Because CJS modules are almost always used in NodeJS backend code (Webpack or Rollup should automatically use UMD or ESM version), this version includes only `buildMatrix` function, no rendering functions. If you want those you should probably explicitly include the UMD version:

```js
const { buildMatrix, renderTable, renderChart } = require('retention/dist/retention.umd.js');
```

#### Browser

```html
<script src="https://cdn.jsdelivr.net/npm/retention@latest"></script>
<script>
    const { buildMatrix, renderTable, renderChart } = Retention;
</script>
```

#### CSS

There's also a simple CSS file which adds some styling to the table:

```html
<link href="https://cdn.jsdelivr.net/npm/retention@latest/dist/retention.min.css" rel="stylesheet" />
```

## Sample

Clone the repo, install dependencies, build the bundle, and start a simple web server with these commands:

```sh
git clone https://github.com/marszall87/retention.git
cd retention
npm install
npm run build
npm run sample
```

Navigate to `http://localhost:5000/sample` and you should see a sample retention chart and table.

## API

### buildMatrix(opts)

Returns promise with retention matrix object.

`opts.dateRanges` - `Array` of `{ from, to }` objects that defines date ranges for cohorts, if not specified it's 4 last weeks

`opts.getInitialEvents` - function that should return a promise with `Array` of objects with two props: `date` and `id`, date represents

`opts.getActivity` - function or object in form of `{ eventsA: () => {...}, eventsB: () => {...} }`, functions take three args: start date, end date and index of a given cohort date range, should return an `Array` of ids that were active in that time

### generateRanges(opts)

Helper function that generates cohor date ranges.

`opts.endingDate` - ending date of the last (most recent) cohort, end of the current day by default

`opts.daysInRange` - number of days in every date range, default is 7

`opts.rangeCount` - number of date ranges to generate, 4 by default

### renderTable(opts)

`opts.container` - container in which the table will be rendered

`opts.matrix` - retention matrix as returned by `buildMatrix()`

### renderChart(opts)

`opts.container` - container in which the chart will be rendered

`opts.matrix` - retention matrix as returned by `buildMatrix()`

`opts.options` - options passed directly to `c3.generate` function, can be used to modify the chart, full list of options available in [C3 docs](https://c3js.org/reference.html).

## License

MIT © [Michał Nykiel](https://github.com/marszall87)
