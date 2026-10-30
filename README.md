# ODC-D3 - Open Data Charts for D3 

[Online examples](https://mwasiluk.github.io/ODC-d3/)

## Usage

Include odc-d3.min.js and odc-d3.min.css from 'dist' folder in your HTML.  
```html
<link href="odc-d3.min.css" rel="stylesheet">
<script src="odc-d3.min.js"></script>
```

odc-d3.min.js must be included after [d3.js](https://d3js.org/).

- od3-d3 `1.x` version (master branch) requires d3.js `4.x` 
- od3-d3 `0.x` version (d3v3 branch)   requires d3.js `3.x` (`^3.5`)

### NPM
You can install this package through `NPM` :

    npm install odc-d3 --save




## Development

Node.js 22 (as in CI) and npm:

```bash
npm ci
npm run build          # dist/: CSS (Dart Sass) and both JS bundles (Rollup)
npm run watch          # rebuild on changes, Ctrl+C stops
npm run serve          # examples at http://127.0.0.1:8089/examples/
npm run test:build     # build in an isolated copy and run the contract tests on it
npm test               # contract tests on dist/, see docs/modernization/TESTING.md
```

<br/><br/>
<img src="http://routetopa.eu/wp-content/uploads/2015/06/eu-flag.jpg" width="22">
This project has received funding from the European Union’s Horizon 2020 research and innovation programme under grant agreement No 645860.
