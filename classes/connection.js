const GameLobbySettings = require('./Lobbies/GameLobbySettings');

module.exports = class Connection{
    constructor(){
        this.socket;
        this.player;
        this.server;
        this.lobby;
    }

    CreateEvents(){
        let connection = this;
        let socket = connection.socket;
        let server = connection.server;
        let player = connection.player;

        socket.on('disconnect', function(data){
            server.OnDisconnected(connection);
        });

        socket.on('JoinGame', function(){
            server.OnAttemptToJoinGame(connection);
        });

        socket.on('CreateGame', function(data){
            if(data.password != null && data.maxplayers != null && data.gamemode != null){
                let pass = data.password;
                let gamemode = data.gamemode;
                let Maxplayers = data.maxplayers;

                let config = new GameLobbySettings(gamemode, Maxplayers);
                config.isPlayerGenerated = true;

                let LobbyId = server.CreateLobbyPrivate(config, pass, connection);
            }
            else{
                console.log("there was a problem with the request");
            }
        });

        socket.on('JoinGamePrivate', function(data){
            server.OnAttemptToJoinGamePrivate(connection, data);
        });

        socket.on('handshake', function(data){
            connection.lobby.SendHandShake(connection, data);
        });

        socket.on('UpdatePosition', function(data){
            connection.lobby.UpdatePosition(connection, data);
        });

        socket.on('UpdateTarget', function(data){
            connection.lobby.UpdateTarget(connection, data);
        });

        socket.on('SendAttackPacket', function(data){
            connection.lobby.SendAttackPacket(connection, data);
        });

        socket.on('SendMessageToServer', function(data){
            connection.lobby.SendMessageToLobby(connection, data);
        });
    }
}