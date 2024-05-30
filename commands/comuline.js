import { SlashCommandBuilder } from "discord.js";

const COMULINE_ENDPOINT = "https://www.api.comuline.com/";

const apiCall = await fetch(COMULINE_ENDPOINT + "v1/station/");
const response = await apiCall.json();
const stations = response.data.slice(0, 25);

export const data = new SlashCommandBuilder()
  .setName("comuline")
  .setDescription("🚈 Send a commuter line schedule.")
  .addStringOption(option =>
    option
      .setName("station")
      .setDescription("🚉 Select your station.")
      .setRequired(true)
      .addChoices(
        stations.map(station => ({
          name: station.name,
          value: station.id
        }))
      )
  );

export async function execute(interaction, client) {
  try {
    const apiCall = await fetch(
      COMULINE_ENDPOINT +
        `v1/schedule/${interaction.options._hoistedOptions[0].value}?is_from_now=true`
    );

    if (!apiCall.ok) {
      throw new Error("Failed to fetch data from COMULINE API");
    }

    const response = await apiCall.json();
    const schedule = response.data[0];

    const colorDes = parseInt(schedule.color.replace("#", ""), 16);

    await interaction.reply({
      embeds: [
        {
          color: colorDes,
          author: {
            name: `${interaction.user.tag}`,
            icon_url: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`
          },
          title: "🚈 Latest commuter line schedule!",
          fields: [
            {
              name: "Train ID",
              value: `${schedule.trainId}`,
              inline: false
            },
            {
              name: "Line",
              value: `${schedule.line}`,
              inline: false
            },
            {
              name: "Route",
              value: `${schedule.route}`,
              inline: false
            },
            {
              name: "Destination",
              value: `${schedule.destination}`,
              inline: false
            },
            {
              name: "Time Departures",
              value: `${schedule.timeEstimated}`,
              inline: false
            },
            {
              name: "Time Arrivals",
              value: `${schedule.destinationTime}`,
              inline: false
            }
          ],
          timestamp: new Date(),
          footer: {
            icon_url: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}`,
            text: `${client.user.username} & COMULINE`
          }
        }
      ]
    });
  } catch (error) {
    console.error("Error fetching COMULINE:", error);
    await interaction.reply("Failed to show commuter line schedule.");
  }
}
