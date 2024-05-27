import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("quake")
  .setDescription("🪨 Send a newest earthquake report.");

export async function execute(interaction, client) {
  const BMKG_ENDPOINT = "https://data.bmkg.go.id/DataMKG/TEWS/";

  const apiCall = await fetch(BMKG_ENDPOINT + "autogempa.json");
  const {
    Infogempa: {
      gempa: { Jam, Magnitude, Tanggal, Wilayah, Potensi, Kedalaman, Shakemap }
    }
  } = await apiCall.json();

  const BMKGImage = BMKG_ENDPOINT + Shakemap;

  await interaction.reply({
    embeds: [
      {
        color: 3447003,
        author: {
          name: `${interaction.user.tag}`,
          icon_url: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`
        },
        image: {
          url: BMKGImage
        },
        title: "🪨 Earthquake Alert!",
        fields: [
          {
            name: "Time",
            value: `${Tanggal} | ${Jam}`,
            inline: false
          },
          {
            name: "Magnitude",
            value: `${Magnitude} SR`,
            inline: false
          },
          {
            name: "Region",
            value: `${Wilayah}`,
            inline: false
          },
          {
            name: "Potency",
            value: `${Potensi}`,
            inline: false
          },
          {
            name: "Depth",
            value: `${Kedalaman}`,
            inline: false
          }
        ],
        timestamp: new Date(),
        footer: {
          icon_url: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}`,
          text: `${client.user.username} & BMKG Indonesia`
        }
      }
    ]
  });
}
