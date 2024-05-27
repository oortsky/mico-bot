import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("🏓 Send a ping request.");

export async function execute(interaction, client) {
  await interaction.reply(`🏓 **Pong!** \`${Math.round(client.ws.ping)}ms\``);
}
