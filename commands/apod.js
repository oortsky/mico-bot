import { SlashCommandBuilder } from "discord.js";
import { config } from "dotenv";

config();

export const data = new SlashCommandBuilder()
  .setName("apod")
  .setDescription("🌟 Send an astronomy picture of the day.");

export async function execute(interaction, client) {
  const NASA_ENDPOINT = "https://api.nasa.gov/";
  const apiKey = process.env.NASA_API_KEY; // Retrieve NASA API key from environment variables

  try {
    // Tunda balasan interaksi
    await interaction.deferReply();

    const apiCall = await fetch(
      NASA_ENDPOINT + `planetary/apod?thumbs=true&api_key=${apiKey}`
    );

    if (!apiCall.ok) {
      throw new Error("Failed to fetch data from NASA API");
    }

    const apod = await apiCall.json();

    let img_url;

    if (apod.media_type === "video") {
      img_url = apod.thumbnail_url;
    } else {
      img_url = apod.hdurl;
    }

    // Potong teks jika melebihi 1024 karakter
    const explanation =
      apod.explanation.length > 1024
        ? apod.explanation.substring(0, 1021) + "..."
        : apod.explanation;

    await interaction.editReply({
      embeds: [
        {
          color: 3447003,
          author: {
            name: `${interaction.user.tag}`,
            icon_url: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`
          },
          image: {
            url: `${img_url}`
          },
          title: "🌟 Astronomy Picture of the Day!",
          fields: [
            {
              name: "Date",
              value: `${apod.date}`,
              inline: false
            },
            {
              name: "Explanation",
              value: explanation, // Gunakan teks yang sudah dipotong
              inline: false
            },
            {
              name: "\n",
              value: `**${apod.title}**`,
              inline: false
            }
          ],
          timestamp: new Date(),
          footer: {
            icon_url: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}`,
            text: `${client.user.username} & NASA USA`
          }
        }
      ]
    });
  } catch (error) {
    console.error("Error fetching NASA:", error);
    // Kirimkan balasan jika terjadi kesalahan
    await interaction.editReply("Failed to show Astronomy Picture of the Day.");
  }
}
