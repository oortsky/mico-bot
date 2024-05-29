import { SlashCommandBuilder } from "discord.js";
import { Groq } from "groq-sdk";
import { config } from "dotenv";

config();

const groq = new Groq({
  apiKey: `${process.env.GROQ_API_KEY}`
});

export const data = new SlashCommandBuilder()
  .setName("mico")
  .setDescription("🤔 What do you want to ask.")
  .addStringOption(option =>
    option
      .setName("message")
      .setDescription("The message you want to ask.")
      .setRequired(true)
  );

export async function execute(interaction, client) {
  const reply = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `${interaction.options.getString("message")}`
      }
    ],
    model: "llama3-8b-8192"
  });

  await interaction.reply({
    embeds: [
      {
        color: 3447003,
        author: {
          name: `${interaction.user.tag}`,
          icon_url: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`
        },
        title: "🤔 This is the answer for you!",
        description: `${reply.choices[0].message.content.toString()}`,
        fields: [
          {
            name: "\n",
            value: "**This is the answer from generative AI**",
            inline: false
          }
        ],
        timestamp: new Date(),
        footer: {
          icon_url: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}`,
          text: `${client.user.username} & GROQ AI`
        }
      }
    ]
  });
}
