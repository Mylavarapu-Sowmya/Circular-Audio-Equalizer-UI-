package com.example.stream;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration @EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer{
 @Override public void registerWebSocketHandlers(WebSocketHandlerRegistry r){
   r.addHandler(new AudioWebSocketHandler(), "/audio").setAllowedOrigins("*");
 }
}
