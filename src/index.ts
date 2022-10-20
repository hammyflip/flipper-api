import getApp from "src/getApp";

const main = async () => {
  const app = getApp();

  const port = Number(process.env.SERVER_PORT);

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Example app listening on port ${port}`);
  });
};

main();
