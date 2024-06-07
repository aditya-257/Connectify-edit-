import React from "react";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Link } from "react-router-dom";
import TextField from '@mui/material/TextField';
import { useWebSocket } from './WebSocketContext';
export default function Login() {
    const { connect } = useWebSocket();

    const handleClick = async () => {
        const username = document.getElementById('standard-basic').value;
        const socket = connect()
        socket.emit("username",username);
    };

    return (
        <>
            <div style={{ marginLeft: "10%", marginRight: "10%" }}>
                <br /><br /><br />
                <div className="card text-center" style={{ backgroundColor:"#0A0A0A", border: "2px solid white", borderRadius: "40px", height: "300px", boxShadow: "10px 5px 15px 10px black" }}>
                    <h5 className="card-header" style={{color:"white"}}>Talk To Strangers</h5>
                    <div className="card-body">
                        <br />
                        <h5 className="card-title" style={{color:"white"}}>Enter Your Username</h5><br />
                        <form>
                            <div className="form-group">
                                <TextField  sx={{input: { color: 'white' }}} color="secondary" focused  required fullWidth id="standard-basic" label="Standard" variant="standard" />
                                <small id="emailHelp" className="form-text text-muted"  style={{color:"white"}}>The above Username will be visible to other strangers</small>
                            </div>
                            <Stack spacing={2} direction="row">
                                <Link to='/talk'>
                                    <Button onClick={handleClick} variant="text">Enter 1v1 chat</Button>
                                </Link>
                                <Link to='/rooms'>
                                <Button onClickvariant="text">Enter chatrooms</Button>
                                </Link>
                            </Stack>
                        </form>
                    </div>
                </div>
            </div>
            <br /><br /><br />
            <div style={{ marginLeft: "50px", marginRight: "50px" }}>
            <strong><p style={{color:'white'}}>Welcome to our exclusive chatroom for adults aged 18 and above. By entering this space, you are agreeing to abide by the following guidelines and understandings:
<ol start={1} style={{color:'white'}}>
<li> Age Restriction: This chatroom is strictly for individuals who are 18 years of age or older. If you are under the age of 18, you are not permitted to access or participate in any discussions within this forum.</li>
<br/>
<li> Diverse Community: Our chatroom welcomes people from all walks of life, backgrounds, and cultures. You may encounter strangers with varying beliefs, opinions, and experiences. Embrace the diversity and engage in respectful dialogue.</li>
<br/>
<li> Self-Responsibility: As a participant in this chatroom, you are solely responsible for your actions, words, and interactions with others. Exercise caution and discretion when engaging in conversations and sharing personal information.</li>
<br/>
<li> Consent: Respect the boundaries and consent of others at all times. Do not engage in harassing, threatening, or inappropriate behavior. If someone expresses discomfort or asks you to stop, comply immediately.</li>
<br/>
<li> Reporting System: We have a zero-tolerance policy for any form of misconduct, including but not limited to harassment, hate speech, or explicit content. If you witness or experience any violations of our community guidelines, please report them to our moderators promptly. Your safety and well-being are our top priorities.</li>
<br/>
<li> Privacy and Security: While we strive to provide a safe environment, please be mindful of the inherent risks associated with online interactions. Avoid sharing sensitive information such as your full name, address, or financial details with strangers.</li>
<br/>
<li> Mutual Respect: Treat all participants with courtesy, empathy, and kindness. Remember that behind every screen is a real person with feelings and emotions. Foster a supportive and inclusive atmosphere where everyone feels valued and heard.</li>
<br/>
<li> Enjoyment and Engagement: Take advantage of this platform to connect with like-minded individuals, expand your social network, and explore new perspectives. Whether you're here to chat, seek advice, or simply unwind, make the most of your experience.</li>
</ol>
By acknowledging and adhering to these guidelines, you contribute to the creation of a vibrant and thriving community. Thank you for choosing to be a part of our chatroom. Let the conversations begin!</p></strong>
            </div>
        </>
    );
}
