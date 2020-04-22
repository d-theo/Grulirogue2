const tasks = arr => arr.join(' && ');

module.exports = {
  'hooks': {
    'pre-push': tasks([
      'npm run bump-patch',
      `git tag ${require('./package.json').version}`
    ])
  }
}