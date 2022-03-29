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
} from "../actions/types";

// Initial state
const initialState = {
  messages: [],
};

// Switch statement - update state
export default (state = initialState, action) => {
  const { type, payload } = action;
  let { messages } = state;

  switch (type) {
    case INPUT_SUCCESS:
      messages = [...messages, { message: payload, type: "user" }];
      return {
        ...state,
        messages,
      };
    case INPUT_FAIL:
      return {
        ...state,
      };
    case SESSION_SUCCESS:
      localStorage.setItem("session", payload["session_id"]);
      return {
        ...state,
      };
    case SESSION_FAIL:
      return {
        ...state,
      };
    case MESSAGE_SUCCESS:
      messages = [...messages, { message: payload, type: "bot" }];
      return {
        ...state,
        messages,
      };
    case MESSAGE_SUCCESS_LISTTP:
      messages = [...messages, { message: payload, type: "botTPLIST" }];
      return {
        ...state,
        messages,
      };
    case MESSAGE_SUCCESS_STATUSTP:
      messages = [...messages, { message: payload, type: "tpstatus" }];
      return {
        ...state,
        messages,
      };
    case MESSAGE_SUCCESS_CONFIRMATION:
      messages = [...messages, { message: payload, type: "confirmation" }];
      return {
        ...state,
        messages,
      };  
    case MESSAGE_SUCCESS_CHOIXCOURS:
      messages = [...messages, { message: payload, type: "choixcours" }];
      return {
        ...state,
        messages,
        };  
       case MESSAGE_SUCCESS_AFK:
      messages = [...messages, { message: payload, type: "afk" }];
      return {
        ...state,
        messages,
        };
        case MESSAGE_SUCCESS_AFKNON:
          messages = [...messages, { message: payload, type: "afknon" }];
          return {
            ...state,
            messages,
            };    
            case MESSAGE_SUCCESS_AFKOUI:
          messages = [...messages, { message: payload, type: "afkoui" }];
          return {
            ...state,
            messages,
            };    
    case MESSAGE_FAIL:
      return {
        ...state,
      };
    default:
      return {
        ...state,
      };
  }
};