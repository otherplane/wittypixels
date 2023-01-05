### Running the app

``` bash
# clone the repository
git clone git@github.com:otherplane/witty-pixels.git

# cd into the cloned repository
cd witty-creatures-3.0

# install application dependencies
pnpm i
lerna bootstrap

# launch development application
docker-compose up
cd packages/ui
pnpm dev
```

### Formatter

* Verify files are correctly formatted with `pnpm lint`
* Repair lint errors with (**this operation modifies your files!**) `pnpm lint!`

### Test

We use [Jest](https://facebook.github.io/jest/) for testing.

``` bash
# run unit tests
pnpm test
```
