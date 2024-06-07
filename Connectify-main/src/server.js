const { Server } = require('socket.io');
const io = new Server(5000, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const clients = new Map();
const paired = new Map();

const curseWords = ["badword1","ass", "badword2", "badword3","fuck","nigga","fucker","asshole","cunt","whore","nigga","hoe","Bastard","Shit","Bitch","Dick","Pussy","son of a bitch","Mother Fucker","bloody","Cock","dumb"];

function censorMessage(message) {
    // Constructing a regular expression pattern from the curseWords array
    const pattern = new RegExp(curseWords.join("|"), "gi");
    // Replace any occurrence of curse words with asterisks of the same length
    return message.replace(pattern, match => "*".repeat(match.length));
}

io.on("connection", (socket) => {
    console.log("got a client");

    socket.on("username", (data) => {
        console.log("got called");
        socket.emit("my_username", data);
        clients.set(socket, data);
        let parent = [];
        setTimeout(() => {
            console.log("i am finding ");
            const condition = (client) => client !== socket && !paired.has(client);
            let partners = Array.from(clients).filter(([key, value]) => condition(key)).map(([key, value]) => key);
            if (paired.has(socket)) {
                // socket already paired
            } else if (partners.length === 0) {
                socket.emit("got_username", "NO ONE CAUSE NOT ENOUGH CLIENTS ARE PRESENT");
            } else {
                const partner_index = Math.floor(Math.random() * partners.length);
                const partner = partners[partner_index];
                if (!paired.has(partner) && !paired.has(socket)) {
                    console.log("got a partner");
                    paired.set(socket, partner);
                    paired.set(partner, socket);
                    partner.emit("got_username", data);
                    socket.emit("got_username", clients.get(partner));
                }
            }
        }, 10000);
    });

    socket.on('message', (message) => {
        if (paired.has(socket)) {
            //whenever a message is getting posted, it passes through the censorfunciton
            const censoredMessage = censorMessage(message);
            paired.get(socket).emit("message", censoredMessage);
        }
    });

    setInterval(() => {
        socket.emit("count", clients.size);
    }, 1000);

    // Creating a new socket room for typing (when the user starts typing) and stop typing (when the user sits idle)
    //not sure about this piece of code
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("Left",()=>{
        const opp_client = paired.get(socket);
        const name = clients.get(socket);
        paired.delete(socket);
        console.log(paired.size);
        paired.delete(opp_client);
        console.log(paired.size);
        if(paired.has(socket))
        opp_client.emit("left",name);
    })
    socket.on("disconnect",()=>{
        const opp_client = paired.get(socket);
        const name = clients.get(socket);
        clients.delete(socket);
        paired.delete(socket);
        paired.delete(opp_client);
        opp_client.emit("left",name);
    })
});
