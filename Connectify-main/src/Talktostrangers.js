 
import React, { useEffect, useState, useRef } from "react";
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import { useWebSocket } from './WebSocketContext';
import Alert from '@mui/material/Alert';

//I wrote the logic for typing... but none of the functions are getting called due to some reason. There's probably some error which i'm unable to notice.k

export default function Talktostrangers() {
    document.title = "Connectify-talk";
    const { socket } = useWebSocket();
    const [name, setName] = useState("");
    const [leftname, setleftname] = useState("You");
    const [notLoadedName, setNotLoadedName] = useState(".");
    const [messages, setMessages] = useState([]);
    const [disabled, setDisabled] = useState(true);
    const [inputValue, setInputValue] = useState("");
    const [myname, setmyname] = useState("");
    const [opp_or_I_left, setopp_or_I_left] = useState("");
    const chatAreaRef = useRef(null);
    const [leave_new, set_leave_new] = useState('Leave');
    const [left, setLeft] = useState(false);
    const [recovered, set_recover] = useState(false);
    const [lost_connection, set_lost_connection] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const curseWords = ["badword1", "badword2","ass", "badword3","fuck","nigga","fucker","asshole","cunt","whore","nigga","hoe","Bastard","Shit","Bitch","Dick","Pussy","son of a bitch","Mother Fucker","bloody","Cock","dumb",];

    function censorMessage(message) {
        // Constructing a regular expression pattern from the curseWords array
        const pattern = new RegExp(curseWords.join("|"), "gi");
        // Replace any occurrence of curse words with asterisks of the same length
        return message.replace(pattern, match => "*".repeat(match.length));
    }

    useEffect(() => {
        if (socket) {
            socket.on("got_username", (data) => {
                console.log("got the damn name");
                setName(data);
            });

            socket.on('message', (data) => {
                //censor funciton to check for curse words
                const censoredMessage = censorMessage(data);
                const message = {
                    text: censoredMessage,
                    time: new Date().toLocaleTimeString(),
                    movement: 'left',
                    marginleft: 0,
                    timemargin: 0,
                    marginright: 63,
                    bgcolor: '#c6c7e0'
                };
                setMessages(prevMessages => [...prevMessages, message]);
            });

            socket.on("left", (username) => {
                setLeft(true);
                setDisabled(true);
                setleftname(username);
                set_leave_new('New');
                if (chatAreaRef.current) {
                    chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
                }
            });

            socket.on("my_username", (myname) => {
                setmyname(myname);
            });

            socket.on("recovered", () => {
                set_lost_connection(false);
                set_recover(true);
            });

            //this is A typing... functionality code

            socket.on("typing", () => {
                // This event is triggered when a user starts typing.
                console.log("Typing event received");
              
                // Set the `isTyping` state to true to indicate that the user is typing.
                setIsTyping(true);
              });
              
              socket.on("stop typing", () => {
                // This event is triggered when a user stops typing.
                console.log("Stop typing event received");
              
                // Set the `isTyping` state to false to indicate that the user has stopped typing.
                setIsTyping(false);
              });

              //end
              

            socket.on("lost_conn", (data) => {
                set_lost_connection(true);
                setopp_or_I_left(data);
            });

            // Cleanup on component unmount
            return () => {
                socket.off("got_username");
                socket.off("message");
                socket.off("left");
                socket.off("my_username");
                socket.off("recovered");
                socket.off("typing");
                socket.off("stop typing");
                socket.off("lost_conn");
            };
        }
    }, [socket]);

    const handleClick = async () => {
        if (inputValue.length !== 0 && name.length !== 0) {
            //same censorcheck 
            const censoredMessage = censorMessage(inputValue);
            const data = {
                text: censoredMessage,
                time: new Date().toLocaleTimeString(),
                marginleft: 63,
                movement: 'right',
                timemargin: 92,
                bgcolor: 'white',
                marginright: 0
            };
            setMessages(prevMessages => [...prevMessages, data]);
            setInputValue("");
            if (chatAreaRef.current) {
                chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
            }
            //emits the censored image, typing event will be set to false
            socket.emit("message", censoredMessage);
            console.log("Stop typing event sent (message sent)");
            socket.emit("stop typing", { username: name }); // Emit stop typing when sending a message
            setTyping(false);
        }
    };

    useEffect(() => {
        if (name.length !== 0) {
            setDisabled(false);
            setMessages([{
                text: "Start Typing . . . .",
                time: new Date().toLocaleTimeString(),
                color: "white"
            }]);
        } else {
            const interval = setInterval(() => {
                setNotLoadedName(prev => prev.length <= 4 ? prev + ' .' : ' .');
            }, 2000);

            return () => clearInterval(interval);
        }
    }, [name]);

    // Handler function for when user starts typing

    const typingHandler = (e) => {
        // This function is called when the user types something in the input field.
        console.log("Typing handler called");
      
        // Update the input value.
        setInputValue(e.target.value);
      
        // Check if a socket connection exists.
        if (!socket) return;
      
        // Check if the user is currently typing.
        if (!typing) {
          // Set the typing state to true.
          setTyping(true);
      
          // Send a "typing" event to the server.
          console.log("Typing event sent");
          socket.emit("typing", { username: name });
        }
      
        // Get the current time.
        let lastTypingTime = new Date().getTime();
      
        // Set the timer length to 3 seconds.
        var timerLength = 3000;
      
        // Set a timer to check if the user has stopped typing.
        setTimeout(() => {
          // Get the current time.
          var timeNow = new Date().getTime();
      
          // Calculate the time difference between the current time and the last typing time.
          var timeDiff = timeNow - lastTypingTime;
      
          // Check if the time difference is greater than or equal to the timer length.
          if (timeDiff >= timerLength && typing) {
            // Send a "stop typing" event to the server.
            console.log("Stop typing event sent (timeout)");
            socket.emit("stop typing", { username: name });
      
            // Set the typing state to false.
            setTyping(false);
          }
        }, timerLength);
      };

      //end pt-2
      

    const handleLeft = () => {
        if (!left) {
            set_leave_new('New');
            socket.emit("Left");
            setLeft(true);
            setDisabled(true);
            if (chatAreaRef.current) {
                chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
            }
        } else {
            set_leave_new('Leave');
            setLeft(false);
            setDisabled(true);
            setName("");
            setMessages([]);
            socket.emit("username", myname);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleClick();
        } else if (e.keyCode === 27) {
            handleLeft();
        }
    };

    return (
        <div>
            <div className="card" style={{ backgroundColor: "black", marginTop: "5%", marginLeft: "5%", marginRight: "5%", marginBottom: "5%", height: "600px", border: "1px solid white", borderRadius: "10px" }}>
                <div className="card-header element" style={{ height: "60px", border: "1px solid white", borderRadius: "10px" }}>
                    <h3 style={{ color: "white", textAlign: "center" }}>You Connectedtify To {name.length === 0 ? notLoadedName : name}</h3>
                </div>
                <div className="card-body" style={{ flexDirection: "column", flex: "1", overflowY: "auto", display: "flex" }} ref={chatAreaRef}>
                    {messages.map((message, index) => (
                        <div key={index} style={{ marginBottom: "20px" }}>
                            {message.text && (
                                <div style={{
                                    color: `${message.color}`,
                                    backgroundColor: `${message.bgcolor}`,
                                    float: `${message.movement}`,
                                    marginLeft: `${message.marginleft}%`,
                                    marginRight: `${message.marginright}%`,
                                    width: `${message.text.length - message.text.length - 1 < 8 ? message.text.length - message.text.length - 1 * 35.7142857143 : 400}px`,
                                    padding: "10px",
                                    height: `${((message.text.length / 9) - (message.text.length - 1)) * 35}px`,
                                    border: "2px solid white",
                                    borderRadius: "30px",
                                    textAlign: "left"
                                }}>{message.text}</div>
                            )}
                            {/* Display Typing... message when someone is typing - pt3*/}
                            {isTyping && (
                                <div style={{ marginBottom: "20px", color: "white", marginLeft: "92%", marginRight: "63%" }}>Typing...</div>
                            )}
                            <div style={{ marginBottom: "20px", marginLeft: `${message.timemargin}%`, marginRight: `${message.marginright}%` }} className="text-muted">{message.time}</div>
                        </div>
                    ))}
                    {left && (
                        <div>
                            <hr style={{ border: "1px solid white" }} />
                            <strong><h3 style={{ textAlign: "center", color: "white" }}>{leftname} Left</h3></strong>
                        </div>
                    )}
                    {
                        lost_connection && <Alert variant="outlined" severity="info" sx={{ fontWeight: "bold" }}>
                            {opp_or_I_left}
                        </Alert>
                    }
                    {
                        recovered && <Alert variant="outlined" severity="success">
                            Connection Restored.
                        </Alert>
                    }
                    {/* Display Typing... message when someone is typing */}
                    {isTyping && (
                        <div style={{ marginBottom: "20px", color: "white", marginLeft: "92%", marginRight: "63%" }}>Typing...</div>
                    )}
                </div>
                <div className="card-footer" style={{ marginBottom: "1%", border: "1px solid white", borderRadius: "10px" }}>
                    <TextField
                        sx={{ input: { color: 'white' } }} color="secondary" focused
                        required
                        value={inputValue}
                        onChange={(e) => {
                            typingHandler(e); // Call typingHandler when input changes
                            setInputValue(e.target.value);
                        }}
                        onKeyDown={handleKeyDown}
                        fullWidth
                        disabled={disabled}
                        id="standard-basic"
                        label="Type here"
                        variant="standard"
                        InputProps={{
                            endAdornment: (
                                <React.Fragment>
                                    <Button onClick={handleLeft} color="error" sx={{ marginRight: "20px", marginBottom: "10px" }} size="small" variant="contained">{leave_new}</Button>
                                    <Button onClick={handleClick} sx={{ marginBottom: "10px" }} size="small" variant="contained" endIcon={<SendIcon />}>Send</Button>
                                </React.Fragment>
                            )
                        }}
                    />
                </div>
            </div>
        </div>
    );

}

    