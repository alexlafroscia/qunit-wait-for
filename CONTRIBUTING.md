# Contributing

## Local Version Management

This package uses [Volta](https://volta.sh) to manage the Node and Yarn versions to run against. You don't _have_ to use it, but that's how the versions will be set in the CI environment.

## Conventional Commits

Each commit should follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) pattern, so that we can use tools that automatically generate a `CHANGELOG` for us.

## Publishing a Version

This project uses `standard-version` to leverage the Git history to find updates since the last version, determine the next version, and generate the `CHANGELOG` for us.

To create a new release, run the following:

```
yarn release --dry-run
```

And make sure that the version number and `CHANGELOG` look correct. Assuming they do, you can run

```bash
# Create and push release to GitHub
yarn release
git push --follow-tags origin master

# Build NPM package and push to registry
yarn build
npm publish
```

Once complete, copy the recent `CHANGELOG` entry into the notes of the new release on GitHub.
