### Running the app

``` bash
# clone the repository
git clone git@github.com:otherplane/witty-creatures-3.0.git

# cd into the cloned repository
cd witty-creatures-3.0

# install application dependencies
yarn
lerna bootstrap

# launch development application
docker-compose up
cd packages/ui
yarn dev
```

### Formatter

* Verify files are correctly formatted with `yarn lint`
* Repair lint errors with (**this operation modifies your files!**) `yarn lint!`

### Test

We use [Jest](https://facebook.github.io/jest/) for testing.

``` bash
# run unit tests
yarn test
```
