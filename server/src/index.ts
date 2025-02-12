import createApp from './app';
import env from './config/env';

const app = createApp();

app.listen(env.port, () => {
  console.log(`Server running on ${env.backend}`);
});