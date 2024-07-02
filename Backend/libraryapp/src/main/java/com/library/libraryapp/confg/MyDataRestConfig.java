package com.library.libraryapp.confg;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import com.library.libraryapp.entity.Book;
import com.library.libraryapp.entity.Review;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {
    private String theAllowedOringins = "*";

    @Override
    public void configureRepositoryRestConfiguration(
            RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] theUnSupportedActions = { HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PUT, HttpMethod.PATCH };

        config.exposeIdsFor(Book.class);
        disableHttpMethods(Book.class, config, theUnSupportedActions);

        config.exposeIdsFor(Review.class);
        disableHttpMethods(Review.class, config, theUnSupportedActions);

        cors.addMapping(config.getBasePath() + "/**")
                .allowedOrigins(theAllowedOringins);
    }

    private void disableHttpMethods(
            Class theClass, RepositoryRestConfiguration config, HttpMethod[] theUnsupportedHttpMethod) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure((metadata, httpMethods) -> httpMethods.disable(theUnsupportedHttpMethod))
                .withCollectionExposure((metadatam, httpMethods) -> httpMethods.disable(theUnsupportedHttpMethod));
    }

}
