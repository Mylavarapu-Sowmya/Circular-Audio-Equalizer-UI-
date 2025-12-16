package com.example.stream;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.BinaryWebSocketHandler;

public class AudioWebSocketHandler extends BinaryWebSocketHandler {

 @Override
 protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message) throws Exception {
     // Here we would call Gemini API streaming
     String fakePartial = "Partial Transcript: received " + message.getPayload().remaining() + " bytes";
     session.sendMessage(new TextMessage(fakePartial));
 }
}
