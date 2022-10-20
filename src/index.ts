import getApp from "src/getApp";

const main = async () => {
  const app = getApp();

  const port = Number(process.env.SERVER_PORT);
  const host = process.env.SERVER_HOST as string;

  app.listen(port, host, () => {
    // eslint-disable-next-line no-console
    console.log(`Example app listening at http://${host}:${port}`);
  });
};

main();
