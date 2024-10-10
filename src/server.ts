import express from "express";
import { getPayloadClient } from "./get-payload";
import { nextApp, nextHandler } from "./next-utils";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc";
import { inferAsyncReturnType } from "@trpc/server";
import nextBuild from "next/dist/build";
import path from "path";
import { parse } from "url";
import { PayloadRequest } from "payload/types";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
});

export type ExpressContext = inferAsyncReturnType<typeof createContext>;

const start = async () => {
  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms) => {
        cms.logger.info(`Admin URL: ${cms.getAdminURL()}`);
      },
    },
  });

  if (process.env.NEXT_BUILD) {
    app.listen(PORT, async () => {
      payload.logger.info("Next.js is building for production");

      // @ts-expect-error
      await nextBuild(path.join(__dirname, "../"));

      process.exit();
    });

    return;
  }

  // Middleware to authenticate requests
  app.use((req, res, next) => {
    payload.authenticate(req, res, (err) => {
      if (err) return res.status(401).send("Authentication failed");
      next();
    });
  });

  // Example route for create-order
  app.get("/create-order", (req, res) => {
    const request = req as PayloadRequest;

    // Ensure user is authenticated
    if (!request.user) {
      return res.redirect("/sign-in");
    }

    const parsedUrl = parse(req.url, true);
    const { query } = parsedUrl;

    return nextApp.render(req, res, "/create-order", query);
  });

  // Example route for analytics
  app.get("/analytics", (req, res) => {
    const request = req as PayloadRequest;

    // Ensure user is authenticated
    if (!request.user) {
      return res.redirect("/sign-in");
    }

    const parsedUrl = parse(req.url, true);
    const { query } = parsedUrl;

    return nextApp.render(req, res, "/analytics", query);
  });

  // Example route for verify-certificate
  app.get("/verify-certificate", (req, res) => {
    const request = req as PayloadRequest;

    // Ensure user is authenticated
    if (!request.user) {
      return res.redirect("/sign-in");
    }

    const parsedUrl = parse(req.url, true);
    const { query } = parsedUrl;

    return nextApp.render(req, res, "/verify-certificate", query);
  });

  // Example route for view-orderst
  app.get("/view-orders", (req, res) => {
    const request = req as PayloadRequest;

    // Ensure user is authenticated
    if (!request.user) {
      return res.redirect("/sign-in");
    }

    const parsedUrl = parse(req.url, true);
    const { query } = parsedUrl;

    return nextApp.render(req, res, "/view-orders", query);
  });

  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  app.use((req, res) => nextHandler(req, res));

  nextApp.prepare().then(() => {
    payload.logger.info("Next.js started");

    app.listen(PORT, async () => {
      payload.logger.info(
        `Next.js App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`
      );
    });
  });
};

start();
