const tasks = arr => arr.join(' && ');

module.exports = {
  'hooks': {
    'pre-push': tasks([
      'npm version minor',
      `git tag ${require('./package.json').version}`
    ])
  }
}