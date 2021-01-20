export default class AfkHandler {
      
    constructor() {
        this.isAfk = false;
        this.userId = game.userId;
        this.moduleName = "afk";
    }

    handleSocket(recieveMsg) {
        if (recieveMsg.type == "AFK") {
            this.afkById(recieveMsg.playerID);
        }
        else if (recieveMsg.type == "BACK") {
            this.backById(recieveMsg.playerID);
        }
        else {
            console.error("Unexpected socket message type - " + recieveMsg.type);
        }
    }

    toggle() {
        if (this.isAfk) this.back();
        else this.afk();
    }

    afk() {
        if (this.isAfk) return false;
        this.afkById(this.userId);
        if (game.settings.get(this.moduleName, "showChatNotification")) {
            let player = game.users.get(this.userId);
            let chatData = {
                content: player.name + " is AFK",
                type: 1
            };
            ChatMessage.create(chatData);
        }
        this.isAfk = true;

        let msg = {
            type: "AFK",
            playerID: this.userId
        };
        game.socket.emit("module.afk", msg);
        return true;
    }

    afkById(id) {
        if (game.settings.get(this.moduleName, "showEmojiIndicator")) {
            $("[data-user-id='" + id + "'] > .player-name").append("<span class='afk'>💤</span>")
        }
    }

    back() {
        if (!this.isAfk) return;
        this.backById(this.userId);
        if (game.settings.get(this.moduleName, "showChatNotification")) {
            let player = game.users.get(this.userId);
            let chatData = {
                content: player.name + " is back to their keyboard",
                type: 1
            };
            ChatMessage.create(chatData);
        }
        this.isAfk = false;

        let msg = {
            type: "BACK",
            playerID: this.userId
        };
        game.socket.emit("module.afk", msg);
    }

    backById(id) {
        $("[data-user-id='" + id + "'] > .player-name > .afk").remove();
    }
}
