const tasks = arr => arr.join(' && ');

module.exports = {
  'hooks': {
    'pre-commit': tasks([
      'npm run bump-patch',
      `git tag ${require('./package.json').version}`
    ])
  }
}