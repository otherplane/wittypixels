### Running the app

``` bash
# clone the repository
git clone git@github.com:otherplane/wittypixels.git

# cd into the cloned repository
cd wittypixels

# install application dependencies
pnpm install

# launch development UI
cd packages/ui
touch .env
# fullfill the .env file
pnpm dev

# launch development UI
cd packages/ui
touch .env
# fullfill the .env file
pnpm dev
```

### Formatter

Repair lint errors with (**this operation modifies your files!**) `pnpm lint`

### Test

 The environment variables needed to run the API test are in [.env.test](https://github.com/otherplane/wittypixels/blob/main/.env.test). To be able to run the tests you need to add this two environment variables:

```
MONGO_URI=your_mongo_uri
MONGO_INITDB_DATABASE=your_mongo_db_name
```

After that, you can run the following command to run the test in all packages

``` bash
# run tests
pnpm test
```

#### ⚠️ API known limitation

##### e2e tests

Currently, the database is being cleaned and the API being started before running every e2e test. The logic to do that was previously in [`beforeEach` and `beforeAll`](https://jestjs.io/docs/setup-teardown#repeating-setup) hooks but was moved into every test to be able to debug easily while we solve the issue that causes jest.timeouts errors.


## Smart Contracts

The implementation of the smart contracts for this game is located in [witty-pixels-contracts](https://github.com/otherplane/witty-pixels-contracts)