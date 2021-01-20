import AfkHandler from "./AfkHandler.mjs";

Hooks.on("chatCommandsReady", function(chatCommands) {
    game.socket.on("module.afk", function(recieveMsg) {
      window.game.afkHandler.handleSocket(recieveMsg);
    });
  
    chatCommands.registerCommand(chatCommands.createCommand("/afk", false, (chatlog, messageText, chatdata) => {
      window.game.afkHandler.afk();
    }));

    chatCommands.registerCommand(chatCommands.createCommand("brb", true, (chatlog, messageText, chatdata) => {
      if (window.game.afkHandler.afk()) {
        return "brb";
      }
    }, 1));
  
    chatCommands.registerCommand(chatCommands.createCommand("/back", false, (chatlog, messageText, chatdata) => {
      window.game.afkHandler.back();
    }));
});

Hooks.on("chatMessage", (chatlog, messageText, chatData) => {
    if (game.settings.get("afk", "showChatActivityRemoveAFK")) {
        if (!messageText.includes("/afk") && !messageText.includes("brb")) {
            window.game.afkHandler.back();
        }
    }
});

Hooks.once('ready', function() {
    let moduleName = 'afk';

    let afkHandler = new AfkHandler();
    window.game.afkHandler = afkHandler;

    game.settings.register(moduleName, "showEmojiIndicator", {
        name: "Should an AFK emoji indicator be displayed in the Players list?",
        scope: 'world',
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register(moduleName, "showChatNotification", {
        name: "Should a message be posted to chat when a player is AFK?",
        scope: 'world',
        config: true,
        type: Boolean,
        default: false
    });

    game.settings.register(moduleName, "showChatActivityRemoveAFK", {
        name: "If you are AFK and post a chat message other than '/afk' or 'brb', should the AFK indicator go away?",
        scope: 'client',
        config: true,
        type: Boolean,
        default: true
    });
});
