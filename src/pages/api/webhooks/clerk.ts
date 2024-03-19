import { Webhook } from "svix";
import { buffer } from "micro";
import { env } from "@/env";
import { db } from "@/server/db";

import type { WebhookEvent } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { error } from "console";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method != "POST") {
    return res.status(405);
  }

  const WEBHOOK_SECRET = env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add a web hook secret");
  }

  const svix_id = req.headers["svix-id"] as string;
  const svix_signature = req.headers["svix-signature"] as string;
  const svix_timestamp = req.headers["svix-timestamp"] as string;

  if (!svix_id || !svix_signature || !svix_timestamp) {
    return res.status(400).json({ error: "error occured on svix header " });
  }

  const body = (await buffer(req)).toString();

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-signature": svix_signature,
      "svix-timestamp": svix_timestamp,
    }) as WebhookEvent;
  } catch (err) {
    console.error("error verifying the webhooks ", err);
    return res.status(400).json({ Error: err });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  switch (eventType) {
    case "user.created": {
      const count = await db.account.count({
        where: {
          userId: id!,
        },
      });

      if (!count) {
        await db.account.create({
          data: {
            userId: id!,
          },
        });
      }
    }
    default: {
      console.error(` the event type : ${eventType} is not configured `);
    }
  }

  return res.status(200).json({ response: "Success" });
}
