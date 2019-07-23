const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const less = require('gulp-less');
const babel = require('gulp-babel');
const chalk = require('chalk');
const shell = require('shelljs');

const content = fs.readFileSync(path.resolve(__dirname, './package.json'));
let packageJson = JSON.parse(content);

gulp.task('babel', function() {
  return gulp
    .src('build/dist/**/*.js', {base: 'build/dist/'})
    .pipe(
      babel({
        presets: [
          '@babel/preset-react',
          '@babel/preset-env',
          '@babel/preset-flow'
        ],
        plugins: [
          '@babel/plugin-proposal-class-properties',
          '@babel/plugin-proposal-export-default-from',
          '@babel/plugin-proposal-export-namespace-from',
          '@babel/plugin-transform-arrow-functions'
        ]
      })
    )
    .pipe(gulp.dest('package/lib/'));
});

gulp.task('es', function() {
  gulp
    .src(['./build/dist/**/*.js', './build/dist/**/*.ts'])
    .pipe(gulp.dest('package/es/'));
});

gulp.task('css', function() {
  return gulp
    .src('components/**/style/*.less', {base: 'components'})
    .pipe(less({}))
    .pipe(gulp.dest('build/dist/'));
});

gulp.task('copy-style', function() {
  gulp
    .src(['components/**/style/*.less', 'components/**/style/*.css'], {
      base: 'components'
    })
    .pipe(gulp.dest('package/es/'));
  gulp
    .src(['components/**/style/*.less', 'components/**/style/*.css'], {
      base: 'components'
    })
    .pipe(gulp.dest('package/lib/'));
});

gulp.task('readme', function() {
  return gulp.src(['./README.md', './LICENSE']).pipe(gulp.dest('package/'));
});

gulp.task('package', function() {
  delete packageJson.scripts;
  packageJson.engines = {
    node: '>=8'
  };
  fs.writeFileSync(
    path.resolve(__dirname, './package/package.json'),
    JSON.stringify(packageJson, null, 2)
  );
});

gulp.task('build', function() {
  shell.exec('gulp babel');
  shell.exec('gulp css');
  shell.exec('gulp copy-style');
  shell.exec('gulp es');
  shell.exec('gulp readme');
  shell.exec('gulp package');
});
