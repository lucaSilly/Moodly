import React, { useState, useEffect, useRef, Fragment } from "react";
import { connect } from "react-redux";
import ReactDOM from 'react-dom'
//  Import action
import { userMessage, sendMessage } from "../../actions/watson";

let choix= new Map();
let lien = "";
let dateTP ="";
let nomtp = "";
let settimer = false;

const Chat = ({ chat, userMessage, sendMessage }) => {
  // Handle Users Message
  const [message, setMessage] = useState("");
  const endOfMessages = useRef(null);

  const scrollToBottom = () => {
    endOfMessages.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [chat]);

  //  Function that handles user submission
  const handleClick = async (e) => {
    const code = e.keyCode || e.which;
   
    if (code === 13 && document.getElementById("chatBox").value!=="") {
      console.log(message);
      userMessage(message);
      sendMessage(message);
      setMessage("");
      
    }
  };
 //chat.forEach((mess) => mess = mess["type"]=="botTPLIST" ? console.log("test"): console.log("pas test"));
  
/*if(chat[chat.length-1].type=="botTEST"){
  console.log("qwijeqwjeijwqeqw");
}*/
if(chat.length>1){
//console.log(chat[chat.length-1]["type"]);
//console.log(chat[chat.length-1]["type"]=="botTPLIST");
}




//span==="" ? span="test" : span = "tps"
  return (
    <div className="chat">
      <h1>Moodly</h1>
      <hr/>
      {/* Handle Messages */}
      <div className="historyContainer">
      <div className="message">
      <div className="botHello">
        Salut 😃 <br/>
       Je suis moodly! Un chat bot connecté avec moodle. 
       <br/>
       Je peux t'aider à gérer tes différents travaux des cours que tu suis. 
       <br/>
       Tu peux me demander le prochain tp de l'un de tes cours, tous les tp d'un autre ou alors
       pose-moi une question ou sélectionne une des options en dessous :
<br/>
📅  Tous les tps que tu dois faire
<br/>
🗽  Le statut des tps
      </div>
      <div class="boutons">
        <button onClick={function(){userMessage("Les tp qui me restent à faire?");sendMessage("Les tp qui me restent à faire?");setMessage("");}} class="helloBT">📅</button>
        <button onClick={function(){userMessage("Ou j'en suis des tp");sendMessage("Ou j'en suis des tp");setMessage("");}} class="helloBT">🗽</button>
      </div>
      </div>

      
     {
       
      chat.length>1 &&
      
 
      chat.map((msg) => <div>
        
       
        
        <div className={msg.type}>{msg.message.split('\n').map(function(item,key){
      let span =""; 
      
      msg["type"]=="botTPLIST" 
      ?  
      item.includes("§") ? (function(){item=item.substring(1);span="tp";})() : 
        item.includes("@") ? (function(){item=item.substring(1);span="lienTp";})() : span = ""
      :
      item.includes("§") ? (function(){item=item.substring(1);span="tp";})() : 
      span=span
      
      msg["type"]=="tpstatus" 
      ?  
      item.includes("~") ? (function(){item=item.substring(1);span="tpStat";})() :
        item.includes("@") ? (function(){
          if(item.includes("retard")){
            span="retard"
          }else if(item.includes("rendu")){
            span="rendu"
          }else if(item.includes("en attente")){
            span="pasdonner"
          };
          item=item.substring(1);})() : span = "" 
      :
      span = span;
      
      msg["type"]=="choixcours"
      ?
      (function(){
        if(item.includes("@")){
          item=item.substring(1);
          
          switch(item.charAt(0)){
            case "1" :
              item = item.substring(1);
              choix.set(1,item);
              item = "1️⃣"+item;
              break;
             case "2" :
              item = item.substring(1);
              choix.set(2,item);
              item = "2️⃣"+item;
              break;
             case "3" :
              item = item.substring(1);
              choix.set(3,item);
              item = "3️⃣"+item;
              break;
             case "4" :
              item = item.substring(1);
              choix.set(4,item);
              item = "4️⃣"+item;
              break;
            case "5" :
              item = item.substring(1);
              choix.set(5,item);
              item = "5️⃣"+item;
              break;
            case "6" :
              item = item.substring(1);
              choix.set(6,item);
              item = "6️⃣"+item;
              break;
            case "7" :
              item = item.substring(1);
              choix.set(7,item);
              item = "7️⃣"+item;
              break;
              case "8" :
              item = item.substring(1);
              choix.set(8,item);
              item = "8️⃣"+item;
              break;
              case "9" :
              item = item.substring(1);
              choix.set(9,item);
              item = "9️⃣"+item;
              break;
              default:
                choix.set("",item);
                item = ""+item
                
          }
          
          span = "courchoix";
        }      
      })()
      :
       span = span;

      return(
        
        <span class = {span} key = {key}>
         
          {(function(){
             
            if(span == "lienTp"){ 
              let items = item.split("/separ/");
              lien = items[1];
              dateTP = items[2];
              nomtp =items[3].replace(" ","+");
              
              
              return<a href={items[1]} class='tplink' key = {key}>{items[0]}</a>;}
            else if(span =="tpStat" || span=="retard"  || span=="rendu"  || span=="pasdonner"){ 
             
              
              let items = item.split("/separ/");
              lien = items[1];
             
              
              
              return<a href={items[1]} class={span} key = {key}>{items[0]}</a>;}
            {
              return item
                }})()}



          
                <br/>
        </span>
        );
      
          
      
      },
      
      function(){
        console.log("yo")
      }
        
      
    
      )
      
     
      
      }</div>
      {msg.type=="confirmation"&&(function(){return(<div class="boutons"> 
        <button onClick={function(){userMessage("oui");sendMessage("oui");setMessage("");}} class="btConf">✔️</button>
        <button onClick={function(){userMessage("non");sendMessage("non");setMessage("");}} class="btConf">❌</button>
        </div>)})()
}

{
  
  

msg.type=="botTPLIST"&&(function(){return(<div>
        <a href={lien}>
        <button class="btConf">Lien 🔗</button>
        </a>
        
        <a href={lien="https://calendar.google.com/calendar/r/eventedit?text="+nomtp+"&dates="+dateTP+"&details="+lien}>
          <button class="btConf">Add 📆</button>
        </a>

        </div>)})()
        
}

{msg.type=="afk"&&(function(){return(<div>
        <button onClick={function(){userMessage("oui");sendMessage("userafkpassphr@seOUI");setMessage("");}} class="btConf">✔️</button>
        <button onClick={function(){userMessage("non");sendMessage("userafkpassphr@seNON");setMessage("");}} class="btConf">❌</button>
</div>
)

}())}

{msg.type=="afknon"&&(function(){return(<div>
  <button onClick={function(){userMessage("Les tp qui me restent à faire?");sendMessage("Les tp qui me restent à faire?");setMessage("");}} class="btConf">📅</button>
        <button onClick={function(){userMessage("Ou j'en suis des tp");sendMessage("Ou j'en suis des tp");setMessage("");}} class="btConf">🗽</button>
</div>
)

}())}


{msg.type=="afkoui"&&(function(){return(<div>
        <button onClick={function(){userMessage("oui");sendMessage("encorequestionoui");setMessage("");}} class="btConf">✔️</button>
        <button onClick={function(){userMessage("non");sendMessage("encorequestionnon");setMessage("");}} class="btConf">❌</button>
</div>
)

}())}


 {      msg.type=="choixcours"&&(function(){
         
              switch (choix.size){
                case 1 :
                  return (
                    <div id="btChoix">
                  <button onClick={function(){userMessage(choix.get(1));sendMessage("1");setMessage("");}} class="btConf">1️⃣</button>
                 
                  
                  </div>
                  )
                  break;
                  case 2 :
                    return (
                      <div id="btChoix">
                    <button onClick={function(){userMessage(choix.get(1));sendMessage("1");setMessage("");}} class="btConf">1️⃣</button>
                    <button onClick={function(){userMessage(choix.get(2));sendMessage("2");setMessage("");}} class="btConf">2️⃣</button>
                    <button onClick={function(){userMessage("non");sendMessage("non");setMessage("");}} class="btConf">❌</button>
                    
                    </div>
                    )
                    break;
                    case 3 :
                      return (
                        <div id="btChoix">
                      <button onClick={function(){userMessage(choix.get(1));sendMessage("1");setMessage("");}} class="btConf">1️⃣</button>
                      <button onClick={function(){userMessage(choix.get(2));sendMessage("2");setMessage("");}} class="btConf">2️⃣</button>
                      <button onClick={function(){userMessage(choix.get(3));sendMessage("3");setMessage("");}} class="btConf">3️⃣</button>
                      <button onClick={function(){userMessage("non");sendMessage("non");setMessage("");}} class="btConf">❌</button>
                      
                      </div>
                      )
                      break;
                      case 4 :
                        return (
                          <div id="btChoix">
                        <button onClick={function(){userMessage(choix.get(1));sendMessage("1");setMessage("");}} class="btConf">1️⃣</button>
                        <button onClick={function(){userMessage(choix.get(2));sendMessage("2");setMessage("");}} class="btConf">2️⃣</button>
                        <button onClick={function(){userMessage(choix.get(3));sendMessage("3");setMessage("");}} class="btConf">3️⃣</button>
                        <button onClick={function(){userMessage(choix.get(4));sendMessage("4");setMessage("");}} class="btConf">4️⃣</button>
                        <button onClick={function(){userMessage("non");sendMessage("non");setMessage("");}} class="btConf">❌</button>
                        </div>
                        )
                        break;
                        case 5 :
                          return (
                            <div id="btChoix">
                          <button onClick={function(){userMessage(choix.get(1));sendMessage("1");setMessage("");}} class="btConf">1️⃣</button>
                          <button onClick={function(){userMessage(choix.get(2));sendMessage("2");setMessage("");}} class="btConf">2️⃣</button>
                          <button onClick={function(){userMessage(choix.get(3));sendMessage("3");setMessage("");}} class="btConf">3️⃣</button>
                          <button onClick={function(){userMessage(choix.get(4));sendMessage("4");setMessage("");}} class="btConf">4️⃣</button>
                          <button onClick={function(){userMessage(choix.get(5));sendMessage("5");setMessage("");}} class="btConf">5️⃣</button>
                          <button onClick={function(){userMessage("non");sendMessage("non");setMessage("");}} class="btConf">❌</button>
                          </div>
                          )
                          break;
                          case 6 :
                            return (
                              <div id="btChoix">
                            <button onClick={function(){userMessage(choix.get(1));sendMessage("1");setMessage("");}} class="btConf">1️⃣</button>
                            <button onClick={function(){userMessage(choix.get(2));sendMessage("2");setMessage("");}} class="btConf">2️⃣</button>
                            <button onClick={function(){userMessage(choix.get(3));sendMessage("3");setMessage("");}} class="btConf">3️⃣</button>
                            <button onClick={function(){userMessage(choix.get(4));sendMessage("4");setMessage("");}} class="btConf">4️⃣</button>
                            <button onClick={function(){userMessage(choix.get(5));sendMessage("5");setMessage("");}} class="btConf">5️⃣</button>
                            <button onClick={function(){userMessage(choix.get(6));sendMessage("6");setMessage("");}} class="btConf">6️⃣</button>
                            <button onClick={function(){userMessage("non");sendMessage("non");setMessage("");}} class="btConf">❌</button>
                            </div>
                            )
                            break;
                            case 7 :
                              return (
                                <div id="btChoix">
                              <button onClick={function(){userMessage(choix.get(1));sendMessage("1");setMessage("");}} class="btConf">1️⃣</button>
                              <button onClick={function(){userMessage(choix.get(2));sendMessage("2");setMessage("");}} class="btConf">2️⃣</button>
                              <button onClick={function(){userMessage(choix.get(3));sendMessage("3");setMessage("");}} class="btConf">3️⃣</button>
                              <button onClick={function(){userMessage(choix.get(4));sendMessage("4");setMessage("");}} class="btConf">4️⃣</button>$
                              <button onClick={function(){userMessage(choix.get(5));sendMessage("5");setMessage("");}} class="btConf">5️⃣</button>
                            <button onClick={function(){userMessage(choix.get(6));sendMessage("6");setMessage("");}} class="btConf">6️⃣</button>
                            <button onClick={function(){userMessage(choix.get(7));sendMessage("7");setMessage("");}} class="btConf">7️⃣</button>
                            <button onClick={function(){userMessage("non");sendMessage("non");setMessage("");}} class="btConf">❌</button>
                              
                              </div>
                              )
                              break;
                              case 8 :
                                return (
                                  <div id="btChoix">
                                <button onClick={function(){userMessage(choix.get(1));sendMessage("1");setMessage("");}} class="btConf">1️⃣</button>
                                <button onClick={function(){userMessage(choix.get(2));sendMessage("2");setMessage("");}} class="btConf">2️⃣</button>
                                <button onClick={function(){userMessage(choix.get(3));sendMessage("3");setMessage("");}} class="btConf">3️⃣</button>
                                <button onClick={function(){userMessage(choix.get(4));sendMessage("4");setMessage("");}} class="btConf">4️⃣</button>
                                <button onClick={function(){userMessage(choix.get(5));sendMessage("5");setMessage("");}} class="btConf">5️⃣</button>
                            <button onClick={function(){userMessage(choix.get(6));sendMessage("6");setMessage("");}} class="btConf">6️⃣</button>
                            <button onClick={function(){userMessage(choix.get(7));sendMessage("7");setMessage("");}} class="btConf">7️⃣</button>
                            <button onClick={function(){userMessage(choix.get(8));sendMessage("8");setMessage("");}} class="btConf">8️⃣</button>
                            <button onClick={function(){userMessage("non");sendMessage("non");setMessage("");}} class="btConf">❌</button>
                                </div>
                                )
                                break;
                                case 9 :
                                  return (
                                    <div id="btChoix">
                                  <button onClick={function(){userMessage(choix.get(1));sendMessage("1");setMessage("");}} class="btConf">1️⃣</button>
                                  <button onClick={function(){userMessage(choix.get(2));sendMessage("2");setMessage("");}} class="btConf">2️⃣</button>
                                  <button onClick={function(){userMessage(choix.get(3));sendMessage("3");setMessage("");}} class="btConf">3️⃣</button>
                                  <button onClick={function(){userMessage(choix.get(4));sendMessage("4");setMessage("");}} class="btConf">4️⃣</button>
                                  <button onClick={function(){userMessage(choix.get(5));sendMessage("5");setMessage("");}} class="btConf">5️⃣</button>
                            <button onClick={function(){userMessage(choix.get(6));sendMessage("6");setMessage("");}} class="btConf">6️⃣</button>
                            <button onClick={function(){userMessage(choix.get(7));sendMessage("7");setMessage("");}} class="btConf">7️⃣</button>
                            <button onClick={function(){userMessage(choix.get(8));sendMessage("8");setMessage("");}} class="btConf">8️⃣</button>
                            <button onClick={function(){userMessage(choix.get(9));sendMessage("8");setMessage("");}} class="btConf">9️⃣</button>
                            <button onClick={function(){userMessage("non");sendMessage("non");setMessage("");}} class="btConf">❌</button>
                                  </div>
                                  )
                                  break;
                
              }
              
              /*for(let [cours,nb] of choix.entries()){
              console.log(nb+cours);
              ReactDOM.render(
             <button onClick={function(){userMessage(nb);sendMessage(cours);setMessage("");}} class="btConf">❌</button>,
             document.getElementById("root")
            );
              

            }
            */
           
          
            
  

         
    })()
        }
      </div>
      
      )
       //chat.length === 0 ? "" : chat.map((msg) => <div className={msg.type}>{msg.message}</div>)
       
        
    }

      {  /*function(){chat.map((msg)=>{
          if(msg.type=="confirmation"){
            console.log("j")
            return(
              <div>
                <button>oui</button>
                <button>non</button>
                </div>
            )
          }
          
          })}*/}
       
      
      
        <div ref={endOfMessages}></div>
      </div>
      {/* Input Box */}
      <input
        id="chatBox"
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleClick}
        value={message}
        placeholder="Pose ta question à Moodly!"
      ></input>
    </div>
  );
  
};

const mapStateToProps = (state) => ({
  chat: state.watson.messages,




});

export default connect(mapStateToProps, { userMessage, sendMessage })(Chat);