package com.library.libraryapp.confg;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.accept.ContentNegotiationStrategy;
import org.springframework.web.accept.HeaderContentNegotiationStrategy;

@EnableWebSecurity
@Configuration
public class SecurityConfiguration {

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.setSharedObject(ContentNegotiationStrategy.class, new HeaderContentNegotiationStrategy());
        // Okta.configureResourceServer401ResponseBody(http);
        return http
                .authorizeHttpRequests(
                        (req) -> req.requestMatchers("/api/books/secure/**", "/api/reviewss/secure/**").authenticated()
                                .requestMatchers("/**").permitAll())
                .oauth2ResourceServer((srv) -> srv.jwt(Customizer.withDefaults()))
                .cors(Customizer.withDefaults())
                .build();

        // // Disable CORS site forgery
        // http.csrf().disable();

        // // Protect end point at /api/<type>/secure

        // http.authorizeRequests(
        // configurer ->
        // configurer.requestMatchers("/api/books/secure/**").authenticated())
        // .oauth2ResourceServer().jwt();
        // // Add Cors filters
        // http.cors();

        // // Add content nogatiation strategy
        // http.setSharedObject(ContentNegotiationStrategy.class, new
        // HeaderContentNegotiationStrategy());

        // // Force an non-empty response body for 401's to make the response friendly
        // Okta.configureResourceServer401ResponseBody(http);

        // return http.getOrBuild();
    }
}
