import { Client, Events, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";

import * as ping from "./commands/ping.js";
import * as quake from "./commands/quake.js";
import * as apod from "./commands/apod.js";
import * as mico from "./commands/mico.js";
import * as comuline from "./commands/comuline.js";

config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

function readyDiscord() {
  console.log("🚀 Logged as", client.user.tag);
}

async function handleInteraction(interaction) {
  if (!interaction.isCommand()) return;

  switch (interaction.commandName) {
    case "ping":
      await ping.execute(interaction, client);
      break;
    case "quake":
      await quake.execute(interaction, client);
      break;
    case "apod":
      await apod.execute(interaction, client);
      break;
    case "mico":
      await mico.execute(interaction, client);
      break;
    case "comuline":
      await comuline.execute(interaction, client);
      break;
    default:
      console.log("Not found command");
  }
}

client.once(Events.ClientReady, readyDiscord);

client.on(Events.InteractionCreate, handleInteraction);

client.login(process.env.TOKEN);
