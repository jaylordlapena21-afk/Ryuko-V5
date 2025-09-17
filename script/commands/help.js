module.exports.config = {
  name: "help", // Command name
  version: "3.8.0", // Command version
  permission: 0, // Permission level (0: all, 1: group admins, 2: bot admins, 3: bot operators)
  credits: "ChatGPT + Edited by Jaylord", // Creator of the code
  description: "Show all available commands grouped by category with styled brackets", // Command description
  prefix: false, // Use prefix (true/false)
  premium: false, // Enable premium feature (true/false)
  category: "system", // Command category
  usages: "/help [command]", // Command usage
  cooldowns: 1 // Cooldown in seconds
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID } = event;
  const commands = global.client.commands;

  // 📌 Case: /help <command>
  if (args[0]) {
    const cmdName = args[0].toLowerCase();
    const command = commands.get(cmdName) || commands.get(global.client.aliases?.get(cmdName));

    if (!command) {
      return api.sendMessage(`❌ Command "/${cmdName}" not found.`, threadID);
    }

    const config = command.config;
    let details = `📖 HELP → /${config.name}\n\n`;
    details += `📝 Description: ${config.description || "No description"}\n`;
    if (config.usages) details += `⚡ Usage: ${config.usages}\n`;
    details += `🔑 Permission: ${config.permission || 0}\n`; // Updated to match the new structure
    details += `⏳ Cooldown: ${config.cooldowns || 0}s`;

    return api.sendMessage(details, threadID);
  }

  // 📌 Category Icons
  const categoryIcons = {
    "system": "⚙️",
    "moderation": "🛡️",
    "education": "📚",
    "music": "🎵",
    "image": "🖼️",
    "tools": "🛠️",
    "gag tools": "😂",
    "ai": "🤖",
    "others": "📦"
  };

  // 📌 Group commands per category (case-insensitive)
  let categorized = {};
  commands.forEach(cmd => {
    const cfg = cmd.config;
    let category = (cfg.category || "others").toLowerCase(); // Changed field name to match structure

    // 🔎 Auto-detect AI-related commands
    if (
      ["ai", "chatgpt", "gpt", "ask"].includes(cfg.name.toLowerCase()) || 
      category.includes("ai")
    ) {
      category = "ai";
    }

    if (!categorized[category]) categorized[category] = [];
    categorized[category].push(cfg);
  });

  // 📌 Build Help Menu (bracket style + slash)
  let helpMenu = "📌 Available Commands:\n\n";

  for (const [category, cmds] of Object.entries(categorized)) {
    const icon = categoryIcons[category] || "📦";
    helpMenu += `┌─ ${icon} | ${category.charAt(0).toUpperCase() + category.slice(1)}\n`;

    cmds.forEach(cfg => {
      helpMenu += `│ - /${cfg.name}\n`;
    });

    helpMenu += `└───────────────\n\n`;
  }

  helpMenu += "👑 BOT OWNER\n";
  helpMenu += "   Jaylord La Peña\n";
  helpMenu += "   🌐 https://www.facebook.com/jaylordlapena2298";

  return api.sendMessage(helpMenu, threadID);
};
