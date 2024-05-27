import { Client, Events, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";

import * as ping from "./commands/ping.js";

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
    default:
      console.log("Not found command");
  }
}

client.once(Events.ClientReady, readyDiscord);

client.on(Events.InteractionCreate, handleInteraction);

client.login(process.env.TOKEN);
