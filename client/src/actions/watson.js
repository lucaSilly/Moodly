import {
  INPUT_SUCCESS,
  INPUT_FAIL,
  SESSION_SUCCESS,
  SESSION_FAIL,
  MESSAGE_SUCCESS,
  MESSAGE_FAIL,
  MESSAGE_SUCCESS_LISTTP,
  MESSAGE_SUCCESS_STATUSTP,
  MESSAGE_SUCCESS_CONFIRMATION,
  MESSAGE_SUCCESS_CHOIXCOURS,
  MESSAGE_SUCCESS_AFK,
  MESSAGE_SUCCESS_AFKNON,
  MESSAGE_SUCCESS_AFKOUI
} from "./types";

//  Import axios
import axios from "axios";
let cours = "";
let idCours = "";
let oldNode = "";
let tousTp = [];
let coursListTp = "";
let hastp = true;
let listCoursNON=[];
let needConfirmation=false;
//  Function that handles  users message
export const userMessage = (message) => async (dispatch) => {
  try {
    dispatch({ type: INPUT_SUCCESS, payload: message });
  } catch (err) {
    dispatch({ type: INPUT_FAIL });
  }
};

//  Creates a session - API CALL
export const createSession = () => async (dispatch) => {
  try {
    const res = await axios.get("http://localhost:5000/api/watson/session");
    dispatch({ type: SESSION_SUCCESS, payload: res.data });
  } catch (err) {
    dispatch({ type: SESSION_FAIL });
  }
};

var x;

//  Sends the message to the bot - API CALL
export const sendMessage = (message) => async (dispatch) => {
  clearInterval(x)
  
  try {
    

    let body = { input: message };
    const res = await axios.post("http://localhost:5000/api/watson/message", body);
    let date = "";


    //  TOUS LES TP D'UN COURS
    try{
    if (res.data.output.intents[0]['intent'] == "Date_tp" || (res.data.output.intents[0]['intent'] == "contexte")) {
     
      cours = res.data.output.entities[0]['value'];
      const allCourse = await axios.get("http://localhost:5000/api/moodle/allCourse");


      for (let i = 0; i < allCourse.data.length; i++) {
        if (allCourse.data[i]['fullname'] == cours) {
          body = { input: cours };
          const courseId = await axios.post("http://localhost:5000/api/moodle/courseId", body);
          //console.log(courseId.data.courses['0']['id']);
          idCours = courseId.data.courses['0']['id'];
        }

      }
      if(res.data.output.intents[0]['intent'] != "contexte"){
        
        oldNode = "tous_tp_cours";
      }
      
      needConfirmation = true;
    
    }
    


    //  LE PROCHAIN TP D'UN COURS
    if (res.data.output.intents[0]['intent'] == "prochain_tp") {
      tousTp = [];
      cours = res.data.output.entities[0]['value'];
      const allCourse = await axios.get("http://localhost:5000/api/moodle/allCourse");


      for (let i = 0; i < allCourse.data.length; i++) {
        if (allCourse.data[i]['fullname'] == cours) {
          body = { input: cours };
          const courseId = await axios.post("http://localhost:5000/api/moodle/courseId", body);
          //console.log(courseId.data.courses['0']['id']);
          idCours = courseId.data.courses['0']['id'];
        }

      }
      
      oldNode = "prochain_tp";
      needConfirmation= true;
    }


    //  DEMANDE POUR UN AUTRE COURS
    if (res.data.output.intents[0]['intent'] == "contexte") {

      body = { input: idCours };

      date = await axios.post("http://localhost:5000/api/moodle/allTP", body);
      console.log(date.data.events);

      let listeTp = "";

      if (oldNode == "prochain_tp") {
        let petitedate = "";
        let newDate = "";
        for (let i = 0; i < date.data.events.length; i++) {
          let s = new Date(date.data.events[i]['timeusermidnight'] * 1000);
          //console.log(numDaysBetween(Date.now(),date.data.events[i]['timeusermidnight']));
          console.log("date ajd " + Date.now() + " date tp :" + date.data.events[i]['timeusermidnight'] * 1000);
          if (Date.now() > date.data.events[i]['timeusermidnight'] * 1000) {
            console.log("trop vieux");
            hastp = false;
          }
          else {
            newDate = date.data.events[i]['timeusermidnight'] * 1000;
            if (newDate < petitedate || petitedate == "") {
              petitedate = newDate;
              tousTp.push(date.data.events[i]['id']);
              let isodate =  s.getFullYear()+""+(s.getMonth()+1)+ (s.getDate()-1) + "T230000Z/"+s.getFullYear()+ (s.getMonth()+1)+s.getDate() + "T000000Z";
              listeTp += "\n@" + s.getDate() + "/" + (s.getMonth()+1) + "/" + s.getFullYear()+" : "+ date.data.events[i]['name'].replace("doit être effectué", "") + "/separ/" +date.data.events[i]["url"]+"/separ/"+isodate+ "/separ/" +date.data.events[i]['name'].replace("doit être effectué", "");
              hastp = true;
              x = setTimeout(function() {let payload = "Dis moi, ai-je pu t'aider dans tes recherches ?"; dispatch({type: MESSAGE_SUCCESS_AFK,payload: payload}); }, 15000); 
            }
          }
        }
      }
      else {
        for (let i = 0; i < date.data.events.length; i++) {
          let s = new Date(date.data.events[i]['timeusermidnight'] * 1000);
          //console.log(numDaysBetween(Date.now(),date.data.events[i]['timeusermidnight']));
          console.log("date ajd " + Date.now() + " date tp :" + date.data.events[i]['timeusermidnight'] * 1000);
          if (Date.now() > date.data.events[i]['timeusermidnight'] * 1000) {
            hastp = false;


          }
          else {
            tousTp.push(date.data.events[i]['id']);
            let isodate =  s.getFullYear()+""+(s.getMonth()+1)+ (s.getDate()-1) + "T230000Z/"+s.getFullYear()+ (s.getMonth()+1)+s.getDate() + "T000000Z";
            listeTp += "\n@" + s.getDate() + "/" + (s.getMonth()+1) + "/" + s.getFullYear()+" : "+ date.data.events[i]['name'].replace("doit être effectué", "") + "/separ/" +date.data.events[i]["url"]+"/separ/"+isodate+ "/separ/" +date.data.events[i]['name'].replace("doit être effectué", "");
          hastp = true;
          x = setTimeout(function() {let payload = "Dis moi, ai-je pu t'aider dans tes recherches ?"; dispatch({type: MESSAGE_SUCCESS_AFK,payload: payload}); }, 15000); 
          }
        }
      };
      if (hastp) {
        dispatch({
          type: MESSAGE_SUCCESS_LISTTP,
          payload: res.data.output.generic[0].text + listeTp,

        });
        console.log(oldNode)
        return;

      } else {
        let mess = "Pas de tp disponible pour ce cours"
        x = setTimeout(function() {let payload = "Dis moi, ai-je pu t'aider dans tes recherches ?"; dispatch({type: MESSAGE_SUCCESS_AFK,payload: payload}); }, 15000); 
        dispatch({
          type: MESSAGE_SUCCESS,
          payload: mess,

        });
        console.log(oldNode)
        return;
      }
    }

    



    //  TOUS LES TP A FAIRE
    if (res.data.output.intents[0]['intent'] == "tousTp") {
      let msgbase = false;
      let tplist =[];
      const allCourse = await axios.get("http://localhost:5000/api/moodle/allCourse");
      let listeTp = "";

      for (let i = 0; i < allCourse.data.length; i++) {
        console.log(allCourse);
        body = { input: allCourse.data[i]["fullname"] };
        console.log(body);
        const courseId = await axios.post("http://localhost:5000/api/moodle/courseId", body);
        //console.log(courseId.data.courses['0']['id']);
        idCours = courseId.data.courses['0']['id'];


        body = { input: idCours };

        date = await axios.post("http://localhost:5000/api/moodle/allTP", body);
        console.log(body);
        for (let i = 0; i < date.data.events.length; i++) {
          let s = new Date(date.data.events[i]['timeusermidnight'] * 1000);
          //console.log(numDaysBetween(Date.now(),date.data.events[i]['timeusermidnight']));
          console.log("date ajd " + Date.now() + " date tp :" + date.data.events[i]['timeusermidnight'] * 1000);
          if (Date.now() > date.data.events[i]['timeusermidnight'] * 1000) {
            console.log("trop vieux");
            hastp = false;
           

          }
          else {
            console.log(date.data.events[i]["course"]["fullname"]);
            tousTp.push(date.data.events[i]['id']);
            let isodate =  s.getFullYear()+""+(s.getMonth()+1)+ (s.getDate()-1) + "T230000Z/"+s.getFullYear()+ (s.getMonth()+1)+s.getDate() + "T000000Z";
            listeTp = "@" + s.getDate() + "/" + (s.getMonth()+1) + "/" + s.getFullYear()+" : "+ date.data.events[i]['name'].replace("doit être effectué", "") + "/separ/" +date.data.events[i]["url"]+"/separ/"+isodate+ "/separ/" +date.data.events[i]['name'].replace("doit être effectué", "");
            tplist.push(listeTp)
          console.log(listeTp)
          }
          
        }
         
        
         
          
        
           
       
        /*if(msgbase){
          console.log(listeTp)
        dispatch({
          type: MESSAGE_SUCCESS_LISTTP,
          payload: listeTp,

        });
      }
      else if(listeTp!=""){
        
        console.log(listeTp+"qwqwe")
        dispatch({
          type: MESSAGE_SUCCESS_LISTTP,
          payload: res.data.output.generic[0].text+listeTp,
         
        });
        
       
         msgbase=true
      
       
      
      }
        */
      };
      tplist.forEach(function(item){ 
        
        if(msgbase){
          dispatch({
            type: MESSAGE_SUCCESS_LISTTP,
            payload: item,
           
          })
        }else{
          item = "\n"+item
        dispatch({
        type: MESSAGE_SUCCESS_LISTTP,
        payload: res.data.output.generic[0].text+item,
       
      })
      msgbase=true;
    };})
      x = setTimeout(function() {let payload = "Dis moi, ai-je pu t'aider dans tes recherches ?"; dispatch({type: MESSAGE_SUCCESS_AFK,payload: payload}); }, 15000); 
       

        return;

      
    }


    //  CONFIRMATION
    if (res.data.output.generic[0]["text"] == "Parlez vous bien de ce cours :") {
      let coursConfirm = await axios.post("http://localhost:5000/api/moodle/courseId", body);
      console.log(coursConfirm);
      let texteCours ="\n§ "+ coursConfirm.data.courses[0].fullname;
      dispatch({
        type: MESSAGE_SUCCESS_CONFIRMATION,
        payload: res.data.output.generic[0].text + texteCours,
      });
      return;
    }
   
/*
    //  PLUS D'INFO SUR UN COURS
    if (res.data.output.intents[0]['intent'] == "plusInfo") {
      let textInfo = "";
      for (const tp of tousTp) {
        console.log(coursListTp);
        body = { input: coursListTp };

        date = await axios.post("http://localhost:5000/api/moodle/allTP", body);
        console.log(date.data.events);
        for (let i = 0; i < date.data.events.length; i++) {
          if (tp == date.data.events[i]["id"]) {
            console.log(date.data.events[i]["name"]);
            textInfo += "\n§" + date.data.events[i]["name"].replace("doit être effectué", "") + " " + date.data.events[i]["url"];
          }
        }
      }
      dispatch({
        type: MESSAGE_SUCCESS,
        payload: res.data.output.generic[0].text + textInfo,
      });
      return;

    }
  */  
    //  CONFIRMATION NON
    if(res.data.output.intents[0]['intent'] == "non" && needConfirmation){
      const allCourse = await axios.get("http://localhost:5000/api/moodle/allCourse");
      let listeCours="";
      for (let i = 0; i < allCourse.data.length; i++) {
        console.log(allCourse);
        body = { input: allCourse.data[i]["fullname"] };
        console.log(body);
        const courseId = await axios.post("http://localhost:5000/api/moodle/courseId", body);
        //console.log(courseId.data.courses['0']['id']);
        idCours = courseId.data.courses['0']['id'];
        listCoursNON.push(idCours);
        
        listeCours+="\n@"+(i+1)+allCourse.data[i]["fullname"];
    }
    dispatch({
      type: MESSAGE_SUCCESS_CHOIXCOURS,
      payload: res.data.output.generic[0].text+listeCours,
    })
    oldNode="notTp";
    needConfirmation = false;
    return;
  }
  else if(res.data.output.intents[0]['intent'] == "non" ){
    dispatch({
      type: MESSAGE_SUCCESS,
      payload: res.data.output.generic[0].text,
    })
    return;
  }




  // CHOIX COURS 
  if(oldNode=="notTp"){
    if(res.data.output.entities[0]["value"]<=listCoursNON.length){
    let id = parseInt(res.data.output.entities[0]["value"])-1;
    console.log(id);
    body = { input: listCoursNON[id] };

    date = await axios.post("http://localhost:5000/api/moodle/allTP", body);
    

    let listeTp = "";
    let petitedate = "";
    let newDate = "";
    if(res.data.output.generic[0]["text"]=="Le prochain tp de ce cours est :"){
    for (let i = 0; i < date.data.events.length; i++) {
      let s = new Date(date.data.events[i]['timeusermidnight'] * 1000);
      //console.log(numDaysBetween(Date.now(),date.data.events[i]['timeusermidnight']));
      console.log("date ajd " + Date.now() + " date tp :" + date.data.events[i]['timeusermidnight'] * 1000);
      if (Date.now() > date.data.events[i]['timeusermidnight'] * 1000) {
        console.log("trop vieux");
        hastp = false;
       
      }
      else {
        newDate = date.data.events[i]['timeusermidnight'] * 1000;
        if (newDate < petitedate || petitedate == "") {
          petitedate = newDate;
          tousTp.push(date.data.events[i]['id']);
          let isodate =  s.getFullYear()+""+(s.getMonth()+1)+ (s.getDate()-1) + "T230000Z/"+s.getFullYear()+ (s.getMonth()+1)+s.getDate() + "T000000Z";
          listeTp += "\n@" + s.getDate() + "/" + (s.getMonth()+1) + "/" + s.getFullYear()+" : "+ date.data.events[i]['name'].replace("doit être effectué", "") + "/separ/" +date.data.events[i]["url"]+"/separ/"+isodate+ "/separ/" +date.data.events[i]['name'].replace("doit être effectué", "");
      hastp = true;
     
        }
      }
    }
  
    }
    else if(res.data.output.generic[0]["text"]=="Les prochain tp de ce cours est :"){
      for (let i = 0; i < date.data.events.length; i++) {
        let s = new Date(date.data.events[i]['timeusermidnight'] * 1000);
        //console.log(numDaysBetween(Date.now(),date.data.events[i]['timeusermidnight']));
        console.log("date ajd " + Date.now() + " date tp :" + date.data.events[i]['timeusermidnight'] * 1000);
        if (Date.now() > date.data.events[i]['timeusermidnight'] * 1000) {
          console.log("trop vieux");
          hastp = false;
         
        }
        else {
          newDate = date.data.events[i]['timeusermidnight'] * 1000;
        
            petitedate = newDate;
            tousTp.push(date.data.events[i]['id']);
            let isodate =  s.getFullYear()+""+(s.getMonth()+1)+ (s.getDate()-1) + "T230000Z/"+s.getFullYear()+ (s.getMonth()+1)+s.getDate() + "T000000Z";
            listeTp += "\n@" + s.getDate() + "/" + (s.getMonth()+1) + "/" + s.getFullYear()+" : "+ date.data.events[i]['name'].replace("doit être effectué", "") + "/separ/" +date.data.events[i]["url"]+"/separ/"+isodate+ "/separ/" +date.data.events[i]['name'].replace("doit être effectué", "");
          hastp = true;
          
        }
      }
    
    }
    if (hastp) {
      x = setTimeout(function() {let payload = "Dis moi, ai-je pu t'aider dans tes recherches ?"; dispatch({type: MESSAGE_SUCCESS_AFK,payload: payload}); }, 15000); 
      dispatch({
        type: MESSAGE_SUCCESS_LISTTP,
        payload: res.data.output.generic[0].text + listeTp,

      });

      return;

    } else {
      x = setTimeout(function() {let payload = "Dis moi, ai-je pu t'aider dans tes recherches ?"; dispatch({type: MESSAGE_SUCCESS_AFK,payload: payload}); }, 15000); 
      let mess = "Pas de tp disponible pour ce cours"
      dispatch({
        type: MESSAGE_SUCCESS,
        payload: mess,

      });
      
      return;
    }
    return;
  }}


  //  STATUS DES TPS
  if (res.data.output.intents[0]['intent'] == "status"){
    const allCourse = await axios.get("http://localhost:5000/api/moodle/allCourse");
    let status="";
    let putCours=true;
      for (let i = 0; i < allCourse.data.length; i++) {
        //console.log(allCourse);
        body = { input: allCourse.data[i]["fullname"] };
        //console.log(body);
        let nomCours = body.input;
        const courseId = await axios.post("http://localhost:5000/api/moodle/courseId", body);
        //console.log(courseId.data.courses['0']['id']);
        idCours = courseId.data.courses['0']['id'];
        //console.log(idCours);

        body = { input: idCours };

        date = await axios.post("http://localhost:5000/api/moodle/tpdate", body);
        //console.log(date);
        let state="";
        //chaque module de chaque cours : chaque section -> chaque module dans la section
        for (let i = 0; i < date.data.length; i++) {
          if(date.data[i]["modules"]!=""){ 
            for(let y =0; y < date.data[i]["modules"].length;y++){
              if(date.data[i]["modules"][y]["modname"]=="assign"){
                let tpStatus = await axios.post("http://localhost:5000/api/moodle/tpStatus", body);
                //console.log(tpStatus);
                for(let t = 0; t<tpStatus.data.statuses.length;t++){
            
                  if(date.data[i]["modules"][y]["id"]==tpStatus.data.statuses[t]["cmid"]){
                    
                    if(tpStatus.data.statuses[t]["state"]==1){
                      state = "rendu"
                      
                      
                    }
                    
                    if(tpStatus.data.statuses[t]["state"]==0){
                      try{
                      if(Date.now() >( date.data[i]["modules"][y]["dates"][1]["timestamp"]*1000)){
                        state="retard"
                      }
                      else{
                      state = "en attente"
                      }
                    }catch(e){
                      console.log(e);
                    }
                    }


                    //Date.now() > date.data[i]["modules"][y]["dates"][1]["timestamp"]*1000)
                  if(putCours){
                  status += "\n~ "+nomCours+"\n@"+date.data[i]["modules"][y]["name"] +" : "+state+ "/separ/" +date.data[i]["modules"][y]["url"];
                  putCours=false;
                  }
                  else{
                    status += "\n@"+date.data[i]["modules"][y]["name"] +" : "+state+/separ/+ date.data[i]["modules"][y]["url"];
                    putCours=false;
                  }
                
                }

                
              }
          
              
            }
          }
        }
       
        }
        putCours=true;
      }



      x = setTimeout(function() {let payload = "Dis moi, ai-je pu t'aider dans tes recherches ?"; dispatch({type: MESSAGE_SUCCESS_AFK,payload: payload}); }, 15000); 
   
    dispatch({
      type: MESSAGE_SUCCESS_STATUSTP,
      payload: res.data.output.generic[0].text+status,

    });
    return;
  }


  //  AFK
  if (res.data.output.intents[0]['intent'] == "afknon") {
    dispatch({
      type: MESSAGE_SUCCESS_AFKNON,
      payload: res.data.output.generic[0].text,

    });


    return;
  }


  if (res.data.output.intents[0]['intent'] == "afkoui") {
    dispatch({
      type: MESSAGE_SUCCESS_AFKOUI,
      payload: res.data.output.generic[0].text,

    });


    return;
  }

  if (res.data.output.intents[0]['intent'] == "encorequestionoui") {
    dispatch({
      type: MESSAGE_SUCCESS_AFKNON,
      payload: res.data.output.generic[0].text,

    });


    return;
  }



    //  CONFIRMATION OUI
    if (res.data.output.intents[0]['intent'] == "oui") {
    
      body = { input: idCours };

      date = await axios.post("http://localhost:5000/api/moodle/allTP", body);
     
      if(typeof date.data.events!=='undefined'){
      console.log(date.data.events);
      console.log(date);

      console.log(date.data.events);

      if (date.data.events != undefined) {
        let listeTp = "";

        if (oldNode == "prochain_tp") {
          let petitedate = "";
          let newDate = "";
          for (let i = 0; i < date.data.events.length; i++) {
            let s = new Date(date.data.events[i]['timeusermidnight'] * 1000);
            //console.log(numDaysBetween(Date.now(),date.data.events[i]['timeusermidnight']));
            console.log("date ajd " + Date.now() + " date tp :" + date.data.events[i]['timeusermidnight'] * 1000);
            if (Date.now() > date.data.events[i]['timeusermidnight'] * 1000) {
              hastp = false;
              
            }
            else {
              newDate = date.data.events[i]['timeusermidnight'] * 1000;
              if (newDate < petitedate || petitedate == "") {
                petitedate = newDate;
                tousTp.push(date.data.events[i]['id']);
                let isodate =  s.getFullYear()+""+(s.getMonth()+1)+ (s.getDate()-1) + "T230000Z/"+s.getFullYear()+ (s.getMonth()+1)+s.getDate() + "T000000Z";
                listeTp += "\n@" + s.getDate() + "/" + (s.getMonth()+1) + "/" + s.getFullYear()+" : "+ date.data.events[i]['name'].replace("doit être effectué", "") + "/separ/" +date.data.events[i]["url"]+"/separ/"+isodate+ "/separ/" +date.data.events[i]['name'].replace("doit être effectué", "");
                  hastp = true;
                  x = setTimeout(function() {let payload = "Dis moi, ai-je pu t'aider dans tes recherches ?"; dispatch({type: MESSAGE_SUCCESS_AFK,payload: payload}); }, 15000); 
                dispatch({
                  type: MESSAGE_SUCCESS_LISTTP,
                  payload: res.data.output.generic[0].text + listeTp,
      
                });
              }
            }
          }
        }
        else {
          for (let i = 0; i < date.data.events.length; i++) {
            let s = new Date(date.data.events[i]['timeusermidnight'] * 1000);
            //console.log(numDaysBetween(Date.now(),date.data.events[i]['timeusermidnight']));
            console.log("date ajd " + Date.now() + " date tp :" + date.data.events[i]['timeusermidnight'] * 1000);
            if (Date.now() > date.data.events[i]['timeusermidnight'] * 1000) {
              console.log("trop vieux");
              hastp = false;
             
            }
            else {
              tousTp.push(date.data.events[i]['id']);
              let isodate =  s.getFullYear()+""+(s.getMonth()+1)+ (s.getDate()-1) + "T230000Z/"+s.getFullYear()+ (s.getMonth()+1)+s.getDate() + "T000000Z";
              listeTp += "\n@" + s.getDate() + "/" + (s.getMonth()+1) + "/" + s.getFullYear()+" : "+ date.data.events[i]['name'].replace("doit être effectué", "") + "/separ/" +date.data.events[i]["url"]+"/separ/"+isodate+ "/separ/" +date.data.events[i]['name'].replace("doit être effectué", "");
              hastp = true;
             
              dispatch({
                type: MESSAGE_SUCCESS_LISTTP,
                payload: res.data.output.generic[0].text + listeTp,
    
              });
              listeTp ="";
            }
          }
          x = setTimeout(function() {let payload = "Dis moi, ai-je pu t'aider dans tes recherches ?"; dispatch({type: MESSAGE_SUCCESS_AFK,payload: payload}); }, 15000); 
        };
        if (hastp) {

          /*dispatch({
            type: MESSAGE_SUCCESS_LISTTP,
            payload: res.data.output.generic[0].text + listeTp,

          });
          */          
          console.log(tousTp);
        }
        else {
          x = setTimeout(function() {let payload = "Dis moi, ai-je pu t'aider dans tes recherches ?"; dispatch({type: MESSAGE_SUCCESS_AFK,payload: payload}); }, 15000); 
          let mess = "Pas de tp disponible pour ce cours"
          dispatch({
            type: MESSAGE_SUCCESS,
            payload: mess,

          });


          return;
        }
      }
      coursListTp = idCours;
      idCours = "";
      needConfirmation = false;
    }
    else{
      dispatch({
        type: MESSAGE_SUCCESS,
        payload: res.data.output.generic[0].text,

      });


      return;
    }
    }
    
    else{
     
      dispatch({
        type: MESSAGE_SUCCESS,
        payload: res.data.output.generic[0].text,

      });


      return;
    }
  }
  catch(e){
    console.log(res)


    try{

      if(res.data=="Problem on processing your request"){
       
          const res = await axios.get("http://localhost:5000/api/watson/session");
          dispatch({ type: SESSION_SUCCESS, payload: res.data });
          alert("La page va se relancer pour actualiser la clé d'authentification")
          window.location.reload();
        
      };

      if (res.data.output.intents[0]['intent'] == "afknon") {
        dispatch({
          type: MESSAGE_SUCCESS_AFKNON,
          payload: res.data.output.generic[0].text,
    
        });
    
    
        return;
      }
    
      if (res.data.output.intents[0]['intent'] == "status"){
        const allCourse = await axios.get("http://localhost:5000/api/moodle/allCourse");
        let status="";
        let putCours=true;
          for (let i = 0; i < allCourse.data.length; i++) {
            //console.log(allCourse);
            body = { input: allCourse.data[i]["fullname"] };
            //console.log(body);
            let nomCours = body.input;
            const courseId = await axios.post("http://localhost:5000/api/moodle/courseId", body);
            //console.log(courseId.data.courses['0']['id']);
            idCours = courseId.data.courses['0']['id'];
            //console.log(idCours);
    
            body = { input: idCours };
    
            date = await axios.post("http://localhost:5000/api/moodle/tpdate", body);
            //console.log(date);
            let state="";
            //chaque module de chaque cours : chaque section -> chaque module dans la section
            for (let i = 0; i < date.data.length; i++) {
              if(date.data[i]["modules"]!=""){ 
                for(let y =0; y < date.data[i]["modules"].length;y++){
                  if(date.data[i]["modules"][y]["modname"]=="assign"){
                    let tpStatus = await axios.post("http://localhost:5000/api/moodle/tpStatus", body);
                    //console.log(tpStatus);
                    for(let t = 0; t<tpStatus.data.statuses.length;t++){
                
                      if(date.data[i]["modules"][y]["id"]==tpStatus.data.statuses[t]["cmid"]){
                        
                        if(tpStatus.data.statuses[t]["state"]==1){
                          state = "rendu"
                          
                          
                        }
                        
                        if(tpStatus.data.statuses[t]["state"]==0){
                          try{
                          if(Date.now() >( date.data[i]["modules"][y]["dates"][1]["timestamp"]*1000)){
                            state="retard"
                          }
                          else{
                          state = "en attente"
                          }
                        }catch(e){
                          console.log(e);
                        }
                        }
    
    
                        //Date.now() > date.data[i]["modules"][y]["dates"][1]["timestamp"]*1000)
                      if(putCours){
                      status += "\n~ "+nomCours+"\n@"+date.data[i]["modules"][y]["name"] +" : "+state+ "/separ/" +date.data[i]["modules"][y]["url"];
                      putCours=false;
                      }
                      else{
                        status += "\n@"+date.data[i]["modules"][y]["name"] +" : "+state+/separ/+ date.data[i]["modules"][y]["url"];
                        putCours=false;
                      }
                    
                    }
    
                    
                  }
              
                  
                }
              }
            }
           
            }
            putCours=true;
          }
    
    
    
          x = setTimeout(function() {let payload = "Dis moi, ai-je pu t'aider dans tes recherches ?"; dispatch({type: MESSAGE_SUCCESS_AFK,payload: payload}); }, 15000); 
       
        dispatch({
          type: MESSAGE_SUCCESS_STATUSTP,
          payload: res.data.output.generic[0].text+status,
    
        });
        return;
      }
    

    if( res.data.output.generic[0]['text'] == "Vous n'êtes pas inscris à ce cours voici la liste des cours auxquels vous êtes inscris :"){
      const allCourse = await axios.get("http://localhost:5000/api/moodle/allCourse");
      let listeCours="";
      for (let i = 0; i < allCourse.data.length; i++) {
        console.log(allCourse);
        body = { input: allCourse.data[i]["fullname"] };
        console.log(body);
        const courseId = await axios.post("http://localhost:5000/api/moodle/courseId", body);
        //console.log(courseId.data.courses['0']['id']);
        idCours = courseId.data.courses['0']['id'];
        listCoursNON.push(idCours);
        
        listeCours+="\n@"+(i+1)+allCourse.data[i]["fullname"];
    }
    dispatch({
      type: MESSAGE_SUCCESS_CHOIXCOURS,
      payload: res.data.output.generic[0].text+listeCours,
    })
    oldNode="notTp";
    needConfirmation = false;
    return;
  }
  else if(res.data.output.intents[0]['intent'] == "non" ){
    dispatch({
      type: MESSAGE_SUCCESS,
      payload: res.data.output.generic[0].text,
    })
    return;
  }
  else{
    dispatch({
      type: MESSAGE_SUCCESS,
      payload: res.data.output.generic[0].text,
    })
    return
  }

  



}
catch(e){
      dispatch({
        type: MESSAGE_SUCCESS,
        payload: res.data.output.generic[0].text,

      });


      return;
    }  

  }


  } catch (err) {
    dispatch({ type: MESSAGE_FAIL });
  }
  
 
};


 


var numDaysBetween = function (d1, d2) {
  var diff = Math.abs(d1 - d2);

  return diff / (60 * 60 * 24);
};
