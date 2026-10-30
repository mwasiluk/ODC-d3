#!/usr/bin/env node
// Removes dist/ before a full build (`npm run build`), on any OS.
'use strict';

const fs = require('fs');
const path = require('path');

fs.rmSync(path.resolve(__dirname, '..', 'dist'), {recursive: true, force: true});
