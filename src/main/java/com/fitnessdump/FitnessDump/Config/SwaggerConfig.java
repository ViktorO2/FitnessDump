package com.fitnessdump.FitnessDump.Config;


import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class SwaggerConfig {

    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("public-api")  // Името на групата (можете да добавите много групи, ако искате)
                .pathsToMatch("/api/**")  // Пътищата, които да се включат в документацията
                .build();
    }
}
