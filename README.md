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
const { buildMatrix, renderTable, renderChart } = require('retention');
```

#### Browser

```html
<script src="https://cdn.jsdelivr.net/npm/retention"></script>
<script>
    const { buildMatrix, renderTable, renderChart } = Retention;
</script>
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

Navigate to `http://localhost:5000` and you should see a sample retention chart and table.

## API

### buildMatrix(opts)

Returns promise with retention matrix object.

`opts.startingDate` - `Date` object, defines the end of the last week used to calculate retention, you probably want to use today or yesterday here

`opts.numberOfWeeks` - number of weeks you want to generate retention for

`opts.getInitialEvents` - function that should return a promise with `Array` of objects with two props: `date` and `id`, date represents

`opts.getActivity` - function or object in form of `{ eventsA: () => {...}, eventsB: () => {...} }`, functions take three args: start date, end date and index of a given time range, should return an `Array` of ids that were active in that range

### renderTable(opts)

`opts.container` - container in which the table will be rendered

`opts.matrix` - retention matrix as returned by `buildMatrix()`

### renderChart(opts)

`opts.container` - container in which the chart will be rendered

`opts.matrix` - retention matrix as returned by `buildMatrix()`

## License

MIT © [Michał Nykiel](https://github.com/marszall87)
