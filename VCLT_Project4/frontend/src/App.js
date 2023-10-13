// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { APP_ID, SERVER_SECRET } from './constants';


export default function App() {
  // const roomID = getUrlParams().get('roomID') || randomID(5);
  const roomID = "JoinTheVideoChat";
  let myMeeting = async (element) => {
 // generate Kit Token
  const appID = APP_ID;
  const serverSecret = SERVER_SECRET;
  const kitToken =  ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID,  Date.now().toString(),"Nitin");


 // Create instance object from Kit Token.
  const zp = ZegoUIKitPrebuilt.create(kitToken);
  // start the call
  zp.joinRoom({
    container: element,
    sharedLinks: [
      {
        name: 'Personal link',
        url:
         window.location.protocol + '//' + 
         window.location.host + window.location.pathname +
          '?roomID=' +
          roomID,
      },
    ],
    scenario: {
      mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
    },
    
  });


};

return (
<div
  ref={myMeeting}
  style={{ width: '100vw', height: '100vh' }}
></div>
);
}