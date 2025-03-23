import { Client, GatewayIntentBits } from "discord.js";
import fs from "fs";
import { config } from "dotenv";
config();

function myscript(){

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

async function fetchImageURLs(channelId) {
  const channel = await client.channels.fetch(channelId).catch(console.error);
  if (!channel || !channel.isTextBased()) {
    console.error("Invalid channel or not a text-based channel.");
    return [];
  }

  let lastMessageId = null;
  let imageData = [];

  while (true) {
    const messages = await channel.messages
      .fetch({ limit: 100, before: lastMessageId })
      .catch(console.error);

    if (!messages || messages.size === 0) break;

    for (const message of messages.values()) {
      for (const attachment of message.attachments.values()) {
        if (attachment.contentType?.startsWith("image/")) {
          imageData.push(attachment.url);
        }
      }
    }

    lastMessageId = messages.last()?.id;
    if (!lastMessageId) break;
  }

  return imageData;
}

// Function to save image URLs to a text file
function saveImagesToFile(imageURLs) {
  const fileData = imageURLs.join("\n"); // Join URLs with line breaks
  fs.writeFile("src/server/images.txt", fileData, (err) => {
    if (err) {
      console.error("❌ Error saving file:", err);
    } else {
      console.log("✅ Image URLs saved to images.txt");
    }
  });
}


client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const channelId = "1351878753353207868"; // Replace with your actual channel ID
  const imageURLs = await fetchImageURLs(channelId);

  console.log(`Found ${imageURLs.length} images.`);
  saveImagesToFile(imageURLs);
  console.log("saved");
});

client.login(process.env.discord_token)

}

export default myscript;
