const {join} = require('path');
const {StandaloneLocalDevServer} = require('@kalarrs/serverless-local-dev-server/src/StandaloneLocalDevServer');

const serverlessLocalServer = new StandaloneLocalDevServer({
  projectPath: join(__dirname, '../'),
  configOverride: {plugins: []}
});
serverlessLocalServer.start();

